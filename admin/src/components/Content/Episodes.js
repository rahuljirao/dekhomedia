import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import $ from 'jquery';
import Swal from 'sweetalert2';
import moment from "moment";
import { isEmpty } from "lodash";
import * as action from '../../Action/Episodes/Episodes_Action';
import { getTags } from '../../Action/Tags/Tags_Action';
import Model from "../Model/Index";
import CustomVideoBox from "../UploadPreview/CustomVideoBox";
import NumberDisplay from "../NumberDisplay/Index";
import Select2Component from "../CustomSelect/Select2";
import NumberInput from "../Input/Number";
import { useAuth } from "../../context/Context";

const Episodes = () => {
    const { user } = useAuth();
	const { id } = useParams();
	const dispatch = useDispatch();
	const tableRef = useRef(null);
	const updateEpisodesLoading = useSelector(state => state.UpdateEpisodesReducer);
	const addEpisodesLoading = useSelector(state => state.AddEpisodesReducer);
	const addMultipleEpisodesLoading = useSelector(state => state.AddMultipleEpisodesReducer);
	const addEpisodesUrlsLoading = useSelector(state => state.AddEpisodesUrlsReducer);
    const dataTableInstanceRef = useRef(null);
	const [showModel, setShowModel] = useState({
		show: false,
		title: 'Add'
	});
	const [showMultipleModel, setShowMultipleModel] = useState(false);
	const [count, setCount] = useState(0);
	const [errors, setErrors] = useState({});
	const [videoPopupVisible, setVideoPopupVisible] = useState(false);
	const [currentVideoSrc, setCurrentVideoSrc] = useState("");
	const [episodeData, setEpisodeData] = useState({
		id: 0,
		series_id: id,
		episode_number: '',
		coin: '',
		video_url: '',
		title: '',
		description: '',
		tags: []
	});
	const [episodeMultipleData, setEpisodeMultipleData] = useState({
		series_id: id,
		file: []
	});
	const [showUrlModel, setUrlModel] = useState(false);
    const [urlFields, setUrlFields] = useState([""]);
	const [tagList, setTagList] = useState([]);
	const [filePreview, setFilePreview] = useState('');
    const episodeNumberRefFocus = useRef(null);
    const coinRefFocus = useRef(null);
    const coverVideoRefFocus = useRef(null);
	const titleRefFocus = useRef(null);	
	const descriptionRefFocus = useRef(null);
	const tagsRefFocus = useRef(null);
	const episodeMultipleRefFocus = useRef(null);
	const hasFetchedRef = useRef(null);

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
	
			if ($ && tableRefCurrent && !$.fn.DataTable.isDataTable(tableRefCurrent)) {
				dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
					processing: true,
					serverSide: true,
					scrollX: true,
					autoWidth: false,
					scrollCollapse: true,
					pagingType: pagingType,
					ajax: (dataTablesParams, callback) => {
						const columns = [null, 0, 'episode_number', 'title', 'coin', 'views', 'created_at'];
						const sortColumnIndex = dataTablesParams.order[0].column;
						const sortColumnName = columns[sortColumnIndex];
						const params = {
							search: dataTablesParams.search.value,
							start: dataTablesParams.start,
							length: dataTablesParams.length,
							dir: dataTablesParams.order[0].dir,
							sortColumn: sortColumnName,
							series_id: id
						};
						dispatch(action.getEpisodes(params)).then((action) => {
							setCount(action.responseDetails.totalRecords || 0);
							callback({
								data: action.responseDetails.data || [],
								recordsTotal: action.responseDetails.totalRecords || 0,
								recordsFiltered: action.responseDetails.recordsFiltered || 0,
							});
						});
					},
					destroy: true,
					order: [2, 'asc'],
					columns: [
						{ 
							data: null,
							title: 'No',
							width: "25px",
							orderable: false,
							render: function (data, type, row, meta) {
								return meta.row + meta.settings._iDisplayStart + 1;
							}
						},
						{
							data: null,
							width: "100px",
							title: 'Thumbnail',
							orderable: false,
							render: function (data, type, row) {
								return `
									<div class="img-wrapper">
										<img src="${row.thumbnail_url}" />
									</div>
								`;
							}
						},
						{ data: 'episode_number', title: 'Episode No.', width: "100px"},
						{ data: 'title', title: 'Title' },
						{ data: 'coin', title: 'Coin', width: "60px" },
						{ data: 'views', title: 'Views', width: "60px" },
						{ data: 'total_coins', title: 'Coin Earned', width: "100px" },
						{
							data: 'created_at',
							title: 'Date',
							orderable: true,
							width: "150px",
							render: function (data, type, row) {
								if (!data) return '';
								return moment(data).format("MMMM DD, YYYY")
							}
						},
						{
							data: null,
							title: 'Action',
							orderable: false,
							width: "150px",
							render: function (data, type, row) {
								return `
									<div class="d-flex gap-2">
										<button class="btn btn-sm btn-primary video-prv-btn" data-video="${row.video_url}" title="Edit">
											<i class="fas fa-eye"></i>
										</button>
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

				$(tableRefCurrent).on('click', '.video-prv-btn', function (e) {
					const videoSrc = $(this).data('video'); // get custom data-video attribute
					handleVideoPreview(videoSrc);
				});

				$(tableRefCurrent).on('click', '.edit-btn', function (e) {
					let rowData = dataTableInstanceRef.current.row($(this).closest('tr')).data();
					openModel('Edit');
					setEpisodeData({
						id: rowData.id,
						series_id: id,
						episode_number: rowData.episode_number,
						coin: rowData.coin,
						title: rowData?.title || '',
						description: rowData?.description || '',
						tags: isEmpty(rowData.tags) ? [] : rowData.tags.split(",").map(Number),
					});
					setFilePreview(rowData.video_url);
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
							dispatch(action.deleteEpisodes({id: rowData.id})).then((action) => {
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
	}, [dispatch, id, user]);
	
	useEffect(() => {
		if(hasFetchedRef.current) return;
		hasFetchedRef.current = true;

		const getData = () => {
			dispatch(getTags({getAll: true})).then((action) => {
				let data = action.responseDetails.data || [];
				setTagList(data.map(x => ({ value: x.id, label: x.name })));
			});
		}

		getData();
	}, [dispatch]);

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
		setEpisodeData({
			id: 0,
			series_id: id,
			episode_number: '',
			coin: '',
			video_url: '',
			title: '',
			description: '',
			tags: [],
		});
		setFilePreview('');
    }

    const openMultipleModel = (name) => {
        setShowMultipleModel(true);
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }

    const closeMultipleModel = (name) => {
        setShowMultipleModel(false);
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
		setErrors({});
		setEpisodeMultipleData({
			series_id: id,
			file: []
		});
    }

	const handleAddField = () => {
        setUrlFields([...urlFields, ""]);
    };

	const handleRemoveField = (index) => {
        const updated = [...urlFields];
        updated.splice(index, 1);
        setUrlFields(updated);
    };

	const handleChange = (index, value) => {
        const updated = [...urlFields];
        updated[index] = value;
        setUrlFields(updated);
    };

	const openUrlModel = () => {
        setUrlModel(true);
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    }
	
	const closeUrlModel = () => {
        setUrlModel(false);
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
        setErrors({});
		setUrlFields([""]);
    }

    const onChange = (e) => {
        setEpisodeData({ ...episodeData, [e.target.name]: e.target.value })
    }

    const onChangeSelect2 = (value) => {
		setEpisodeData(prevData => ({...prevData, tags: value}));
    }

    const handleImage = (e, image, preview) => {
        setEpisodeData({ ...episodeData, [e.target.name]: image });
        setFilePreview(preview);
    }
	
	const addEpisodesData = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}

		setErrors({});
		let customErrors = {};
		if (episodeData.episode_number === '') {
			customErrors = { ...customErrors, episode_number: "Please Enter Episode Number" }
			episodeNumberRefFocus.current.focus();
		// } else if (episodeData.title === '') {
		// 	customErrors = { ...customErrors, title: "Please Enter Episode Title" }
		// 	titleRefFocus.current.focus();
		// } else if (episodeData.description === '') {
		// 	customErrors = { ...customErrors, description: "Please Enter Episode Description" }
		// 	descriptionRefFocus.current.focus();
		// } else if (episodeData.tags.length === 0) {
		// 	customErrors = { ...customErrors, tags: "Please Select Episode Tags" }
		// 	tagsRefFocus.current.focus();
		} else if (episodeData.coin === '') {
			customErrors = { ...customErrors, coin: "Please Enter Episode Coin" }
			coinRefFocus.current.focus();
		} else if (episodeData.video_url === '') {
			customErrors = { ...customErrors, video_url: "Please Select Video" }
			coverVideoRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}

		let data = new FormData();

		data.append('series_id', episodeData.series_id);
		data.append('episode_number', episodeData.episode_number);
		data.append('coin', episodeData.coin);
		data.append('video_url', episodeData.video_url);
		data.append('title', episodeData.title);
		data.append('description', episodeData.description);
		data.append('tags', episodeData.tags.join(','));

		if(episodeData.id !== 0){
			data.append('id', episodeData.id);
			dispatch(action.updateEpisodes(data)).then((response) => {
				toast.success(response.responseMessage);
				closeModel('Add');
	
				if (dataTableInstanceRef.current) {
					dataTableInstanceRef.current.ajax.reload(null, false);
				}
			}).catch(error => {
				toast.error(error.responseMessage);
			})
		} else {
			dispatch(action.addEpisodes(data)).then((response) => {
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

	const addMultipleEpisodesData = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
		if (episodeMultipleData.file.length === 0) {
			customErrors = { ...customErrors, file: "Please Upload Files" }
			episodeMultipleRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}

		let data = new FormData();

		data.append('series_id', episodeMultipleData.series_id);
		episodeMultipleData.file.forEach(file => {
			data.append('video_url', file);
		});

		dispatch(action.addMultipleEpisodes(data)).then((response) => {
			toast.success(response.responseMessage);
			closeMultipleModel();

			if (dataTableInstanceRef.current) {
				dataTableInstanceRef.current.ajax.reload(null, false);
			}
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}

	const addEpisodeLinkData = (e) => {
        e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
		urlFields.forEach((url, i) => {
			if (url.trim() === "") {
				customErrors[`url${i}`] = "Please Enter URL";
			}
		});

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}

        const finalData = {
            series_id: id,
            episode_links: urlFields.filter((u) => u.trim() !== ""),
        };

		dispatch(action.addEpisodesUrls(finalData)).then((response) => {
			toast.success(response.responseMessage);
			closeUrlModel();
			setUrlFields([""]);

			if (dataTableInstanceRef.current) {
				dataTableInstanceRef.current.ajax.reload(null, false);
			}
		}).catch(error => {
			toast.error(error.responseMessage);
		})
    };

	return (
		<>
			{/* { loading ? <Loader /> :  */}
				<>
					<div className='overlay'></div>
					<div className="card">
						<div className="card-header">
							<div className="page-title w-100 d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center justify-content-between">
									<h4>Episode List (<span className="total_user">{<NumberDisplay count={count} />}</span>)</h4>
								</div>
								<div className="d-flex align-items-center gap-2">
									<button className="btn upgrade-btn add-notification-btn" onClick={(e) => openUrlModel()}>Add Episode Url</button>
									<button className="btn upgrade-btn add-notification-btn" onClick={(e) => openMultipleModel()}>Add Multiple Episode</button>
									<button className="btn upgrade-btn add-notification-btn" onClick={(e) => openModel('Add')}>Add Episode</button>
								</div>
							</div>
						</div>
						<div className="card-body">
							<table ref={tableRef} className="movie-table table-layout-fixed user-table table table-striped w-100 dataTable no-footer" id="seriesTables" role="grid"></table>
						</div>
					</div>

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

					{/* edit-popup start here */}
					{
						showModel.show && (
							<Model className="common-popup edit-popup  active">
								<div className="edit-heading d-flex align-items-center justify-content-between">
									<h3>{showModel.title} Episode</h3>
									<button className="common-close edit-close-btn" onClick={(e) => closeModel('Edit')}>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
											<path fill="#ffffff"
												d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
											</path>
										</svg>
									</button>
								</div>
								<div className="edit-inner">
									<form onSubmit={addEpisodesData}>
										<div className="row">
											<div className="col-12">
												<div className="form-group">
													<label htmlFor="episode_number">Episode Number</label>
													<NumberInput id="episode_number" name="episode_number" placeholder="Enter Episode Number" ref={episodeNumberRefFocus} onChange={onChange} value={episodeData.episode_number} />
													<span className='text-danger pt-2'>{errors?.episode_number}</span>
												</div>
												<div className="form-group">
													<label htmlFor="title">Title</label>
													<input type="text" id="title" name="title" placeholder="Enter Episode Title" ref={titleRefFocus} onChange={onChange} value={episodeData.title} />
													<span className='text-danger pt-2'>{errors?.title}</span>
												</div>
												<div className="form-group">
													<label htmlFor="description">Description</label>
													<textarea id="description" name="description" placeholder="Enter Description" ref={descriptionRefFocus} onChange={onChange} value={episodeData.description}></textarea>
													<span className='text-danger pt-2'>{errors?.description}</span>
												</div>
												<div className="form-group">
													<label htmlFor="coin">Coin</label>
													<NumberInput id="coin" name="coin" placeholder="Enter Coin" ref={coinRefFocus} onChange={onChange} value={episodeData.coin} />
													<span className='text-danger pt-2'>{errors?.coin}</span>
												</div>
												<div className="form-group">
													<label htmlFor="tags">Tags</label>
													<Select2Component
														ref={tagsRefFocus}
														value={episodeData.tags}
														options={tagList}
														name={'tags'}
														placeholder={'search by tags'}
														onChange={onChangeSelect2}
														isMulti
													/>
													<span className='text-danger pt-2'>{errors?.tags}</span>
												</div>
											</div>
											<div className="col-sm-6 col-12">
												<div className="form-group">
													<CustomVideoBox
														videoUrl={!isEmpty(filePreview) ? filePreview : "https://flixy.retrytech.site/assets/img/placeholder-image.png"}
														onChange={handleImage}
														label={'Video'}
														name="video_url"
														ref={coverVideoRefFocus}
													/>
													<span className='text-danger pt-2'>{errors?.video_url}</span>
												</div>
											</div>
											<div className="col-12">
												<div className="action-footer">
													<button className="btn" disabled={showModel.title === 'Add' ? addEpisodesLoading.loading : updateEpisodesLoading.loading}>
														{(showModel.title === 'Add' ? addEpisodesLoading.loading : updateEpisodesLoading.loading) ? (
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

					{
						showMultipleModel && (
							<Model className="common-popup edit-popup active">
								<div className="edit-heading d-flex align-items-center justify-content-between">
									<h3>Add Multiple Episodes</h3>
									<button className="common-close edit-close-btn" onClick={(e) => closeMultipleModel()}>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
											<path fill="#ffffff"
												d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
											</path>
										</svg>
									</button>
								</div>
								<div className="edit-inner">
									<form onSubmit={addMultipleEpisodesData}>
										<div className="row">
											<div className="col-12">
												<div className="form-group">
													<code>Please upload maximum 5 files at a time</code>
													<br></br>
													<br></br>
													<label htmlFor="vertical_poster" className="form-label">Upload Folder</label>
													<div className="posterImg position-relative">
														<div className="upload-options">
															<input ref={episodeMultipleRefFocus} name="vertical_poster" type="file" multiple onChange={(e) => setEpisodeMultipleData(prevData => ({...prevData, file: [...e.target.files]}))}/>
															<span className='text-danger pt-2'>{errors?.file}</span>
														</div>
													</div>
												</div>
											</div>
											<div className="col-12">
												<div className="action-footer">
													<button className="btn" disabled={addMultipleEpisodesLoading.loading}>
														{(addMultipleEpisodesLoading.loading) ? (
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

					{
						showUrlModel && (
							<div className="common-popup edit-popup active">
								<div className="edit-heading d-flex align-items-center justify-content-between">
									<h3>Add Episodes Url</h3>
									<button className="common-close edit-close-btn" onClick={(e) => closeUrlModel()}>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
											<path fill="#ffffff"
												d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z">
											</path>
										</svg>
									</button>
								</div>
		
								<div className="edit-inner">
									<form onSubmit={addEpisodeLinkData}>
										<div className="row">
											{
												urlFields.map((url, index) => (
													<div className="col-12 mb-2" key={index}>
														<div className="d-flex align-items-center">
															<input
																type="url"
																className="form-control"
																placeholder={`Enter Episode Url ${index + 1}`}
																value={url}
																onChange={(e) => handleChange(index, e.target.value)}
															/>
															{index === urlFields.length - 1 ? (
																<button
																	type="button"
																	className="btn btn-success ms-2"
																	onClick={handleAddField}
																>
																	<i className="fas fa-plus"></i>
																</button>
															) : (
																<button
																	type="button"
																	className="btn btn-danger ms-2"
																	onClick={() => handleRemoveField(index)}
																>
																	<i className="fas fa-trash-alt"></i>
																</button>
															)}
														</div>
														<span className='text-danger d-inline pt-1'>{errors[`url${index}`]}</span>
													</div>
												))
											}		
											<div className="col-12">
												<div className="action-footer">
													<button className="btn" disabled={addEpisodesUrlsLoading.loading}>
														{(addEpisodesUrlsLoading.loading) ? (
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
							</div>
						)
					}
				</>
			{/* } */}
		</>
	);
};

export default Episodes;
