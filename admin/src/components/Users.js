import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as action from '../Action/Users/Users_Action';
import NumberDisplay from "./NumberDisplay/Index";
import { useAuth } from "../context/Context";

const Users = () => {
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
                        const columns = ["id", null, 'name', 'email', 'coins', 'current_plan', 'created_at', 'is_blocked', 'login_type'];
                        const sortColumnIndex = dataTablesParams.order[0].column;
                        const sortColumnName = columns[sortColumnIndex];
                        const params = {
                            search: dataTablesParams.search.value,
                            start: dataTablesParams.start,
                            length: dataTablesParams.length,
                            dir: dataTablesParams.order[0].dir,
                            sortColumn: sortColumnName,
                        };
                        dispatch(action.getUsersList(params)).then((action) => {
                            setCount(action.responseDetails.totalRecords || 0);
                            callback({
                                data: action.responseDetails.data || [],
                                recordsTotal: action.responseDetails.totalRecords || 0,
                                recordsFiltered: action.responseDetails.recordsFiltered || 0,
                            });
                        });
                    },
                    destroy: true,
                    columns: [
                        { 
                            data: null,
                            title: 'No',
                            width: "50px",
                            orderable: false,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { 
                            data: null,
                            title: 'Image',
                            orderable: false,
                            // width: "50px",
                            render: function (data, type, row) {
                                return `
                                    <div class="d-flex align-items-center justify-content-center">
                                        <img src="${row?.profile_picture || "/assets/images/profil-img-1.png"}" onError="this.onerror=null;this.src='/assets/images/profil-img-1.png';" alt="User" class="tbl_img" />
                                    </div>
                                `;
                            }
                        },
                        { data: 'name', title: 'Name' },
                        { data: 'email', title: 'Email' },
                        { data: 'coins', title: 'Coins' },
                        { data: 'current_plan', title: 'Plan' },
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
                        },
                        {
                            data: null,
                            title: 'Is Blocked',
                            render: function (data, type, row) {
                                return `
                                    <div class="checkbox-slider d-flex align-items-center">
                                        <label>
                                            <input type="checkbox" class="d-none hideContent is_blocked" ${row.is_blocked ? "checked" : ''} rel="30" />
                                            <span class="toggle_background">
                                                <div class="circle-icon"></div>
                                                <div class="vertical_line"></div>
                                            </span>
                                        </label>
                                    </div>
                                `;
                            }
                        },
                        { data: 'login_type', title: "Login Type" },
                        {
                            data: null,
                            title: 'Action',
                            orderable: false,
                            render: function (data, type, row) {
                            return `
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-primary view-btn" title="Edit">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            `;
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

                $(tableRefCurrent).on('click', '.view-btn', function (e) {
                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    navigate('/users/'+rowData.id);
                });
                
                $(tableRefCurrent).off('click', '.is_blocked');
                $(tableRefCurrent).on('click', '.is_blocked', function (e) {
                    const isAccessAllowed = user?.login_type !== 'Guest';
            
                    if (!isAccessAllowed) {
                        toast.error("Opps! You don't have Permission.");
                        return false;
                    }
                    
                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    dispatch(action.updateIsBlockedUser({
                        id: rowData.id,
                        is_blocked: rowData.is_blocked ? "0" : 1
                    })).then((action) => {
                        if (dataTableInstanceRef.current) {
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
            if ( $.fn.DataTable.isDataTable(tableRefCurrent) ) {
                $(tableRefCurrent).DataTable().destroy();
            }
        };
    }, [dispatch, navigate, user]);

    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <section id="users-section" className="section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>User List (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
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

export default Users;
