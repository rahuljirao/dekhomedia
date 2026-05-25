import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import * as action from '../../Action/SocialLinks/SocialLinks_Action';
import { useAuth } from "../../context/Context";

const Social = () => {
    const { user } = useAuth();
    const [data, setData] = useState({
        official_website: '',
        follow_us_on_instagram: '',
        follow_us_in_facebook: '',
        highlight: '',
        mobile_number: '',
        email: '',
        follow_us_in_youtube: '',
        follow_us_in_whatsapp_channel: ''
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.GetSocialLinksReducer);
    const updateLoading = useSelector(state => state.UpdateSocialLinksReducer);
    const websiteRefFocus = useRef(null);
    const instagramRefFocus = useRef(null);
    const facebookRefFocus = useRef(null);
    const youtubeRefFocus = useRef(null);
    const whatsappChannelRefFocus = useRef(null);
    const highlightRefFocus = useRef(null);
    const mobileNumberRefFocus = useRef(null);
    const emailRefFocus = useRef(null);
    const hasFetched = useRef(null);
    
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        dispatch(action.getSocialLinks()).then((response) => {
            setData(prevData => ({ ...prevData, ...response.responseDetails }));
        });
    }, [dispatch]);
    
    const onChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    }
            
    const updateData = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }
        
        setErrors({});
        let customErrors = {};
        if (data.official_website === '') {
            customErrors = { ...customErrors, official_website: "Please Enter Official Website Link" }
            websiteRefFocus.current.focus();
        } else if (data.follow_us_on_instagram === '') {
            customErrors = { ...customErrors, follow_us_on_instagram: "Please Enter Instagram Link" }
            instagramRefFocus.current.focus();
        } else if (data.follow_us_in_facebook === '') {
            customErrors = { ...customErrors, follow_us_in_facebook: "Please Enter Facebook Link" }
            facebookRefFocus.current.focus();
        } else if (data.follow_us_in_youtube === '') {
            customErrors = { ...customErrors, follow_us_in_youtube: "Please Enter Youtube Link" }
            youtubeRefFocus.current.focus();
            facebookRefFocus.current.focus();
        } else if (data.follow_us_in_whatsapp_channel === '') {
            customErrors = { ...customErrors, follow_us_in_whatsapp_channel: "Please Enter Whatsapp Channel Link" }
            whatsappChannelRefFocus.current.focus();
        } else if (data.highlight === '') {
            customErrors = { ...customErrors, highlight: "Please Enter Highlights" }
            highlightRefFocus.current.focus();
        } else if (data.mobile_number === '') {
            customErrors = { ...customErrors, mobile_number: "Please Enter Mobile NUmber" }
            mobileNumberRefFocus.current.focus();
        } else if (data.email === '') {
            customErrors = { ...customErrors, email: "Please Enter Email" }
            emailRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        let params = {
            official_website: data.official_website,
            follow_us_on_instagram: data.follow_us_on_instagram,
            follow_us_in_facebook: data.follow_us_in_facebook,
            follow_us_in_youtube: data.follow_us_in_youtube,
            follow_us_in_whatsapp_channel: data.follow_us_in_whatsapp_channel,
            highlight: data.highlight,
            mobile_number: data.mobile_number,
            email: data.email,
        };
        dispatch(action.updateSocialLinks(params)).then((response) => {
            toast.success(response.responseMessage);
            let data = response.responseDetails;
            setData(data);
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            { loading ? <Loader /> : 
                <>
                    <div className="general-settings-section">
                        <h2 className="section-title">Social Links</h2>
                        <form className="settings-form" onSubmit={updateData}>
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="official_website">Official Website</label>
                                        <input type="text" id="official_website" ref={websiteRefFocus} value={data.official_website} onChange={onChange} name="official_website" placeholder="Enter Official Website Link" />
                                        <span className='text-danger pt-2'>{errors?.official_website}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="follow_us_on_instagram">Instagram</label>
                                        <input type="text" id="follow_us_on_instagram" ref={instagramRefFocus} value={data.follow_us_on_instagram} onChange={onChange} name="follow_us_on_instagram" placeholder="Enter Instagram Link" />
                                        <span className='text-danger pt-2'>{errors?.follow_us_on_instagram}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="follow_us_in_facebook">Facebook</label>
                                        <input type="text" id="follow_us_in_facebook" ref={facebookRefFocus} value={data.follow_us_in_facebook} onChange={onChange} name="follow_us_in_facebook" placeholder="Enter Facebook Link" />
                                        <span className='text-danger pt-2'>{errors?.follow_us_in_facebook}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="follow_us_in_youtube">Youtube</label>
                                        <input type="text" id="follow_us_in_youtube" ref={youtubeRefFocus} value={data.follow_us_in_youtube} onChange={onChange} name="follow_us_in_youtube" placeholder="Enter Youtube Link" />
                                        <span className='text-danger pt-2'>{errors?.follow_us_in_youtube}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="follow_us_in_whatsapp_channel">WhatsApp Channel</label>
                                        <input type="text" id="follow_us_in_whatsapp_channel" ref={whatsappChannelRefFocus} value={data.follow_us_in_whatsapp_channel} onChange={onChange} name="follow_us_in_whatsapp_channel" placeholder="Enter Whatsapp Channel Link" />
                                        <span className='text-danger pt-2'>{errors?.follow_us_in_whatsapp_channel}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="mobile_number">Mobile Number</label>
                                        <input type="text" id="mobile_number" ref={mobileNumberRefFocus} value={data.mobile_number} onChange={onChange} name="mobile_number" placeholder="Enter Mobile NUmber" />
                                        <span className='text-danger pt-2'>{errors?.mobile_number}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" ref={emailRefFocus} value={data.email} onChange={onChange} name="email" placeholder="Enter Email" />
                                        <span className='text-danger pt-2'>{errors?.email}</span>
                                    </div>
                                </div>
                                <div className="col-md-12 col-12">
                                    <div className="form-group">
                                        <label htmlFor="highlight">Highlights</label>
                                        <input type="text" id="highlight" ref={highlightRefFocus} value={data.highlight} onChange={onChange} name="highlight" placeholder="Enter Highlights" />
                                        <span className='text-danger pt-2'>{errors?.highlight}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="setting-btn">
                                <button type="submit" className="btn" disabled={updateLoading.loading}>
                                    {updateLoading.loading ? (
                                        <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div> 
                </>
            }
        </>
    );
};

export default Social;
