import React, { useEffect, useRef, useState } from "react";
import Model from "./Model/Index";
import $ from 'jquery';

const Notification = () => {
    const tableRef = useRef(null);
    const dataTableInstanceRef = useRef(null);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add Notification'
    });

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;
    
        if ($ && tableRefCurrent) {
            dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                destroy: true,
				scrollX: true,
                columns: [
                    { data: 'Title' },
                    { data: 'Description' }, 
                    { data: 'Action' }
                ],
                columnDefs: [
                    { orderable: false, targets: [1, 2] }
                ]
            });

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.notification-edit-btn', function (e) {
                openModel('Edit');
            });
        }
        return () => {
            if ( $.fn.DataTable.isDataTable(tableRefCurrent) ) {
                $(tableRefCurrent).DataTable().destroy();
            }
        };
    }, []);

    const openModel = (name) => {
        setShowModel({
            show: true,
            title: `${name} Notification`
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: `${name} Notification`
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    }

    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <div className='overlay'></div>
                    <section id="notification-section" className="notification-section section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>Notification</h4>
                                    </div>
                                    <button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Notification</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="notification-table noti-wrp user-table table table-layout-fixed table-striped w-100 dataTable no-footer" id="notification-Contents" role="grid">
                                    <thead>
                                        <tr role="row">
                                            <th data-orderable="Title"> Title </th> 
                                            <th data-orderable="Description"> Description </th>
                                            <th data-orderable="Action"> Action </th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>   
                                            <td>Test</td>
                                            <td>This test assesses basic and advanced mathematical reasoning, including number series, arithmetic logic, and pattern recognition.</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary notification-edit-btn" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr> 
                                        <tr>   
                                            <td>Test</td>
                                            <td>This test assesses basic and advanced mathematical reasoning, including number series, arithmetic logic, and pattern recognition.</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary notification-edit-btn" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr> 
                                        <tr>   
                                            <td>Test</td>
                                            <td>This test assesses basic and advanced mathematical reasoning, including number series, arithmetic logic, and pattern recognition.</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary notification-edit-btn" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr> 
                                        <tr>   
                                            <td>Test</td>
                                            <td>This test assesses basic and advanced mathematical reasoning, including number series, arithmetic logic, and pattern recognition.</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary notification-edit-btn" title="Edit">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr> 
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </section>

                    {
                        showModel.show && (
                            <Model className="common-popup add-genre-popup active">
                                <div className="edit-heading d-flex align-items-center justify-content-between">
                                    <h3>{showModel.title}</h3>
                                    <button className="common-close edit-close-btn" onClick={(e) => closeModel('Add')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                                            <path fill="#ffffff"
                                                d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="edit-inner form-img-upload">
                                    <div className="row">
                                        <div className="col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="site-title">Title</label>
                                                <input type="text" id="site-title" placeholder="Enter title" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="actor-bio">Description</label>
                                                <textarea id="actor-bio" placeholder="Enter Descriptions" rows="8"></textarea>
                                            </div>  
                                        </div> 
                                        <div className="action-footer">
                                            <button className="btn btn-primary"> Save</button>
                                        </div> 
                                    </div>
                                </div>
                            </Model> 
                        )
                    }
                </>
            {/* } */}
        </>
    );
};

export default Notification;
