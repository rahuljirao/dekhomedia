import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as action from '../Action/Tickets/Tickets_Action';
import NumberDisplay from "./NumberDisplay/Index";
import { useAuth } from "../context/Context";

const Tickets = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const tableRef = useRef(null);
    const dataTableInstanceRef = useRef(null);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;

        let currentSize = window.innerWidth <= 450 ? 'mobile' : 'desktop';

        function setPaginationOptions() {
            if (currentSize === 'mobile') {
                $.fn.dataTable.ext.pager.numbers_length = 0;
                return 'simple';
            } else {
                $.fn.dataTable.ext.pager.numbers_length = 5;
                return 'simple_numbers';
            }
        }


        const initDataTable = () => {
            const pagingType = setPaginationOptions();

            if ($ && tableRefCurrent) {
                dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                    processing: true,
                    serverSide: true,
                    scrollX: true,
                    pagingType: pagingType,
                    ajax: (dataTablesParams, callback) => {
                        const columns = [null, 'ticket_id', 'name', 'email', 'reason', 'description', 'status', 'created_at'];
                        const sortColumnIndex = dataTablesParams.order[0].column;
                        const sortColumnName = columns[sortColumnIndex];
                        const params = {
                            search: dataTablesParams.search.value,
                            start: dataTablesParams.start,
                            length: dataTablesParams.length,
                            dir: dataTablesParams.order[0].dir,
                            sortColumn: sortColumnName,
                        };
                        dispatch(action.getTicketList(params)).then((action) => {
                            setCount(action.responseDetails.totalRecords || 0);
                            callback({
                                data: action.responseDetails.data || [],
                                recordsTotal: action.responseDetails.totalRecords || 0,
                                recordsFiltered: action.responseDetails.recordsFiltered || 0,
                            });
                        });
                    },
                    destroy: true,
                    order: [[7, 'desc']],
                    columns: [
                        {
                            data: null,
                            title: 'No',
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { data: 'ticket_id', title: 'Ticket No.' },
                        { data: 'name', title: 'Name' },
                        { data: 'email', title: 'Email' },
                        { data: 'reason', title: 'reason' },
                        { data: 'description', title: 'description' },
                        {
                            data: 'status',
                            title: 'status',
                            render: function (data, type, row) {
                                // const id = row.id;
                                return `
                                    <select class="form-select status-dropdown">
                                        <option value="Pending" ${data === 'Pending' ? 'selected' : ''}>Pending</option>
                                        <option value="In Progress" ${data === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="Completed" ${data === 'Completed' ? 'selected' : ''}>Completed</option>
                                        <option value="Invalid" ${data === 'Invalid' ? 'selected' : ''}>Invalid</option>
                                    </select>
                                `;
                            }
                        },
                        {
                            data: 'created_at',
                            title: 'Date',
                            render: function (data, type, row) {
                                if (!data) return '';
                                const date = new Date(data);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                            }
                        }
                    ]
                });

                $(tableRefCurrent).on('preXhr.dt', function () {
                    const processingEl = $('.dataTables_processing');
                    const visibleCols = $(tableRefCurrent).find('thead th:visible').length;

                    if (processingEl.length) {
                        const loaderRow = `
                            <tr class="dt-temp-loader">
                                <td colspan="${visibleCols}" class="text-center">
                                    <div class="dataTables_processing card" style="display:block;margin:0 auto">${processingEl.html()}</div>
                                </td>
                            </tr>
                        `;
                        $(tableRefCurrent).find('tbody').html(loaderRow);
                    }
                });

                $(tableRefCurrent).on('xhr.dt', function () {
                    $(tableRefCurrent).find('tbody .dt-temp-loader').remove();
                });
                $(tableRefCurrent).on('change', '.status-dropdown', function (e) {
                    const isAccessAllowed = user?.login_type !== 'Guest';

                    if (!isAccessAllowed) {
                        toast.error("Opps! You don't have Permission.");
                        return;
                    }

                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    dispatch(action.updateTicketStatus({
                        id: rowData.id,
                        status: this.value
                    })).then((action) => {
                        if (dataTableInstanceRef.current) {
                            toast.success("Status Change Successfully");
                            dataTableInstanceRef.current.ajax.reload(null, false);
                        }
                    }).catch((err) => {
                        toast.error("Something went wrong!");
                    });
                });
            }
        }

        initDataTable();

        const handleResize = () => {
            const newSize = window.innerWidth <= 450 ? 'mobile' : 'desktop';
            if (newSize !== currentSize) {
                currentSize = newSize;

                // Destroy and re-init
                if ($.fn.DataTable.isDataTable(tableRefCurrent)) {
                    $(tableRefCurrent).DataTable().destroy();
                }
                initDataTable();
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if ($.fn.DataTable.isDataTable(tableRefCurrent)) {
                $(tableRefCurrent).DataTable().destroy();
            }
        };
    }, [dispatch, navigate]);

    return (
        <>
            {/* { loading ? <Loader /> :  */}
            <>
                <section id="users-section" className="section">
                    <div className="card">
                        <div className="card-header">
                            <div className="page-title w-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h4>Ticket List (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <table ref={tableRef} className="user-table table table-striped table-bordered w-100 dataTable no-footer" id="usersTables" role="grid"></table>
                            </div>
                        </div>
                    </div>
                </section>
            </>
            {/* } */}
        </>
    );
};

export default Tickets;
