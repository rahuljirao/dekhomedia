import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import Swal from 'sweetalert2';
import * as action from '../Action/PaymentMethod/PaymentMethod_Action';
import Model from "./Model/Index";
import NumberDisplay from './NumberDisplay/Index';
import { useAuth } from '../context/Context';
import NiceSelect from './CustomSelect';

const PaymentMethod = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const tableRef = useRef(null);
	const updatePaymentMethodLoading = useSelector(state => state.UpdatePaymentMethodReducer);
	const addPaymentMethodLoading = useSelector(state => state.AddPaymentMethodReducer);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add'
    });
    const [count, setCount] = useState(0);
    const [errors, setErrors] = useState({});
    const [paymentData, setPaymentData] = useState({
        id: 0,
        name: '',
        customName: '',
        api_id: '',
        api_key: '',
        api_key_live: '',
    });
    const paymentOptions = ['Stripe', 'RazorPay', 'GooglePlay'];
    const nameRefFocus = useRef(null);
    const apiKeyRefFocus = useRef(null);
    const apiKeyTestRefFocus = useRef(null);
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
                        const columns = ['name', 'api_id', 'api_key'];
                        const sortColumnIndex = dataTablesParams.order[0].column;
                        const sortColumnName = columns[sortColumnIndex];
                        const params = {
                            search: dataTablesParams.search.value,
                            start: dataTablesParams.start,
                            length: dataTablesParams.length,
                            dir: dataTablesParams.order[0].dir,
                            sortColumn: sortColumnName,
                        };
                        dispatch(action.getPaymentMethod(params)).then((action) => {
                            setCount(action.responseDetails.totalRecords || 0);
                            callback({
                                data: action.responseDetails.data || [],
                                recordsTotal: action.responseDetails.totalRecords || 0,
                                recordsFiltered: action.responseDetails.recordsFiltered || 0,
                            });
                        });
                    },
                    destroy: true,
                    order: [1, 'asc'],
                    columns: [
                        { data: 'name', title: 'Name', sortable: false },
                        { data: 'api_id', title: 'Api Key' },
                        { data: 'api_key', title: 'Api Key' },
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
                    const isPresetOption = ['Stripe', 'RazorPay', 'GooglePlay'].includes(rowData.name);
                    setPaymentData({
                        id: rowData.id,
                        name: isPresetOption ? rowData.name : 'Other',
                        customName: isPresetOption ? '' : rowData.name,
                        api_id: rowData.api_id,
                        api_key: rowData.api_key,
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
                    dispatch(action.updatePaymentMethodStatus({
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
                            dispatch(action.deletePaymentMethod({id: rowData.id})).then((action) => {
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
        setPaymentData({
            id: 0,
            name: '',
            customName: '',
            api_id: '',
            api_key: ''
        });
    }

    const onChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
    }

    const niceSelectOnChange = (name, value) => {
        setPaymentData({ ...paymentData, [name]: value })
    }

    const addPaymentMethod = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }
        
        setErrors({});
        let customErrors = {};
        const finalName = paymentData.name === 'Other' ? paymentData.customName : paymentData.name;
        if (paymentData.name === '') {
            customErrors = { ...customErrors, name: "Please select a payment method" }
            // nameRefFocus.current.focus();
        }
        if (paymentData.name === 'Other' && paymentData.customName.trim() === '') {
            customErrors = { ...customErrors, customName: "Please enter custom name" }
        }
        if (paymentData.api_id === '') {
            customErrors = { ...customErrors, api_id: "Please Enter api id" }
            apiKeyRefFocus.current.focus();
        }
        if (paymentData.api_key === '') {
            customErrors = { ...customErrors, api_key: "Please Enter api key" }
            apiKeyTestRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            'name': finalName,
            'api_id': paymentData.api_id,
            'api_key': paymentData.api_key
        };

        if(paymentData.id !== 0){
            data.id = paymentData.id;
            dispatch(action.updatePaymentMethod(data)).then((response) => {
                toast.success(response.responseMessage);
                closeModel('Add');
    
                if (dataTableInstanceRef.current) {
                    dataTableInstanceRef.current.ajax.reload(null, false);
                }
            }).catch(error => {
                toast.error(error.responseMessage);
            })
        } else {
            dispatch(action.addPaymentMethod(data)).then((response) => {
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
                                        <h4>Payment Method (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
                                    </div>
                                    <button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Payment Method</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="notification-table user-table table table-striped w-100 dataTable no-footer" id="notification-Contents" role="grid"></table>
                            </div>
                        </div> 
                    </section>

                    {
                        showModel.show && (
                            <Model className="common-popup add-genre-popup active">
                                <div className="edit-heading d-flex align-items-center justify-content-between">
                                    <h3>{showModel.title} Payment Method</h3>
                                    <button className="common-close edit-close-btn" onClick={(e) => closeModel('Add')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                                            <path fill="#ffffff"
                                                d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="edit-inner form-img-upload">
                                    <form onSubmit={addPaymentMethod}>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <NiceSelect id="name" name="name" className="form-control" value={paymentData.name} onChange={niceSelectOnChange}>
                                                        <option value="">Select Payment Method</option>
                                                        {paymentOptions.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                        <option value="Other">Other</option>
                                                    </NiceSelect>
                                                    <span className='text-danger pt-2'>{errors?.name}</span>
                                                </div>
                                                {paymentData.name === 'Other' && (
                                                    <div className="form-group">
                                                        <label htmlFor="customName">Custom Name</label>
                                                        <input type="text" id="customName" name='customName' value={paymentData.customName} placeholder="Enter custom payment method name" onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.customName}</span>
                                                    </div>
                                                )}
                                                <div className="form-group">
                                                    <label htmlFor="api_id">Api Id</label>
                                                    <input type="text" id="api_id" name='api_id' value={paymentData.api_id} placeholder="Enter api id" ref={apiKeyRefFocus} onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.api_id}</span>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="api_key">Api Key</label>
                                                    <input type="text" id="api_key" name='api_key' value={paymentData.api_key} placeholder="Enter api key" ref={apiKeyTestRefFocus} onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.api_key}</span>
                                                </div>
                                            </div> 
                                            <div className="action-footer">
                                                <button type="submit" className="btn" disabled={showModel.title === 'Add' ? addPaymentMethodLoading.loading : updatePaymentMethodLoading.loading}>
                                                    {(showModel.title === 'Add' ? addPaymentMethodLoading.loading : updatePaymentMethodLoading.loading) ? (
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

export default PaymentMethod;