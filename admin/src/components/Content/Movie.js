import React, { useEffect, useRef, useState } from "react";
import $ from 'jquery';
import Model from "../Model/Index";

const Movie = () => {
	const tableRef = useRef(null);
	const dataTableInstanceRef = useRef(null);
	const [showModel, setShowModel] = useState({
		show: false,
		title: 'Add Media'
	});
	useEffect(() => {
        let tableRefCurrent = tableRef.current;
		const $ = window.$ || window.jQuery;
	
		if ($ && tableRefCurrent) {
			dataTableInstanceRef.current = $(tableRefCurrent).DataTable({
				destroy: true,
				scrollX: true,
				columns: [
					{ data: 'Poster' },
					{ data: 'Title' },
					{ data: 'Ratings' },
					{ data: 'Release Year' },
					{ data: 'Language' },
					{ data: 'Featured' },
					{ data: 'Hide / Show' },
					{ data: 'Action' }
				],
				columnDefs: [
					{ orderable: false, targets: [1, 7] }
				]
			});

            // Bind jQuery click manually
            $(tableRefCurrent).on('click', '.edit-btn', function (e) {
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

	const handleChange = () => {
		
	}

	return (
		<>
			{/* { loading ? <Loader /> :  */}
				<>
					<div className='overlay'></div>
					<div className="card">
						<div className="card-header">
							<div className="page-title w-100">
								<div className="d-flex align-items-center justify-content-between">
									<h4>Movie List (<span className="total_user">19K</span>)
									</h4>
								</div>
							</div>
						</div>
						<div className="card-body">
							<table ref={tableRef} className="movie-table user-table table table-striped w-100 dataTable no-footer" id="moviesTables" role="grid">
								<thead>
									<tr>
										<th data-orderable="false" >Poster</th>
										<th data-orderable="false" >Title</th>
										<th data-orderable="false" >Ratings</th>
										<th data-orderable="false" > Release Year</th>
										<th data-orderable="false" >Language</th>
										<th data-orderable="false" >Featured</th>
										<th data-orderable="false" >Hide / Sho</th>
										<th data-orderable="false" >Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<div className="img-wrapper">
												<img src="./assets/images/movie-1.png" alt="movie-1" />
											</div>
										</td>
										<td>Avengers: Infinity War</td>
										<td>7</td>
										<td>2024</td>
										<td>English</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none featured" rel="30" value="0" />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none hideContent" checked="" rel="30" value="1" onChange={handleChange} />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="d-flex gap-2">
												<button className="btn btn-sm btn-primary edit-btn" title="Edit">
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
											<div className="img-wrapper">
												<img src="./assets/images/movie-2.png" alt="movie-2" />
											</div>
										</td>
										<td>
											Interstiller
										</td>
										<td>9</td>
										<td>2024</td>
										<td>English</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none featured" rel="30" value="0" />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none hideContent" checked="" rel="30" value="1" onChange={handleChange} />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="d-flex gap-2">
												<button className="btn btn-sm btn-primary edit-btn" title="Edit">
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
											<div className="img-wrapper">
												<img src="./assets/images/movie-3.png" alt="movie-3" />
											</div>
										</td>
										<td>The Lord of the Rings: The Rings of Power</td>
										<td>7</td>
										<td>2024</td>
										<td>English</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none featured" rel="30" value="0" />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none hideContent" checked="" rel="30" value="1" onChange={handleChange} />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="d-flex gap-2">
												<button className="btn btn-sm btn-primary edit-btn" title="Edit">
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
											<div className="img-wrapper">
												<img src="./assets/images/banner-poster-10.jpg" alt="banner-poster-10" />
											</div>
										</td>
										<td>Jawan</td>
										<td>8</td>
										<td>2024</td>
										<td>English</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none featured" rel="30" value="0" />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none hideContent" checked="" rel="30" value="1" onChange={handleChange} />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="d-flex gap-2">
												<button className="btn btn-sm btn-primary edit-btn" title="Edit">
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
											<div className="img-wrapper">
												<img src="./assets/images/banner-poster-7.jpg" alt="banner-poster-7" />
											</div>
										</td>
										<td>Iron Man 2</td>
										<td>9.5</td>
										<td>2024</td>
										<td>English</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none featured" rel="30" value="0" />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="checkbox-slider d-flex align-items-center">
												<label>
													<input type="checkbox" className="d-none hideContent" checked="" rel="30" value="1" onChange={handleChange} />
													<span className="toggle_background">
														<div className="circle-icon"></div>
														<div className="vertical_line"></div>
													</span>
												</label>
											</div>
										</td>
										<td>
											<div className="d-flex gap-2">
												<button className="btn btn-sm btn-primary edit-btn" title="Edit">
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

					{/* edit-popup start here */}
					{
						showModel.show && (
							<Model className="common-popup edit-popup  active">
								<div className="edit-heading d-flex align-items-center justify-content-between">
									<h3>Edit Details</h3>
									<button className="common-close edit-close-btn" onClick={(e) => closeModel('Edit')}>
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
												<label htmlFor="selecttype" className="form-label">Select Type</label>
												<select id="selecttype" name="selecttype" className="form-control selectric" required tabIndex="-1">
													<option value="USD">Movies</option>
													<option value="EUR">Web Series</option>
												</select>
											</div>
											<div className="form-group">
												<label htmlFor="site-title">Title</label>
												<input type="text" id="site-title" placeholder="Enter title" />
											</div>
											<div className="form-group">
												<label htmlFor="ip-whitelist">Descriptions</label>
												<textarea id="ip-whitelist" placeholder="Enter Descriptions"></textarea>
											</div>
											<div className="form-group">
												<label htmlFor="selectgenre" className="form-label">Select Genre (Multiple)</label>
												<select id="selectgenre" name="selectgenre" className="form-control selectric" required
													tabIndex="-1">
													<option value="USD">Kids</option>
													<option value="EUR">News</option>
												</select>
											</div>
											<div className="form-group">
												<label htmlFor="selectlng" className="form-label">Select Languages</label>
												<select id="selectlng" name="selectlng" className="form-control selectric" required tabIndex="-1">
													<option>English</option>
													<option>Spanish</option>
													<option>French</option>
													<option>German</option>
													<option>Japanese</option>
												</select>
											</div>
											<div className="form-group">
												<label htmlFor="release_year">Release Year</label>
												<input type="release_year" id="number" placeholder="Enter year" />
											</div>
											<div className="form-group">
												<label htmlFor="ratings">Ratings</label>
												<input type="ratings" id="number" placeholder="Enter Rating" />
											</div>
											<div className="form-group">
												<label htmlFor="vertical_poster" className="form-label">Vertical Poster</label>
												<div className="posterImg position-relative">
													<div className="upload-options">
														<input name="vertical_poster" type="file" accept=".png, .jpg, .jpeg, .webp" id="poster" required="" />
													</div>
												</div>
											</div>
											<div className="action-footer">
												<button className="btn btn-primary">💾 Save</button>
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

export default Movie;
