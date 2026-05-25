import React, { useEffect, useRef, useState } from "react";
import $ from 'jquery';
import Model from "./Model/Index";

const LiveTvChannels = () => {
    const tableRef = useRef(null);
    const dataTableInstanceRef = useRef(null);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Add Live Tv Channels'
    });

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;
    
        if ($ && tableRefCurrent) {
            dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                destroy: true,
				scrollX: true,
                columns: [
                    { data: 'Image' },
                    { data: 'Category' }, 
                    { data: 'Type' },
                    { data: 'Preview' },
                    { data: 'Action' }
                ],
                columnDefs: [
                    { orderable: false, targets: [0, 1, 2] }
                ]
            });

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.live-tv-channels-edit-btn', function (e) {
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
            title: `${name} Live Tv Channels`
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: `${name} Live Tv Channels`
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    }

    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <div className='overlay'></div>
                    <section id="live-tv-channels-section" className="live-tv-section section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>Live Tv Channels</h4>
                                    </div>
                                    <button className="btn upgrade-btn add-live-tv-channels-btn" onClick={(e) => openModel('Add')}>Add Tv Channel</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="live-tv-channels-table user-table table table-striped w-100 dataTable no-footer" id="live-tv-channels-Contents" role="grid">
                                    <thead>
                                        <tr role="row">
                                            <th data-orderable="false"> Image </th> 
                                            <th data-orderable="false"> Category </th>
                                            <th data-orderable="false"> Type </th>
                                            <th data-orderable="false"> Preview </th>
                                            <th data-orderable="false">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr> 
                                            <td>
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-1.png" alt="live-channel-1" />
                                                    </div>
                                                    <span> Nicklodeon </span>  
                                                </div>   
                                            </td>
                                            <td>Anime & Gaming</td>
                                            <td>M3u8 Url</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-2.png" alt="live-channel-2" />
                                                    </div>
                                                    <span> Sony YAY! </span>  
                                                </div>   
                                            </td>
                                            <td>Kids & Family, Anime & Gaming</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-3.jpg" alt="live-channel-3" />
                                                    </div>
                                                    <span> Sony </span>  
                                                </div>   
                                            </td>
                                            <td>Music</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-4.jpg" alt="live-channel-4" />
                                                    </div>
                                                    <span> Comedy Central  </span>  
                                                </div>   
                                            </td>
                                            <td>Kids & Family, Entertainment	</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-5.jpg" alt="live-channel-5" />
                                                    </div>
                                                    <span> Disney </span>  
                                                </div>   
                                            </td>
                                            <td>Entertainmen</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-6.png" alt="live-channel-6" />
                                                    </div>
                                                    <span> M3U8 </span>  
                                                </div>   
                                            </td>
                                            <td>Lifestyle</td>
                                            <td>M3u8 Url</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-7.png" alt="live-channel-7" />
                                                    </div>
                                                    <span> Yash Raj Films </span>  
                                                </div>   
                                            </td>
                                            <td>Music, Entertainment, Adventures</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                                <div className="live-tv-img d-flex align-items-center gap-3">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/live-channel-8.jpeg" alt="live-channel-8" />
                                                    </div>
                                                    <span> Star Sports </span>  
                                                </div>   
                                            </td>
                                            <td>Sports</td>
                                            <td>Youtube Id	</td>
                                            <td>Preview</td>   
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-primary live-tv-channels-edit-btn" title="Edit">
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
                                        <div className="col-md-6 col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="site-title">Title</label>
                                                <input type="text" id="site-title" placeholder="Enter title" />
                                            </div>  
                                        </div>
                                        <div className="col-md-6 col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="selecttype" className="form-label">Select Access Type</label>
                                                <select id="selecttype" name="selecttype" className="form-control selectric" required="" tabIndex="-1" style={{display: "none"}}>
                                                    <option value="Free">Free</option>
                                                    <option value="Premium">Premium</option>
                                                    <option value="Unlock With Video Ads">Unlock With Video Ads</option>
                                                </select>
                                                <div className="nice-select form-control selectric" tabIndex="0">
                                                    <span className="current">Movies</span>
                                                    <ul className="list">
                                                        <li data-value="Free" className="option selected">Free</li>
                                                        <li data-value="Premium" className="option">Premium</li>
                                                        <li data-value="Unlock With Video Ads" className="option">Unlock With Video Ads</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="selecttype" className="form-label">Select Source Type</label>
                                                <select id="selecttype" name="selecttype" className="form-control selectric" required="" tabIndex="-1" style={{display: "none"}}>
                                                    <option value="Free">Youtube ID</option>
                                                    <option value="M3u8 Url">M3u8 Url</option> 
                                                </select>
                                                <div className="nice-select form-control selectric" tabIndex="0">
                                                    <span className="current">Select Source Type</span>
                                                    <ul className="list">
                                                        <li data-value="Youtube ID" className="option selected">Youtube ID</li>
                                                        <li data-value="M3u8 Url" className="option">M3u8 Url</li> 
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12"> 
                                            <div className="form-group">
                                                <label htmlFor="site-title">Source URL</label>
                                                <input type="text" id="site-title" placeholder="Enter Source URL" />
                                            </div>  
                                        </div> 
                                        <div className="form-group">
                                            <label htmlFor="profile_image" className="form-label">Image</label>
                                            <div className="position-relative">
                                                <div className="upload-options">
                                                <label htmlFor="poster">
                                                    <input name="profile_image" type="file" accept=".png, .jpg, .jpeg, .webp" id="poster_edit" required="" /> 
                                                </label>
                                                </div>
                                                <img id="live_channels_tv_profile_edit" className="custom_img img-fluid actor_profile modal_placeholder_image" src="https://flixy.retrytech.site/assets/img/placeholder-image.png" alt="placeholder-image" /> 
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="action-footer">
                                                <button className="btn btn-primary"> Save</button>
                                            </div> 
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

export default LiveTvChannels;
