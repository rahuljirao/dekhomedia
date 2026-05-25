import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from 'jquery';
import { isEmpty } from "lodash";
import * as action from '../Action/Notification/Notification_Action';
import { toast } from 'react-toastify';
import { useAuth } from "../context/Context";
import CustomImageBox from "./UploadPreview/CustomImageBox";

const SendNotification = () => {
	const { user } = useAuth();
	const [data, setData] = useState({ title: '', message: '', image: '' });
	const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.SendNotificationReducer);
	const [filePreview, setFilePreview] = useState(null);
    const titleRefFocus = useRef(null);
    const messageRefFocus = useRef(null);
    const imageRefFocus = useRef(null);

    const handleImage = (e, image, preview) => {
        setData({ ...data, [e.target.name]: image });
        setFilePreview(preview);
    }

    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
	
	const sendNotification = (e) => {
		e.preventDefault();
		const isAccessAllowed = user?.login_type !== 'Guest';

		if (!isAccessAllowed) {
			toast.error("Opps! You don't have Permission.");
			return false;
		}
		
		setErrors({});
		let customErrors = {};
		if (data.title === '') {
			customErrors = { ...customErrors, title: "Please Enter Title" }
			titleRefFocus.current.focus();
		} else  if (data.message === '') {
			customErrors = { ...customErrors, message: "Please Enter Message" }
			messageRefFocus.current.focus();
		}

		if (Object.keys(customErrors).length > 0) {
			setErrors(customErrors)
			return true
		}
		let formData = new FormData();
		formData.append('title', data.title);
		formData.append('message', data.message);
		if(data.image){
			formData.append('image', data.image);
		}
		dispatch(action.sendNotification(formData)).then((response) => {
			toast.success(response.responseMessage);
			setData({ title: '', message: '', image: '' });
            setFilePreview(null);
			$("#profile-picture").val('');
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}

    return (
        <>
            <section id="profile-section" className="profile-section section">
                <div className="profile-overview-section">
                    <h2 className="section-title">Send Notification</h2>
                    <form className="settings-form form-img-upload" onSubmit={sendNotification}>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" name="title" ref={titleRefFocus} value={data.title} onChange={onChange} placeholder="Enter Title" />
                                    <span className='text-danger pt-2'>{errors?.title}</span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <input type="text" id="message" name="message" ref={messageRefFocus} value={data.message} onChange={onChange} placeholder="Enter Message" />
                                    <span className='text-danger pt-2'>{errors?.message}</span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <CustomImageBox
                                        imageUrl={!isEmpty(filePreview) ? filePreview : "https://flixy.retrytech.site/assets/img/placeholder-image.png"}
                                        onChange={handleImage}
                                        label={'Image'}
                                        name="image"
                                        ref={imageRefFocus}
                                    />
                                    <span className='text-danger pt-2'>{errors?.image}</span>
                                </div>
                            </div>
                        </div>

                        <div className="setting-btn">
                            <button type="submit" className="btn" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Send Notification"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default SendNotification;
