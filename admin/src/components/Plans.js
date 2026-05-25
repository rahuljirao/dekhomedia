import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import $ from 'jquery';
import moment from "moment";
import * as action from '../Action/Plans/Plans_Action';
import Model from "./Model/Index";
import NumberDisplay from './NumberDisplay/Index';
import { useAuth } from '../context/Context';

const Plans = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const tableRef = useRef(null);
	const updatePlansLoading = useSelector(state => state.UpdatePlansReducer);
	const addPlansLoading = useSelector(state => state.AddPlansReducer);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add'
    });
    const [count, setCount] = useState(0);
    const [errors, setErrors] = useState({});
    const [planData, setPlanData] = useState({
        id: 0,
        name: '',
        google_play_id: '',
        is_unlimited: 0,
        is_weekly: 0,
        is_yearly: 0,
        is_monthly: 0,
        coin: '',
        extra_coin: '',
        amount: 0.00,
        discount_percentage: 0,
        is_limited_time: 1,
        month_days: 0,
        description: ''
    });
    const amountRefFocus = useRef(null);
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
                    ajax: (dataTablesParams, callback) => {
                        const columns = ['id', 'coin', 'extra_coin', 'amount', 'discount_percentage'];
                        const sortColumnIndex = dataTablesParams.order[0].column;
                        const sortColumnName = columns[sortColumnIndex];
                        const params = {
                            search: dataTablesParams.search.value,
                            start: dataTablesParams.start,
                            length: dataTablesParams.length,
                            dir: dataTablesParams.order[0].dir,
                            sortColumn: sortColumnName,
                        };
                        dispatch(action.getPlans(params)).then((action) => {
                            setCount(action.responseDetails.totalRecords || 0);
                            callback({
                                data: action.responseDetails.data || [],
                                recordsTotal: action.responseDetails.totalRecords || 0,
                                recordsFiltered: action.responseDetails.recordsFiltered || 0,
                            });
                        });
                    },
                    destroy: true,
                    order: [0, 'asc'],
                    columns: [
                        { 
                            data: null,
                            title: 'No',
                            width: "50px",
                            // orderable: false,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { 
                            data: null,
                            title: 'Google Play ID',
                            render: function (data, type, row) {
                                return row.google_play_id ? row.google_play_id : '-' ;
                            }
                        },
                        { 
                            data: null,
                            title: 'Coin',
                            render: function (data, type, row) {
                                return row.coin ? row.coin : '-' ;
                            }
                        },
                        { 
                            data: null,
                            title: 'Extra Coin',
                            render: function (data, type, row) {
                                return row.extra_coin ? row.extra_coin : '-' ;
                            }
                        },
                        { 
                            data: null,
                            title: 'Amount',
                            render: function (data, type, row) {
                                return row.amount ? row.amount : '-' ;
                            }
                        },
                        { 
                            data: null,
                            title: 'Discount(%)',
                            render: function (data, type, row) {
                                return row.discount_percentage ? row.discount_percentage : '-' ;
                            }
                        },
                        {
                            data: 'created_at',
                            title: 'Date',
                            width: "120px",
                            render: function (data, type, row) {
                                if (!data) return '';
                                return moment(data).format("MMMM DD, YYYY")
                            }
                        },
                        {
                            data: null,
                            title: 'Is Active',
                            render: function (data, type, row) {
                                return `
                                    <div class="checkbox-slider d-flex align-items-center">
                                        <label>
                                            <input type="checkbox" class="d-none hideContent is_active" ${row.is_active ? "checked" : ''} rel="30" />
                                            <span class="toggle_background">
                                                <div class="circle-icon"></div>
                                                <div class="vertical_line"></div>
                                            </span>
                                        </label>
                                    </div>
                                `;
                            }
                        },
                        {
                            data: null,
                            title: 'Action',
                            orderable: false,
                            render: function (data, type, row) {
                                return `
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-sm btn-primary edit-btn" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger delete-btn" title="Delete">
                                            <i class="fas fa-trash-alt"></i>
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

                $(tableRefCurrent).on('click', '.edit-btn', function (e) {
                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    openModel('Edit');
                    setPlanData({
                        id: rowData.id,
                        name: rowData.name,
                        google_play_id: rowData.google_play_id,
                        is_unlimited: rowData.is_unlimited,
                        is_weekly: rowData.is_weekly,
                        is_yearly: rowData.is_yearly,
                        coin: rowData.coin,
                        extra_coin: rowData.extra_coin,
                        amount: rowData.amount,
                        discount_percentage: rowData.discount_percentage,
                        is_limited_time: rowData.is_limited_time,
                        description: rowData.description,
                        is_monthly: 0,
                        month_days: 0
                    });
                });
                
                $(tableRefCurrent).off('click', '.is_active');
                $(tableRefCurrent).on('click', '.is_active', function (e) {
                    const isAccessAllowed = user?.login_type !== 'Guest';
            
                    if (!isAccessAllowed) {
                        toast.error("Opps! You don't have Permission.");
                        return false;
                    }
                    
                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    dispatch(action.updateIsActivePlan({
                        id: rowData.id,
                        is_active: rowData.is_active ? "0" : 1
                    })).then((action) => {
                        if (dataTableInstanceRef.current) {
                            dataTableInstanceRef.current.ajax.reload(null, false);
                        }
                    }).catch((err) => {
                        toast.error("Something went wrong!");
                    });
                });
                
                $(tableRefCurrent).off('click', '.delete-btn');
                $(tableRefCurrent).on('click', '.delete-btn', function (e) {
                    const isAccessAllowed = user?.login_type !== 'Guest';

                    if (!isAccessAllowed) {
                        toast.error("Opps! You don't have Permission.");
                        return false;
                    }

                    let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "var(--first-color)",
                        cancelButtonColor: "var(--error-color)",
                        confirmButtonText: "Yes, delete it!",
                        customClass: {
                            confirmButton: 'btn',
                            cancelButton: 'btn'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            dispatch(action.deletePlans({id: rowData.id})).then((action) => {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your data has been deleted.",
                                    icon: "success",
                                    customClass: {
                                        confirmButton: 'btn',
                                    }
                                });
                                if (dataTableInstanceRef.current) {
                                    dataTableInstanceRef.current.ajax.reload(null, false);
                                }
                            }).catch((err) => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Something went wrong!",
                                    customClass: {
                                        confirmButton: 'btn',
                                    }
                                });
                            });
                        }
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
    }, [dispatch, user]);

    const openModel = (name) => {
        setShowModel({
            show: true,
            title: name
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: name
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
        setErrors({});
        setPlanData({
            id: 0,
            name: '',
            google_play_id: '',
            is_unlimited: 0,
            is_weekly: 0,
            is_yearly: 0,
            is_monthly: 0,
            coin: '',
            extra_coin: '',
            amount: 0.00,
            discount_percentage: 0,
            is_limited_time: 1,
            month_days: 0,
            description: ''
        });
    }

    const onChange = (e) => {
        setPlanData({ ...planData, [e.target.name]: e.target.value })
    }

    const addPlans = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }

        setErrors({});
        let customErrors = {};
        if (planData.amount <= 0) {
            customErrors = { ...customErrors, amount: "Please Enter amount" }
            amountRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            name: planData.name,
            google_play_id: planData.google_play_id,
            is_unlimited: planData.is_unlimited,
            is_weekly: planData.is_weekly,
            is_yearly: planData.is_yearly,
            is_monthly: planData.is_monthly,
            coin: planData.coin,
            extra_coin: planData.extra_coin,
            amount: planData.amount,
            discount_percentage: planData.discount_percentage,
            is_limited_time: planData.is_limited_time,
            month_days: planData.month_days,
            description: planData.description,
        };

        if(planData.id !== 0){
            data.id = planData.id;
            dispatch(action.updatePlans(data)).then((response) => {
                toast.success(response.responseMessage);
                closeModel('Add');
    
                if (dataTableInstanceRef.current) {
                    dataTableInstanceRef.current.ajax.reload(null, false);
                }
            }).catch(error => {
                toast.error(error.responseMessage);
            })
        } else {
            dispatch(action.addPlans(data)).then((response) => {
                toast.success(response.responseMessage);
                closeModel('Add');
    
                if (dataTableInstanceRef.current) {
                    dataTableInstanceRef.current.ajax.reload(null, false);
                }
            }).catch(error => {
                toast.error(error.responseMessage);
            })
        }
    }
	
	return (
		<>
			{/* { loading ? <Loader />  :  */}
				<>
                    <div className='overlay'></div>
                    <section id="notification-section" className="notification-section section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>Coin Plans (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
                                    </div>
                                    <button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Plan</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="notification-table user-table table table-striped w-100 dataTable no-footer" style={{tableLayout:"fixed", width:"100%"}} id="notification-Contents" role="grid"></table>
                            </div>
                        </div> 
                    </section>

                    {
                        showModel.show && (
                            <Model className="common-popup add-genre-popup active">
                                <div className="edit-heading d-flex align-items-center justify-content-between">
                                    <h3>{showModel.title} Plan</h3>
                                    <button className="common-close edit-close-btn" onClick={(e) => closeModel('Add')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                                            <path fill="#ffffff"
                                                d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="edit-inner form-img-upload">
                                    <form onSubmit={addPlans}>
                                        <div className="row">
                                            <div className="col-12"> 
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <input type="text" id="name" name='name' value={planData.name} placeholder="Enter name" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.name}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="google_play_id">Google Play ID <i className="fas fa-info-circle ms-1" title="This should be the same as the Product ID from your Google Play Console Dashboard"></i></label>
                                                    <input type="text" id="google_play_id" name='google_play_id' value={planData.google_play_id} placeholder="Enter Google Play ID" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.google_play_id}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="coin">Coin</label>
                                                    <input type="text" id="coin" name='coin' value={planData.coin} placeholder="Enter coin" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.coin}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="extra_coin">Extra Coin</label>
                                                    <input type="text" id="extra_coin" name='extra_coin' value={planData.extra_coin} placeholder="Enter extra coin" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.extra_coin}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="amount">Amount</label>
                                                    <input type="text" id="amount" name='amount' value={planData.amount} placeholder="Enter amount" ref={amountRefFocus} onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.amount}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="discount">Discount</label>
                                                    <input type="text" id="discount" name='discount_percentage' value={planData.discount_percentage} placeholder="Enter discount percentage" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.discount}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="description">Description</label>
                                                    <input type="text" id="description" name='description' value={planData.description} placeholder="Enter description" onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.description}</span>
                                                </div>
                                            </div> 
                                            <div className="action-footer">
                                                <button type="submit" className="btn" disabled={showModel.title === 'Add' ? addPlansLoading.loading : updatePlansLoading.loading}>
                                                    {(showModel.title === 'Add' ? addPlansLoading.loading : updatePlansLoading.loading) ? (
                                                        <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </button>
                                            </div> 
                                        </div>
                                    </form>
                                </div>
                            </Model> 
                        )
                    }
				</>
			{/* } */}
		</>
	);

}

export default Plans;