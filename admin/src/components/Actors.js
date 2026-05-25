import React, { useEffect, useRef, useState } from "react";
import Flatpickr from 'react-flatpickr';
import $ from 'jquery';
import Model from "./Model/Index";

const Actors = () => {
    const tableRef = useRef(null);
    const dataTableInstanceRef = useRef(null);
    const [dob, setDob] = useState('1990-01-01');
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add Actor'
    });

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;

        if ($ && tableRefCurrent) {
            dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                destroy: true,
                scrollX: true,
                columns: [
                    { data: 'Profile' },
                    { data: 'Dob' },
                    { data: 'Action' }
                ],
                columnDefs: [
                    { orderable: false, targets: [1, 2] }
                ]
            });

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.actor-edit-btn', function (e) {
                openModel('Edit');
            });
        }
        return () => {
            if ($.fn.DataTable.isDataTable(tableRefCurrent)) {
                $(tableRefCurrent).DataTable().destroy();
            }
        };
    }, []);

    const openModel = (name) => {
        setShowModel({
            show: true,
            title: `${name} Actor`
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: `${name} Actor`
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    }

    return (
        <>
            {/* { loading ? <Loader /> :  */}
            <>
                <div className='overlay'></div>
                <section id="actors-section" className="actors-section section">
                    <div className="card">
                        <div className="card-header">
                            <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h4>Actors</h4>
                                </div>
                                <button className="btn upgrade-btn add-actor-btn" onClick={(e) => openModel('Add')}> Add Actor </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <table ref={tableRef} className="actors-table user-table table table-striped w-100 dataTable no-footer" id="actors-Contents" role="grid">
                                <thead>
                                    <tr role="row">
                                        <th data-orderable="false">Profile</th>
                                        <th data-orderable="false">Dob</th>
                                        <th data-orderable="false">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-wrapper">
                                                    <img src="./assets/images/actor-1.jpg" alt="actor-1" />
                                                </div>
                                                <span> Hrithik Roshan </span>
                                            </div>
                                        </td>
                                        <td>
                                            10-01-1974
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-primary actor-edit-btn" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-wrapper">
                                                    <img src="./assets/images/actor-2.jpg" alt="actor-2" />
                                                </div>
                                                <span> Mckenna Grace </span>
                                            </div>
                                        </td>
                                        <td>
                                            10-01-1974
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-primary actor-edit-btn" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-wrapper">
                                                    <img src="./assets/images/actor-3.jpg" alt="actor-3" />
                                                </div>
                                                <span>Dia Mirza </span>
                                            </div>
                                        </td>
                                        <td>
                                            10-01-1974
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-primary actor-edit-btn" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-wrapper">
                                                    <img src="./assets/images/actor-4.jpg" alt="actor-4" />
                                                </div>
                                                <span> Pooja Hegde </span>
                                            </div>
                                        </td>
                                        <td>
                                            10-01-1974
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-primary actor-edit-btn" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger" title="Delete">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="img-wrapper">
                                                    <img src="./assets/images/actor-5.jpg" alt="actor-5" />
                                                </div>
                                                <span>Paul Rudd </span>
                                            </div>
                                        </td>
                                        <td>
                                            10-01-1974
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-primary actor-edit-btn" title="Edit">
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

                {/* Media Add / Update start here */}
                {
                    showModel.show && (
                        <Model className="common-popup add-actor-popup active">
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
                                        <div className="row">
                                            <div className="col-sm-4 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="profile_image" className="form-label">Actor Profile</label>
                                                    <div className="position-relative">
                                                        <div className="upload-options">
                                                            <label htmlFor="poster">
                                                                <input name="profile_image" type="file" accept=".png, .jpg, .jpeg, .webp" id="poster_add" required="" />
                                                            </label>
                                                        </div>
                                                        <img id="actor_profile_add" className="custom_img img-fluid actor_profile modal_placeholder_image" src="https://flixy.retrytech.site/assets/img/placeholder-image.png" alt="placeholder-image" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-8 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="site-title">Full Name</label>
                                                    <input type="text" id="site-title" placeholder="Enter Full Name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="dob2">Dob (DD-MM-YYYY)</label>
                                                    {/* <input type="text" id="dob2" className="form-control dob-picker" placeholder="Select your birth date" /> */}
                                                    <Flatpickr
                                                        id="dob2"
                                                        className="form-control"
                                                        value={dob}
                                                        onChange={([date]) => setDob(date)}
                                                        options={{
                                                            dateFormat: "Y-m-d",
                                                            maxDate: "today",
                                                            altInput: true,
                                                            altFormat: "F j, Y",
                                                            defaultDate: "1990-01-01",
                                                        }}
                                                        placeholder="Select your birth date"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="actor-bio">Bio</label>
                                            <textarea id="actor-bio" placeholder="Enter Bio" rows="8"></textarea>
                                        </div>
                                        <div className="action-footer">
                                            <button className="btn btn-primary"> Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Model>
                    )
                }
                {/* Media Add / Update end here */}
            </>
            {/* } */}
        </>
    );
};

export default Actors;
