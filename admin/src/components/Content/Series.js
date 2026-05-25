import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import moment from "moment";
import $ from 'jquery';
import * as action from '../../Action/Series/Series_Action';
import Model from "../Model/Index";
import NiceSelect from "../CustomSelect";
import { getCategories } from '../../Action/Categories/Categories_Action';
import { getTags } from '../../Action/Tags/Tags_Action';
import { getTypes } from '../../Action/Types/Types_Action';
import CustomImageBox from "../UploadPreview/CustomImageBox";
import { isEmpty } from "lodash";
import CustomVideoBox from "../UploadPreview/CustomVideoBox";
// import NumberDisplay from "../NumberDisplay/Index";
import Select2Component from "../CustomSelect/Select2";
import NumberInput from "../Input/Number";
import Loader from "../Loader";
import { useAuth } from "../../context/Context";

const Series = () => {
    const { user } = useAuth();
	const dispatch = useDispatch();
	// const tableRef = useRef(null);
	const updateSeriesLoading = useSelector(state => state.UpdateSeriesReducer);
	const addSeriesLoading = useSelector(state => state.AddSeriesReducer);
	const { loading } = useSelector(state => state.GetSeriesReducer);
	const hasFetchedRef = useRef(null);
    const dataTableInstanceRef = useRef(null);
	const [showModel, setShowModel] = useState({
		show: false,
		title: 'Add'
	});
	const [searchSeriesText, setSearchSeriesText] = useState('');
	const [errors, setErrors] = useState({});
	// const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const [seriesData, setSeriesData] = useState({
		id: 0,
		title: '',
		description: '',
		thumbnail: '',
		poster: '',
		cover_video: '',
		category_id: '',
		type_id: '',
		tag_id: [],
		total_episode: '',
		free_episodes: '',
		is_free: 0,
		is_recommended: 0
	});
	const [filePreview, setFilePreview] = useState({
		thumbnail: '',
		cover_video: '',
	});
	const [categoryList, setCategoryList] = useState([]);
	const [tagList, setTagList] = useState([]);
	const [typesList, setTypesList] = useState([]);
    const titleRefFocus = useRef(null);
    const searchTextRefFocus = useRef(null);
    const descriptionRefFocus = useRef(null);;
    const totalEpisodeRefFocus = useRef(null);
    const freeEpisodeRefFocus = useRef(null);
    const thumbnailRefFocus = useRef(null);
    const posterRefFocus = useRef(null);
    const coverVideoRefFocus = useRef(null);
	const tagsRefFocus = useRef(null);
	const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(12);

	// useEffect(() => {
    //     let tableRefCurrent = tableRef.current;
	// 	const $ = window.$ || window.jQuery;
	
	// 	if ($ && tableRefCurrent) {
	// 		dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
    //             processing: true,
    //             serverSide: true,
	// 			scrollX: true,
    //             ajax: (dataTablesParams, callback) => {
    //                 const columns = [null, 'title', 'type_name', 'total_episode', 'free_episodes', 'is_recommended', 'is_free', 'is_active'];
    //                 const sortColumnIndex = dataTablesParams.order[0].column;
    //                 const sortColumnName = columns[sortColumnIndex];
    //                 const params = {
    //                     search: dataTablesParams.search.value,
    //                     start: dataTablesParams.start,
    //                     length: dataTablesParams.length,
    //                     dir: dataTablesParams.order[0].dir,
    //                     sortColumn: sortColumnName,
    //                 };
    //                 dispatch(action.getSeries(params)).then((action) => {
    //                     setCount(action.responseDetails.totalRecords || 0);
    //                     callback({
    //                         data: action.responseDetails.data || [],
    //                         recordsTotal: action.responseDetails.totalRecords || 0,
    //                         recordsFiltered: action.responseDetails.recordsFiltered || 0,
    //                     });
    //                 });
    //             },
	// 			destroy: true,
	// 			order: [1, 'asc'],
	// 			columns: [
	// 				{ 
    //                     data: null,
    //                     title: 'No',
	// 					orderable: false,
    //                     render: function (data, type, row, meta) {
    //                         return meta.row + meta.settings._iDisplayStart + 1;
    //                     }
    //                 },
    //                 {
    //                     data: null,
    //                     title: 'Poster',
    //                     orderable: false,
    //                     render: function (data, type, row) {
    //                         return `
	// 							<div class="img-wrapper">
	// 								<img src="${row.thumbnail}" />
	// 							</div>
    //                         `;
    //                     }
    //                 },
	// 				{ data: 'title', title: 'Title' },
	// 				{ data: 'type_name', title: 'Type' },
	// 				// { data: 'tag_name', title: 'Tag' },
	// 				{ data: 'total_episode', title: 'Episode' },
	// 				{ data: 'free_episodes', title: 'Free Episode' },
    //                 {
    //                     data: null,
    //                     title: 'Recommended',
    //                     render: function (data, type, row) {
    //                         return `
	// 							<div class="checkbox-slider d-flex align-items-center">
	// 								<label>
	// 									<input type="checkbox" class="d-none hideContent is_recommended" ${row.is_recommended ? "checked" : ''} rel="30" />
	// 									<span class="toggle_background">
	// 										<div class="circle-icon"></div>
	// 										<div class="vertical_line"></div>
	// 									</span>
	// 								</label>
	// 							</div>
    //                         `;
    //                     }
    //                 },
    //                 {
    //                     data: null,
    //                     title: 'Free',
    //                     render: function (data, type, row) {
    //                         return `
	// 							<div class="checkbox-slider d-flex align-items-center">
	// 								<label>
	// 									<input type="checkbox" class="d-none hideContent is_free" " ${row.is_free ? "checked" : ''} rel="30" />
	// 									<span class="toggle_background">
	// 										<div class="circle-icon"></div>
	// 										<div class="vertical_line"></div>
	// 									</span>
	// 								</label>
	// 							</div>
    //                         `;
    //                     }
    //                 },
    //                 {
    //                     data: null,
    //                     title: 'Active',
    //                     render: function (data, type, row) {
    //                         return `
	// 							<div class="checkbox-slider d-flex align-items-center">
	// 								<label>
	// 									<input type="checkbox" class="d-none hideContent is_active" ${row.is_active ? "checked" : ''} rel="30" />
	// 									<span class="toggle_background">
	// 										<div class="circle-icon"></div>
	// 										<div class="vertical_line"></div>
	// 									</span>
	// 								</label>
	// 							</div>
    //                         `;
    //                     }
    //                 },
	// 				{
    //                     data: 'created_at',
    //                     title: 'Date',
    //                     render: function (data, type, row) {
    //                         if (!data) return '';
    //                         return moment(data).format("MMMM DD, YYYY")
    //                     }
    //                 },
    //                 {
    //                     data: null,
    //                     title: 'Action',
    //                     orderable: false,
    //                     render: function (data, type, row) {
    //                         return `
    //                             <div class="d-flex gap-2">
    //                                 <button class="btn btn-sm btn-primary view-btn" title="View">
    //                                     <i class="fas fa-eye"></i>
    //                                 </button>
    //                                 <button class="btn btn-sm btn-primary edit-btn" title="Edit">
    //                                     <i class="fas fa-edit"></i>
    //                                 </button>
    //                                 <button class="btn btn-sm btn-danger delete-btn" title="Delete">
    //                                     <i class="fas fa-trash-alt"></i>
    //                                 </button>
    //                             </div>
    //                         `;
    //                     }
    //                 }
	// 			]
	// 		});

    //         $(tableRefCurrent).on('click', '.view-btn', function (e) {
    //             let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
	// 			navigate('/series/'+rowData.id);
    //         });

    //         $(tableRefCurrent).on('click', '.edit-btn', function (e) {
    //             let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
    //             openModel('Edit');
	// 			setSeriesData({
	// 				id: rowData.id,
	// 				title: rowData.title,
	// 				description: rowData.description,
	// 				category_id: rowData.category_id,
	// 				type_id: rowData.type_id,
	// 				tag_id: isEmpty(rowData.tag_id) ? [] : rowData.tag_id.split(",").map(Number),
	// 				total_episode: rowData.total_episode,
	// 				free_episodes: rowData.free_episodes,
	// 				is_free: rowData.is_free,
	// 				is_recommended: rowData.is_recommended,
	// 				poster: ''
	// 			});
	// 			setFilePreview({
	// 				thumbnail: rowData.thumbnail,
	// 				cover_video: rowData.cover_video,
	// 				poster: rowData.poster,
	// 			});
    //         });
						
	// 		$(tableRefCurrent).on('click', '.delete-btn', function (e) {
	// 			let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
	// 			Swal.fire({
	// 				title: "Are you sure?",
	// 				text: "You won't be able to revert this!",
	// 				icon: "warning",
	// 				showCancelButton: true,
	// 				confirmButtonColor: "var(--first-color)",
	// 				cancelButtonColor: "var(--error-color)",
	// 				confirmButtonText: "Yes, delete it!",
	// 				customClass: {
	// 					confirmButton: 'btn',
	// 					cancelButton: 'btn'
	// 				}
	// 			}).then((result) => {
	// 				if (result.isConfirmed) {
	// 					dispatch(action.deleteSeries({id: rowData.id})).then((action) => {
	// 						Swal.fire({
	// 							title: "Deleted!",
	// 							text: "Your data has been deleted.",
	// 							icon: "success",
	// 							customClass: {
	// 								confirmButton: 'btn',
	// 							}
	// 						});
	// 						if (dataTableInstanceRef.current) {
	// 							dataTableInstanceRef.current.ajax.reload(null, false);
	// 						}
	// 					}).catch((err) => {
	// 						Swal.fire({
	// 							icon: "error",
	// 							title: "Oops...",
	// 							text: "Something went wrong!",
	// 							customClass: {
	// 								confirmButton: 'btn',
	// 							}
	// 						});
	// 					});
	// 				}
	// 			});
	// 		});

	// 		$(tableRefCurrent).on('click', '.is_recommended', function (e) {
	// 			let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
	// 			dispatch(action.updateRecommandedSeries({
	// 				id: rowData.id,
	// 				is_recommended: rowData.is_recommended ? "0" : 1
	// 			})).then((action) => {
	// 				if (dataTableInstanceRef.current) {
	// 					dataTableInstanceRef.current.ajax.reload(null, false);
	// 				}
	// 			}).catch((err) => {
	// 				toast.error("Something went wrong!");
	// 			});
	// 		});

	// 		$(tableRefCurrent).on('click', '.is_active', function (e) {
	// 			let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
	// 			dispatch(action.updateActiveSeries({
	// 				id: rowData.id,
	// 				is_active: rowData.is_active ? "0" : 1
	// 			})).then((action) => {
	// 				if (dataTableInstanceRef.current) {
	// 					dataTableInstanceRef.current.ajax.reload(null, false);
	// 				}
	// 			}).catch((err) => {
	// 				toast.error("Something went wrong!");
	// 			});
	// 		});

	// 		$(tableRefCurrent).on('click', '.is_free', function (e) {
	// 			let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
	// 			dispatch(action.updateFreeSeries({
	// 				id: rowData.id,
	// 				is_free: rowData.is_free ? "0" : 1
	// 			})).then((action) => {
	// 				if (dataTableInstanceRef.current) {
	// 					dataTableInstanceRef.current.ajax.reload(null, false);
	// 				}
	// 			}).catch((err) => {
	// 				toast.error("Something went wrong!");
	// 			});
	// 		});
	// 	}
	// 	return () => {
	// 		if ( $.fn.DataTable.isDataTable(tableRefCurrent) ) {
	// 			$(tableRefCurrent).DataTable().destroy();
	// 		}
	// 	};
	// }, [dispatch, navigate]);

	useEffect(() => {
		if(hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const getData = () => {
			dispatch(getCategories({getAll: true})).then((action) => {
				setCategoryList(action.responseDetails.data || []);
			});
			dispatch(getTags({getAll: true})).then((action) => {
				// setTagList(action.responseDetails.data || []);
				let data = action.responseDetails.data || [];
				setTagList(data.map(x => ({ value: x.id, label: x.name })));
			});
			dispatch(getTypes({getAll: true})).then((action) => {
				setTypesList(action.responseDetails.data || []);
			});
		}

		getData();
	}, [dispatch]);

	useEffect(() => {
		let delayDebounce;
		if(searchSeriesText.trim() === ''){
			dispatch(action.getSeries({search: searchSeriesText})).then((action) => {
				setData(action?.responseDetails || []);
			}).catch(err => {
				navigate(-1);
			})
		} else {
			delayDebounce = setTimeout(() => {
				dispatch(action.getSeries({search: searchSeriesText})).then((action) => {
					setData(action?.responseDetails || []);
					searchTextRefFocus.current.focus();
				}).catch(err => {
					navigate(-1);
				})
			}, 1000);
		}

		return () => clearTimeout(delayDebounce);
	}, [searchSeriesText, dispatch, navigate]);

	const editSeries = (rowData) => {
		openModel('Edit');
		setSeriesData({
			id: rowData.id,
			title: rowData.title,
			description: rowData.description,
			category_id: rowData.category_id,
			type_id: rowData.type_id,
			tag_id: isEmpty(rowData.tag_id) ? [] : rowData.tag_id.split(",").map(Number),
			total_episode: rowData.total_episode,
			free_episodes: rowData.free_episodes,
			is_free: rowData.is_free,
			is_recommended: rowData.is_recommended,
			poster: rowData.poster
		});
		setFilePreview({
			thumbnail: rowData.thumbnail,
			cover_video: rowData.cover_video,
			poster: rowData.poster,
		});
	}

	const deleteSeries = (rowData) => {
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
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
				dispatch(action.deleteSeries({id: rowData.id})).then((action) => {
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
	}

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
		setSeriesData({
			id: 0,
			title: '',
			description: '',
			thumbnail: '',
			poster: '',
			cover_video: '',
			category_id: '',
			type_id: '',
			tag_id: [],
			total_episode: '',
			free_episodes: '',
			is_free: 0,
			is_recommended: 0
		});
		setFilePreview({
			thumbnail: '',
			cover_video: '',
			poster:''
		});
    }

    const onChange = (e) => {
        setSeriesData({ ...seriesData, [e.target.name]: e.target.value })
    }

    const onChangeSelect2 = (value) => {
		setSeriesData(prevData => ({...prevData, tag_id: value}));
    }

    const niceSelectOnChange = (name, value) => {
		if(name === 'is_recommended'){
			setErrors({});
		}
        setSeriesData({ ...seriesData, [name]: value })
    }

    const handleImage = (e, image, preview) => {
        setSeriesData({ ...seriesData, [e.target.name]: image });
        setFilePreview({...filePreview, [e.target.name]: preview});
    }

	const handleCheck = (id, name, isChecked) => {
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		let api = null;
		if(name === 'is_recommended'){
			api = 'updateRecommandedSeries';
		} else if(name === 'is_free'){
			api = 'updateFreeSeries';
		} else {
			api = 'updateActiveSeries';
		}
		dispatch(action[api]({
			id: id,
			[name]: isChecked ? 1 : '0'
		})).then((action) => {
			setData(prevData =>
				prevData.map(series =>
					parseInt(series.id) === parseInt(id) ? { ...series, [name]: isChecked ? 1 : 0 } : series
				)
			);
			// if (dataTableInstanceRef.current) {
			// 	dataTableInstanceRef.current.ajax.reload(null, false);
			// }
		}).catch((err) => {
			toast.error("Something went wrong!");
		});
	}
	
	const addSeriesData = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
		if (seriesData.title === '') {
			customErrors = { ...customErrors, title: "Please Enter title" }
			titleRefFocus.current.focus();
		} else if (seriesData.description === '') {
			customErrors = { ...customErrors, description: "Please Enter description" }
			descriptionRefFocus.current.focus();
		} else if (seriesData.total_episode === '') {
			customErrors = { ...customErrors, total_episode: "Please Enter Total Episode" }
			totalEpisodeRefFocus.current.focus();
		} else if (seriesData.free_episodes === '') {
			customErrors = { ...customErrors, free_episodes: "Please Enter Free Episode" }
			freeEpisodeRefFocus.current.focus();
		} else if (seriesData.thumbnail === '') {
			customErrors = { ...customErrors, thumbnail: "Please Select Thumbnail Image" }
			thumbnailRefFocus.current.focus();
		} else if (seriesData.poster === '' && parseInt(seriesData.is_recommended) === 1) {
			customErrors = { ...customErrors, poster: "Please Select Poster Image" }
			posterRefFocus.current.focus();
		} else if (seriesData.cover_video === '') {
			customErrors = { ...customErrors, cover_video: "Please Select Cover Video" }
			coverVideoRefFocus.current.focus();
		} else if (seriesData.tag_id.length === 0) {
			customErrors = { ...customErrors, tag_id: "Please Select Tags" }
			tagsRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}

		if (seriesData.category_id === '') {
			toast.error("Please Select Category");
			return true
		}
		if (seriesData.type_id === '') {
			toast.error("Please Select Type");
			return true
		}

		let data = new FormData();

		data.append('title', seriesData.title);
		data.append('description', seriesData.description);
		data.append('thumbnail', seriesData.thumbnail);
		data.append('cover_video', seriesData.cover_video);
		data.append('poster', seriesData.poster);
		data.append('category_id', seriesData.category_id);
		data.append('type_id', seriesData.type_id);
		data.append('tag_id', seriesData.tag_id.join(','));
		data.append('total_episode', seriesData.total_episode);
		data.append('free_episodes', seriesData.free_episodes);
		data.append('is_free', seriesData.is_free);
		data.append('is_recommended', seriesData.is_recommended);

		if(seriesData.id !== 0){
			data.append('id', seriesData.id);
			dispatch(action.updateSeries(data)).then((response) => {
				toast.success(response.responseMessage);
				const updatedSeries = response.responseDetails;
				closeModel('Add');

				setData(prevData =>
					prevData.map(series =>
						parseInt(series.id) === parseInt(updatedSeries.id) ? {...series, ...updatedSeries } : series
					)
				);
	
				// if (dataTableInstanceRef.current) {
				// 	dataTableInstanceRef.current.ajax.reload(null, false);
				// }
			}).catch(error => {
				toast.error(error.responseMessage);
			})
		} else {
			dispatch(action.addSeries(data)).then((response) => {
				toast.success(response.responseMessage);
				const updatedSeries = response.responseDetails;
				closeModel('Add');
				setData(prevData => [...prevData, updatedSeries]);
	
				// if (dataTableInstanceRef.current) {
				// 	dataTableInstanceRef.current.ajax.reload(null, false);
				// }
			}).catch(error => {
				toast.error(error.responseMessage);
			})
		}
	}

    const showMore = () => {
        setVisibleCount((prev) => prev + 12);
    };

    const visibleData = data?.slice(0, visibleCount);

	return (
		<>
			{ loading ? <Loader /> : 
				<>
					<div className='overlay'></div>
					<div className="d-flex flex-wrap justify-content-between align-items-center text-end mb-3">
						<div className="service-search">
							<div className="input-wrapper align-items-center">
								<input type="email" placeholder="Search" ref={searchTextRefFocus} value={searchSeriesText} onChange={(e) => setSearchSeriesText(e.target.value)} />
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" role="img"
									className="icon ">
									<path
										d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
										stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									</path>
								</svg>
							</div>
						</div>
						<button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Series</button>
					</div>
					
					{
						visibleData && visibleData.length > 0 ? (
							<div className="series-cards">
								{visibleData.map((item, index) => (
									<div className="cards" key={index}>
										<img src={item?.thumbnail} alt="Poster" className="series-poster" />
										<div className="series-card-content">
											<div className="series-card-header">
												<span className="series-card-date">{moment(item?.created_at).format("MMMM DD, YYYY")}</span>
												<h4 className="series-card-title">{item?.title}</h4>
											</div>
											<div className="series-card-footer">
												<div className="card-info">
													<div className="info-item">
														<span className="label">Type:</span>
														<strong>{item?.type_name}</strong>
													</div>
													<div className="info-item">
														<span className="label">Episodes:</span>
														<strong>{item?.total_episode}</strong>
													</div>
													<div className="info-item">
														<span className="label">Free:</span>
														<strong>{item.free_episodes}</strong>
													</div>
												</div>
												<div className="card-toggles">
													{/* <div className="colors-checkbox">
														<label className="check-label">
															<span className="custom-checkbox">
																<input type="checkbox" name="is_recommended" className="filled" onChange={(e) => handleCheck(item?.id, e.target.name, e.target.checked)} checked={parseInt(item?.is_recommended) === 1} />
																<span className="color"></span>
															</span>
															<div className="color-name">Recommended</div>
														</label>
													</div> */}
													<div className="colors-checkbox">
														<label className="check-label">
															<span className="custom-checkbox">
																<input type="checkbox" name="is_free" className="filled" onChange={(e) => handleCheck(item?.id, e.target.name, e.target.checked)} checked={parseInt(item?.is_free) === 1} />
																<span className="color"></span>
															</span>
															<div className="color-name">Free</div>
														</label>
													</div>
													<div className="colors-checkbox">
														<label className="check-label">
															<span className="custom-checkbox">
																<input type="checkbox" name="is_active" className="filled" onChange={(e) => handleCheck(item?.id, e.target.name, e.target.checked)} checked={parseInt(item?.is_active) === 1} />
																<span className="color"></span>
															</span>
															<div className="color-name">Active</div>
														</label>
													</div>
												</div>

												<div className="card-actions">
													<button className="btn btn-view" onClick={() => navigate('/series/'+item.id)}>View</button>
													<button className="btn btn-edit" onClick={() => editSeries(item)}>Edit</button>
													<button className="btn btn-delete" onClick={() => deleteSeries(item)}>Delete</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div>
								<p style={{ textAlign: "center" }}>No Series Available</p>
							</div>
						)
					}
					{
						visibleCount < data.length && (
							<div className="d-flex align-items-center justify-content-center mt-3">
								<button className="btn upgrade-btn d-flex align-items-center justify-content-center" onClick={showMore}> Load More </button>
							</div>
						)
					}
					{/* <div className="card">
						<div className="card-header">
							<div className="page-title w-100 d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center justify-content-between">
									<h4>Series List (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
								</div>
								<button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Series</button>
							</div>
						</div>
						<div className="card-body">
							<table ref={tableRef} className="movie-table user-table table table-striped w-100 dataTable no-footer" id="seriesTables" role="grid"></table>
						</div>
					</div> */}

					{/* edit-popup start here */}
					{
						showModel.show && (
							<Model className="common-popup edit-popup  active">
								<div className="edit-heading d-flex align-items-center justify-content-between">
									<h3>{showModel.title} Series</h3>
									<button className="common-close edit-close-btn" onClick={(e) => closeModel('Edit')}>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
											<path fill="#ffffff"
												d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
											</path>
										</svg>
									</button>
								</div>
								<div className="edit-inner form-img-upload">
									<form onSubmit={addSeriesData}>
										<div className="row">
											<div className="col-12">
												<div className="form-group">
													<label htmlFor="title">Title</label>
													<input type="text" id="title" name="title" placeholder="Enter title" ref={titleRefFocus} onChange={onChange} value={seriesData.title} />
													<span className='text-danger pt-2'>{errors?.title}</span>
												</div>
												<div className="form-group">
													<label htmlFor="description">Descriptions</label>
													<textarea id="description" name="description" placeholder="Enter Descriptions" ref={descriptionRefFocus} onChange={onChange} value={seriesData.description}></textarea>
													<span className='text-danger pt-2'>{errors?.description}</span>
												</div>
												<div className="form-group">
													<label htmlFor="category_id" className="form-label">Select Category</label>
													<NiceSelect id="category_id" name="category_id" className="form-control" value={seriesData.category_id} onChange={niceSelectOnChange}>
														<option value="">-- Select Category --</option>
														{
															categoryList && categoryList.map((item, index) => {
																return <option key={index} value={item.id}>{item.name}</option>;
															})
														}
													</NiceSelect>
													<span className='text-danger pt-2'>{errors?.category}</span>
												</div>
												<div className="form-group">
													<label htmlFor="tag_id" className="form-label">Select Tag</label>
													<Select2Component
														ref={tagsRefFocus}
														value={seriesData.tag_id}
														options={tagList}
														name={'tag_id'}
														placeholder={'search by tags'}
														onChange={onChangeSelect2}
														isMulti
													/>
													{/* <NiceSelect id="tag_id" name="tag_id" className="form-control" value={seriesData.tag_id} onChange={niceSelectOnChange}>
													<option value="">-- Select Tag --</option>
														{
															tagList && tagList.map((item, index) => {
																return <option key={index} value={item.id}>{item.name}</option>;
															})
														}
													</NiceSelect> */}
													<span className='text-danger pt-2'>{errors?.tag_id}</span>
												</div>
												<div className="form-group">
													<label htmlFor="type_id" className="form-label">Select Type</label>
													<NiceSelect id="type_id" name="type_id" className="form-control" value={seriesData.type_id} onChange={niceSelectOnChange}>
													<option value="">-- Select Type --</option>
														{
															typesList && typesList.map((item, index) => {
																return <option key={index} value={item.id}>{item.type_name}</option>;
															})
														}
													</NiceSelect>
													<span className='text-danger pt-2'>{errors?.type}</span>
												</div>
												<div className="form-group">
													<label htmlFor="total_episode">Total Episode</label>
													<NumberInput id="total_episode" name="total_episode" placeholder="Enter Total Episodes" ref={totalEpisodeRefFocus} onChange={onChange} value={seriesData.total_episode} />
													<span className='text-danger pt-2'>{errors?.total_episode}</span>
												</div>
												<div className="form-group">
													<label htmlFor="free_episodes">Free Episode</label>
													<NumberInput id="free_episodes" name="free_episodes" placeholder="Enter Free Episodes" ref={freeEpisodeRefFocus} onChange={onChange} value={seriesData.free_episodes} />
													<span className='text-danger pt-2'>{errors?.free_episodes}</span>
												</div>
												<div className="form-group">
													<label htmlFor="is_free" className="form-label">Free</label>
													<NiceSelect id="is_free" name="is_free" className="form-control" value={seriesData.is_free} onChange={niceSelectOnChange}>
														<option value="1">Yes</option>
														<option value="0">No</option>
													</NiceSelect>
												</div>
												<div className="form-group">
													<label htmlFor="is_recommended" className="form-label">Recommended</label>
													<NiceSelect id="is_recommended" name="is_recommended" className="form-control" value={seriesData.is_recommended} onChange={niceSelectOnChange}>
														<option value={1}>Yes</option>
														<option value={0}>No</option>
													</NiceSelect>
												</div>
											</div>
											<div className="col-sm-6 col-12">
												<div className="form-group">
													<CustomImageBox
														imageUrl={!isEmpty(filePreview.thumbnail) ? filePreview.thumbnail : "https://flixy.retrytech.site/assets/img/placeholder-image.png"}
														onChange={handleImage}
														label={'Thumbnail'}
														ref={thumbnailRefFocus}
														name="thumbnail"
													/>
													<span className='text-danger pt-2'>{errors?.thumbnail}</span>
												</div>
											</div>
											<div className="col-sm-6 col-12">
												<div className="form-group">
													<CustomVideoBox
														videoUrl={!isEmpty(filePreview.cover_video) ? filePreview.cover_video : "https://flixy.retrytech.site/assets/img/placeholder-image.png"}
														onChange={handleImage}
														label={'Cover video'}
														name="cover_video"
														ref={coverVideoRefFocus}
													/>
													<span className='text-danger pt-2'>{errors?.cover_video}</span>
												</div>
											</div>
											<div className="col-sm-6 col-12">
												<div className="form-group">
													<CustomImageBox
														imageUrl={!isEmpty(filePreview.poster) ? filePreview.poster : "https://flixy.retrytech.site/assets/img/placeholder-image.png"}
														onChange={handleImage}
														label={'Poster'}
														ref={posterRefFocus}
														name="poster"
													/>
													<span className='text-danger pt-2'>{errors?.poster}</span>
												</div>
											</div>
											<div className="col-12">
												<div className="action-footer">
													<button className="btn" disabled={showModel.title === 'Add' ? addSeriesLoading.loading : updateSeriesLoading.loading}>
														{(showModel.title === 'Add' ? addSeriesLoading.loading : updateSeriesLoading.loading) ? (
															<div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
																<span className="visually-hidden">Loading...</span>
															</div>
														) : (
															"💾 Save"
														)}
													</button>
												</div>
											</div>
										</div>
									</form>
								</div>
							</Model> 
						)
					}
				</>
			}
		</>
	);
};

export default Series;
