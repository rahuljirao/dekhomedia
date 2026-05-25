import React, { useEffect, useRef, useState } from "react";
import $ from 'jquery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Model from "./Model/Index";

const TopContents = () => {
    const tableRef = useRef(null);
    const [showModel, setShowModel] = useState({
        show: false,
        title: 'Select Content'
    });
    const dataTableInstanceRef = useRef(null);

    useEffect(() => {
        let tableRefCurrent = tableRef.current;
        const $ = window.$ || window.jQuery;
    
        if ($ && tableRefCurrent) {
            dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
                destroy: true,
				scrollX: true,
                columns: [
                    { data: 'Order' },
                    { data: 'Poster' },
                    { data: 'Action' }
                ],
                columnDefs: [
                    { orderable: false, targets: [1, 2] }
                ]
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
            title: 'Select Content'
        });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeModel = (name) => {
        setShowModel({
            show: false,
            title: 'Select Content'
        });
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    }

    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <div className='overlay'></div>
                    <section id="top-contents-section" className="top-contents-section section">
                        <div className="card">
                            <div className="card-header">
                                <div className="page-title w-100 d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4>Select Content</h4>
                                    </div>
                                    <button className="btn upgrade-btn select-content-btn" onClick={(e) => openModel('Add')}> Select Content </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref={tableRef} className="top-contents-table user-table table table-striped w-100 dataTable no-footer" id="Top-Contents" role="grid">
                                    <thead>
                                        <tr role="row">
                                            <th data-orderable="false">Order</th>
                                            <th data-orderable="false">Poster</th>
                                            <th data-orderable="false">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                1   
                                            </td>
                                            <td className="content-img">
                                                <div className="content-img-wrp d-flex align-items-center">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/movie-1.png" alt="images/movie" />
                                                    </div>
                                                    Money Heist: Korea - Joint Economic Area
                                                </div> 
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2"> 
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            2
                                            </td> 
                                            <td className="content-img">
                                                <div className="content-img-wrp d-flex align-items-center">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/movie-2.png" alt="movie-2" />
                                                    </div>
                                                    Interstiller
                                                </div> 
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2"> 
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            3
                                            </td> 
                                            <td className="content-img">
                                                <div className="content-img-wrp d-flex align-items-center">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/movie-3.png" alt="movie-3" />
                                                    </div>
                                                    The Lord of the Rings: The Rings of Power
                                                </div> 
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2"> 
                                                    <button className="btn btn-sm btn-danger" title="Delete">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr> 
                                        <tr>
                                            <td>
                                            4
                                            </td> 
                                            <td className="content-img">
                                                <div className="content-img-wrp d-flex align-items-center">
                                                    <div className="img-wrapper">
                                                        <img src="./assets/images/movie-4.png" alt="movie-4" />
                                                    </div>
                                                    War for the Planet of the Apes
                                                </div> 
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2"> 
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
                            <Model className="common-popup content-popup active">
                                <div className="edit-heading d-flex align-items-center justify-content-between">
                                    <h3>Select Content</h3>
                                    <button className="common-close edit-close-btn" onClick={(e) => closeModel('Edit')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                                            <path fill="#ffffff"
                                                d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="edit-inner">
                                {/* Movie Section */}
                                <div className="featured-content">
                                    <h6> Movies </h6>
                                    <div className="featured-slider">
                                        <Swiper
                                            slidesPerView={5}
                                            spaceBetween={20}
                                            loop={true}
                                            centeredSlides={false}
                                            pagination={{
                                                el: '.swiper-pagination',
                                                clickable: true,
                                            }}
                                            breakpoints={{
                                                1400: {
                                                    slidesPerView: 5,
                                                },
                                                1200: {
                                                    slidesPerView: 5,
                                                },
                                                1024: {
                                                    slidesPerView: 4,
                                                },
                                                991: {
                                                    slidesPerView: 3,
                                                },
                                                767: {
                                                    slidesPerView: 3,
                                                },
                                                500: {
                                                    slidesPerView: 2,
                                                },
                                                0: {
                                                    slidesPerView: 1,
                                                },
                                            }}
                                            modules={[Pagination]}
                                        >
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-1.png" alt="Movie 1" />
                                                <div className="movie-name">
                                                    <p>Avengers</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-2.png" alt="Movie 2" />
                                                <div className="movie-name">
                                                    <p>Interstaller</p>
                                                    <span>Science / Fiction</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-3.png" alt="Movie 3" />
                                                <div className="movie-name">
                                                    <p>The lords of the rings</p>
                                                    <span>Science / Fiction</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-6.png" alt="Movie 1" />
                                                <div className="movie-name">
                                                    <p>Avengers</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-4.png" alt="Movie 1" />
                                                <div className="movie-name">
                                                    <p>Inception</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/movie-5.png" alt="Movie 1" />
                                                <div className="movie-name">
                                                    <p>The Dark Knight</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>

                                            {/* Optional Pagination */}
                                            <div className="swiper-pagination"></div>
                                        </Swiper>
                                    </div>
                                </div> 
                                {/* Series Section */}
                                <div className="featured-content">
                                    <h6>Series</h6>
                                    <div className="series-slider">
                                        <Swiper
                                            slidesPerView={5}
                                            spaceBetween={20}
                                            loop={true}
                                            centeredSlides={false}
                                            pagination={{
                                                el: '.swiper-pagination',
                                                clickable: true,
                                            }}
                                            breakpoints={{
                                                1400: {
                                                    slidesPerView: 5,
                                                },
                                                1200: {
                                                    slidesPerView: 5,
                                                },
                                                1024: {
                                                    slidesPerView: 4,
                                                },
                                                991: {
                                                    slidesPerView: 3,
                                                },
                                                767: {
                                                    slidesPerView: 3,
                                                },
                                                500: {
                                                    slidesPerView: 2,
                                                },
                                                0: {
                                                    slidesPerView: 1,
                                                },
                                            }}
                                            modules={[Pagination]}
                                        >
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-1.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Stranger Things</p>
                                                    <span>Fantacy/Horror</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-2.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Money Heist</p>
                                                    <span>Crime / Historical</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-3.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Squade Games</p>
                                                    <span>Sci-Fi / Horror</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-4.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Dark</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-10.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Sacred Games 2</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide className="swiper-slide featured-item img-wrapper">
                                                <img src="./assets/images/tv-show-7.jpg" alt="TV Show" />
                                                <div className="movie-name">
                                                    <p>Special Opps</p>
                                                    <span>Action</span>
                                                </div>
                                            </SwiperSlide>

                                            {/* Optional Pagination */}
                                            <div className="swiper-pagination"></div>
                                        </Swiper>
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

export default TopContents;
