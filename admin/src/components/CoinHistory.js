import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import * as action from '../Action/Users/Users_Action';

const CoinHistory = ({ id }) => {
    const dispatch = useDispatch();
    const tableRef = useRef(null);
    const [, setCount] = useState(0);
    const dataTableInstanceRef = useRef(null);

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
                    ordering: false,
                    ajax: (dataTablesParams, callback) => {
                        // const columns = ['id', 'coin', 'title', 'created_at'];
                        // const sortColumnIndex = dataTablesParams.order[0].column;
                        // const sortColumnName = columns[sortColumnIndex];
                        const params = {
                            search: dataTablesParams.search.value,
                            start: dataTablesParams.start,
                            length: dataTablesParams.length,
                            // dir: dataTablesParams.order[0].dir,
                            // sortColumn: sortColumnName,
                            id: id
                        };
                        dispatch(action.getRewardHistoryList(params)).then((action) => {
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
                            // orderable: true,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { data: 'coin', title: "Coin" },
                        {
                            data: 'title',
                            title: 'Title',
                            render: function (data, type, row) {
                                if (data === 'Login rewards') {
                                    return `
                                        <div class="coin-title-login">
                                            ${data}
                                        </div>
                                    `;
                                } else if (data === 'Watch ads') {
                                    return `
                                        <div class="coin-watch-ads">
                                            ${data}
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div class="daily-check-in">
                                            ${data}
                                        </div>
                                    `;
                                }
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
                        },
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
    }, [dispatch, id]);

    return (
        <>
            {/* { loading ? <Loader /> :  */}
            <>
                <div className='overlay'></div>
                <section id="genres-section" className="genres-section section">
                    <div className="card">
                        <div className="card-body">
                            <table ref={tableRef} className="coin-hostory-table user-table table table-striped w-100 dataTable no-footer" id="genres-Contents" role="grid"></table>
                        </div>
                    </div>
                </section>
            </>
            {/* } */}
        </>
    );
};

export default CoinHistory;
