import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import Model from "./Model/Index";

const MediaGallery = () => {
    const tableRef = useRef(null);
    const [videoPopupVisible, setVideoPopupVisible] = useState(false);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add Media'
    });
    const dataTableInstanceRef = useRef(null);
    const [currentVideoSrc, setCurrentVideoSrc] = useState("");

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;
    
        if ($ && tableRefCurrent) {
            dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                destroy: true,
				scrollX: true,
                columns: [
                    { data: 'Source' },
                    { data: 'Title' },
                    { data: 'Action' }
                ],
                columnDefs: [
                    { orderable: false, targets: [1, 2] }
                ]
            });

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.video-prv-btn', function (e) {
                const videoSrc = $(this).data('video'); // get custom data-video attribute
                handleVideoPreview(videoSrc);
            });

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.video-edit-btn', function (e) {
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
            title: `${name} Media`
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: `${name} Media`
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    }

    const handleVideoPreview = (videoSrc) => {
        setCurrentVideoSrc(videoSrc);
        setVideoPopupVisible(true);
    };

    const handleClosePopup = () => {
        setVideoPopupVisible(false);
        setCurrentVideoSrc("");
    };

    const handlePopupBackgroundClick = (e) => {
        if (e.target.classList.contains("video-popup")) {
            handleClosePopup();
        }
    };

    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <div className='overlay'></div>
                    <section id="media-section" className="media-section section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>Media Gallery</h4>
                                    </div>
                                    <button className="btn upgrade-btn add-edit-btn" onClick={(e) => openModel('Add')}> Add Media </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="media-table user-table table table-striped w-100 dataTable no-footer" id="Media-Tables" role="grid">
                                    <thead>
                                        <tr role="row">
                                            <th data-orderable="false">Source</th>
                                            <th data-orderable="false">Title</th>
                                            <th data-orderable="false">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link className="video-prv-btn" data-video="https://retrytech-items.blr1.cdn.digitaloceanspaces.com/flixy/uploads/1742867576_flixy_Video-11.mp4">
                                                    Video Preview
                                                </Link>
                                            </td>
                                            <td>MP4</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary video-edit-btn" title="Edit">
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
                                                <Link className="video-prv-btn" data-video="https://retrytech-items.blr1.cdn.digitaloceanspaces.com/flixy/uploads/1742867576_flixy_Video-11.mp4">
                                                    Video Preview
                                                </Link>
                                            </td>
                                            <td>Mkv File</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary video-edit-btn" title="Edit">
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
                                                <Link className="video-prv-btn" data-video="https://retrytech-items.blr1.cdn.digitaloceanspaces.com/flixy/uploads/1742867576_flixy_Video-11.mp4">
                                                    Video Preview
                                                </Link>
                                            </td>
                                            <td>Webm File</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary video-edit-btn" title="Edit">
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
                                                <Link className="video-prv-btn" data-video="https://retrytech-items.blr1.cdn.digitaloceanspaces.com/flixy/uploads/1742867576_flixy_Video-11.mp4">
                                                    Video Preview
                                                </Link>
                                            </td>
                                            <td>Mov File</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary video-edit-btn" title="Edit">
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

                    {/* Video-popup start here */}
                    {
                        videoPopupVisible && (
                            <div className="video-popup" style={{display: 'block'}} onClick={(e) => handlePopupBackgroundClick(e)}>
                                <div className="popup-content"> 
                                    <div className="video-frame-container">
                                        <video src={currentVideoSrc} id="showVideoUrl" playsInline autoPlay controls type="video/mp4"></video>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Media Add / Update start here */}
                    {
                        showModel.show && (
                            <Model className="common-popup add-edit-popup active">
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
                                <div className="edit-inner">
                                    <div className="row">
                                        <div className="col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="site-title">Title</label>
                                                <input type="text" id="site-title" placeholder="Enter title" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="vertical_poster" className="form-label">Source File</label>
                                                <div className="posterImg position-relative">
                                                    <div className="upload-options">
                                                        <input name="vertical_poster" type="file" accept=".png, .jpg, .jpeg, .webp" id="poster" required="" />
                                                    </div>
                                                </div>
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

export default MediaGallery;
