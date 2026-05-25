import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import $ from 'jquery';
import * as action from '../Action/Profile/Profile_Action';
import Loader from "./Loader";
import { useAuth } from "../context/Context";

const Profile = () => {
	const { user } = useAuth();
	const [profileData, setProfileData] = useState({ email: '', name: '', phone: '', profile_image: '' });
	const [changePasswordData, setChangePasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
	const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.GetProfileReducer);
	const [previewImage, setPreviewImage] = useState(null);
    const nameRefFocus = useRef(null);
    const phoneRefFocus = useRef(null);
    const oldPasswordRefFocus = useRef(null);
    const newPasswordRefFocus = useRef(null);
    const confirmPasswordRefFocus = useRef(null);
	const hasFetched = useRef(null);

	useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
		
		dispatch(action.getProfile()).then((response) => {
			let data = response.responseDetails;
			setProfileData({
				name: data.name,
				email: data.email,
				phone: data.phone ?? '',
				profile_image: '',
			});
			setPreviewImage(data.profile_image && data.profile_image.trim() !== '' ? data.profile_image : "./assets/images/profil-img-1.png");
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}, [dispatch]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
	
		if (file) {
			const previewURL = URL.createObjectURL(file);
			setPreviewImage(previewURL);
	
		  	// Optional: update the image file in state for submitting
			setProfileData((prev) => ({
				...prev,
				profile_image: file,
			}));
		}
	};

    const changeProfileValue = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value })
    }

    const changePasswordValue = (e) => {
        setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value })
    }
	
	const updateProfile = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
		if (profileData.name === '') {
			customErrors = { ...customErrors, name: "Please Enter Full Name" }
			nameRefFocus.current.focus();
		} else  if (profileData.phone === '') {
			customErrors = { ...customErrors, phone: "Please Enter Phone Number" }
			phoneRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}
		let data = new FormData();
		data.append('name', profileData.name);
		data.append('phone', profileData.phone);
		if(profileData.profile_image){
			data.append('profile_image', profileData.profile_image);
		}
		dispatch(action.updateProfile(data)).then((response) => {
			toast.success(response.responseMessage);
			$(".profile_image").attr('src', response.responseDetails.profile_image);
			$("#profile_name").html(response.responseDetails.name);
			setProfileData({
				name: response.responseDetails.name,
				email: response.responseDetails.email,
				phone: response.responseDetails.phone ?? '',
				profile_image: '',
			});
			$("#profile-picture").val('');
            localStorage.setItem('admin_details', JSON.stringify(response.responseDetails));
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}
	
	const changePassword = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
        let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;
		if (changePasswordData.oldPassword === '') {
			customErrors = { ...customErrors, oldPassword: "Please Enter Current Password" }
			oldPasswordRefFocus.current.focus();
		} else  if (changePasswordData.newPassword === '') {
			customErrors = { ...customErrors, newPassword: "Please Enter New Password" }
			newPasswordRefFocus.current.focus();
		} else  if (!passwordRegex.test(changePasswordData.newPassword)) {
			customErrors = { ...customErrors, newPassword: "The password must be at least 8 characters long and include one uppercase letter, one digit, and one special character" }
			newPasswordRefFocus.current.focus();
		} else  if (changePasswordData.confirmPassword === '') {
			customErrors = { ...customErrors, confirmPassword: "Please Enter Confirm New Password" }
			confirmPasswordRefFocus.current.focus();
		} else  if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
			customErrors = { ...customErrors, confirmPassword: "The new password and confirm password are not match" }
			confirmPasswordRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}

		dispatch(action.updatePassword(changePasswordData)).then((response) => {
			toast.success(response.responseMessage);
			setChangePasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}
	
	return (
		<>
			{ loading ? <Loader />  : 
				<>
					<section id="profile-section" className="profile-section section">
						<div className="profile-overview-section">
							<h2 className="section-title">Profile Overview</h2>
							<form className="settings-form" onSubmit={updateProfile}>
								<div className="row">
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label>Profile Picture</label>
											<div className="profile-pic-upload d-flex align-items-center gap-3">
												<img src={previewImage} alt="Profile" className="rounded-circle border" />
												<div className="w-100">
													<input type="file" id="profile-picture" accept="image/*" onChange={handleImageChange} />
													<p className="small mt-2">Recommended size: 400x400px</p>
												</div>
											</div>
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="full-name">Full Name</label>
											<input type="text" id="full-name" name="name" ref={nameRefFocus} value={profileData.name} onChange={changeProfileValue} placeholder="John Doe" />
                                			<span className='text-danger pt-2'>{errors?.name}</span>
										</div>
									</div>
									{/* <div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="username">Username</label>
											<input type="text" id="username" placeholder="johndoe" />
										</div>
									</div> */}
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="email">Email Address</label>
											<input type="email" id="email" name="email" value={profileData.email} disabled />
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="phone">Phone Number</label>
											<input type="tel" id="phone" name="phone" ref={phoneRefFocus} value={profileData.phone} onChange={changeProfileValue} placeholder="+1 234 567 8900" />
                                			<span className='text-danger pt-2'>{errors?.phone}</span>
										</div>
									</div>
									{/* <div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="role">Role / Permission Level</label>
											<select id="role" style={{display: 'none'}}>
												<option selected>Admin</option>
												<option>Moderator</option>
												<option>User</option>
											</select>
											<div className="nice-select" tabIndex="0">
												<span className="current">Admin</span>
												<ul className="list">
													<li data-value="Admin" className="option selected">Admin</li>
													<li data-value="Moderator" className="option">Moderator</li>
													<li data-value="User" className="option">User</li>
												</ul>
											</div>
										</div>
									</div> */}
								</div>

								<div className="setting-btn">
									<button type="submit" className="btn">Save Changes</button>
								</div>
							</form>
						</div>
						{/* <div className="personal-info-section">
							<h2 className="section-title">Personal Information</h2>
							<form className="settings-form">
								<div className="row"> 
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="country">Country / Location</label>
											<input type="text" id="country" placeholder="Enter your country or location" />
										</div>
									</div> 
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="language-pref">Language Preference</label>
											<select id="language-pref" style={{display: 'none'}}>
												<option>English</option>
												<option>Spanish</option>
												<option>French</option>
												<option>German</option>
												<option>Japanese</option>
											</select>
											<div className="nice-select" tabIndex="0">
												<span className="current">English</span>
												<ul className="list">
													<li data-value="English" className="option selected">English</li>
													<li data-value="Spanish" className="option">Spanish</li>
													<li data-value="French" className="option">French</li>
													<li data-value="German" className="option">German</li>
													<li data-value="Japanese" className="option">Japanese</li>
												</ul>
											</div>
										</div>
									</div> 
									<div className="col-md-12 col-12">
										<div className="form-group">
											<label htmlFor="bio">Bio / About Me</label>
											<textarea id="bio" rows="4"
												placeholder="Tell us something about yourself..."></textarea>
										</div>
									</div>
								</div> 
								<div className="setting-btn">
									<button type="submit" className="btn">Save Changes</button>
								</div>
							</form>
						</div> */}
					
						
					</section>
					<section id="profile-section" className="profile-section section mt-5">
						<div className="profile-overview-section">
							<h2 className="section-title">Change Password</h2>
							<form className="settings-form" onSubmit={changePassword}>
								<div className="row">
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="current_password">Current Password</label>
											<input type="text" id="current_password" name="oldPassword" ref={oldPasswordRefFocus} value={changePasswordData.oldPassword} onChange={changePasswordValue} placeholder="Enter Current Password" />
                                			<span className='text-danger pt-2'>{errors?.oldPassword}</span>
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="new_password">New Password</label>
											<input type="text" id="new_password" name="newPassword" ref={newPasswordRefFocus} value={changePasswordData.newPassword} onChange={changePasswordValue}  placeholder="Enter New Password" />
                                			<span className='text-danger pt-2'>{errors?.newPassword}</span>
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="form-group">
											<label htmlFor="confirm_new_password">Confirm New Password</label>
											<input type="text" id="confirm_new_password" name="confirmPassword" ref={confirmPasswordRefFocus} value={changePasswordData.confirmPassword} onChange={changePasswordValue} placeholder="Enter Confirm New Password" />
                                			<span className='text-danger pt-2'>{errors?.confirmPassword}</span>
										</div>
									</div>
								</div>

								<div className="setting-btn">
									<button type="submit" className="btn">Save Changes</button>
								</div>
							</form>
						</div>
					</section>
				</>
			}
		</>
	);
};

export default Profile;
