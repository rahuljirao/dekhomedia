import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import * as action from '../../Action/SiteDetails/SiteDetails_Action';
import { useAuth } from "../../context/Context";
import NiceSelect from "../CustomSelect";

const General = () => {
    const { user } = useAuth();
    const [siteData, setSiteData] = useState({
        title: '',
        logo: '',
        favicon: '',
        firebase_json:'',
        copyright_text:'',
        is_admin_maintenance: 0,
        is_website_maintenance: 0,
        is_inspect: 0
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading, payload } = useSelector(state => state.GetSiteDetailsReducer);
    const updateLoading = useSelector(state => state.UpdateSiteDetailsReducer);
    const titleRefFocus = useRef(null);
    const copyrightTextRefFocus = useRef(null);
    const hasFetched = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        dispatch(action.getSiteDetails()).then((response) => {
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setSiteData(prevData => ({ ...prevData, ...data }));
            if(data.favicon){
                setFaviconPreview(data.favicon);
            }
            if(data.logo){
                setLogoPreview(data.logo);
            }
        });
    }, [dispatch]);
    
    const onChange = (e) => {
        const { name, value } = e.target;
        setSiteData(prevData => ({ ...prevData, [name]: value }));
    }

	const handleImageChange = (e) => {
		const file = e.target.files[0];
        const name = e.target.name;
	
		if (file) {
			const previewURL = URL.createObjectURL(file);
            if(name === 'logo'){
                setLogoPreview(previewURL);
            } else {
                setFaviconPreview(previewURL);
            }
	
            setSiteData((prev) => ({
				...prev,
				[name]: file,
			}));
		} else {
            let file = '';
            if(name === 'logo'){
                file = payload.responseDetails.logo;
                setLogoPreview(file);
            } else {
                file = payload.responseDetails.favicon;
                setFaviconPreview(file);
            }
	
            setSiteData((prev) => ({
				...prev,
				[name]: file,
			}));
        }
	};
        
    const updateProfile = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }
        
        setErrors({});
        let customErrors = {};
        if (siteData.title === '') {
            customErrors = { ...customErrors, title: "Please Enter Site Title" }
            titleRefFocus.current.focus();
        }
        if (siteData.copyright_text === '') {
            customErrors = { ...customErrors, copyright_text: "Please Enter Copyright Text" }
            copyrightTextRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }
        let data = new FormData();
        data.append('title', siteData.title);
        data.append('firebase_json', siteData.firebase_json);
        data.append('copyright_text', siteData.copyright_text);
        data.append('is_admin_maintenance', siteData.is_admin_maintenance);
        data.append('is_website_maintenance', siteData.is_website_maintenance);
        data.append('is_inspect', siteData.is_inspect);
        if(siteData.logo){
            data.append('logo', siteData.logo);
        }
        if(siteData.favicon){
            data.append('favicon', siteData.favicon);
        }
        dispatch(action.updateSiteDetails(data)).then((response) => {
            toast.success(response.responseMessage);
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setSiteData(data);
            if(data.favicon){
                setFaviconPreview(data.favicon);
            }
            if(data.logo){
                setLogoPreview(data.logo);
            }
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    const handleAutoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
        onChange(e);
    };

    const niceSelectOnChange = (name, value) => {
        setSiteData({ ...siteData, [name]: value })
    }

    return (
        <>
            { loading ? <Loader /> : 
                <>
                    <div className="general-settings-section">
                        <h2 className="section-title">General Settings</h2>
                        <form className="settings-form" onSubmit={updateProfile}>
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="site-title">Site Title / Admin Panel Name</label>
                                        <input type="text" id="site-title" ref={titleRefFocus} value={siteData?.title} onChange={onChange} name="title" placeholder="Enter site title" />
                                        <span className='text-danger pt-2'>{errors?.title}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="copyright_text">Copyright Text</label>
                                        <input type="text" id="copyright_text" ref={copyrightTextRefFocus} value={siteData?.copyright_text} onChange={onChange} name="copyright_text" placeholder="Enter copyright text" />
                                        <span className='text-danger pt-2'>{errors?.copyright_text}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="site-logo">Site Logo</label>
                                        <input type="file" id="site-logo" name="logo" accept="image/*" onChange={handleImageChange} />
                                        { logoPreview ? <img src={logoPreview} alt="logo" style={{width: '50px', height: '50px', marginTop: '10px'}} /> : '' }
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="favicon">Favicon</label>
                                        <input type="file" id="favicon" name="favicon" accept="image/x-icon,image/png" onChange={handleImageChange} />
                                        { faviconPreview ? <img src={faviconPreview} alt="favicon" style={{width: '50px', height: '50px', marginTop: '10px'}} /> : '' }
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="is_admin_maintenance">Admin Panel Maintenance</label>
                                        <NiceSelect id="is_admin_maintenance" name="is_admin_maintenance" className="form-control" value={siteData.is_admin_maintenance} onChange={niceSelectOnChange}>
                                            <option value={0}>No</option>
                                            <option value={1}>Yes</option>
                                        </NiceSelect>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="is_website_maintenance">Website Maintenance</label>
                                        <NiceSelect id="is_website_maintenance" name="is_website_maintenance" className="form-control" value={siteData.is_website_maintenance} onChange={niceSelectOnChange}>
                                            <option value={0}>No</option>
                                            <option value={1}>Yes</option>
                                        </NiceSelect>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="is_inspect">Inspection Required</label>
                                        <NiceSelect id="is_inspect" name="is_inspect" className="form-control" value={siteData.is_inspect} onChange={niceSelectOnChange}>
                                            <option value={0}>No</option>
                                            <option value={1}>Yes</option>
                                        </NiceSelect>
                                    </div>
                                </div>
                                <div className="col-md-12 col-12">
                                    <div className="form-group">
                                        <label htmlFor="favicon">Firebase JSON</label>
                                        <textarea id="firebase_json" name="firebase_json" className="form-control firebase-json" rows="5" placeholder="Enter firebase JSON" onInput={handleAutoResize} value={siteData.firebase_json || ""} />
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
                                        "Save Settings"
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

export default General;
