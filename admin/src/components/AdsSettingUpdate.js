import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import * as action from '../Action/AdsSetting/AdsSetting_Action';
import Loader from "./Loader";
import Select2Create from './CustomSelect/Select2Create';
import NumberInput from "./Input/Number";
import { useAuth } from "../context/Context";

const AdsSettingUpdate = () => {
    const { user } = useAuth();
    const [adsData, setAdsData] = useState({
        ad_platform_name: '',
        ad_publisher_id: '',
        ad_banner_status: '',
        ad_banner_id: '',
        ad_banner_id_ios: '',
        ad_banner_remarks: '',
        ad_interstitial_status: '',
        ad_interstitial_id: '',
        ad_interstitial_id_ios: '',
        ad_interstitial_clicks: '',
        ad_interstitial_remarks: '',
        ad_native_status: '',
        ad_native_id: '',
        ad_native_id_ios: '',
        ad_native_remarks: '',
        ad_reward_status: '',
        ad_reward_id: '',
        ad_reward_id_ios: '',
        ad_reward_remarks: '',
        status: ''
    });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const dispatch = useDispatch();
    const hasFetched = useRef(null);
    const adPlatformNameRefFocus = useRef(null);
    const { loading } = useSelector(state => state.GetAdsPlatformDetailsReducer);
    const UpdateAdsSettingLoading = useSelector(state => state.UpdateAdsPlatformDetailsReducer);
    const [bannerIds, setBannerIds] = useState([]);
    const [interstitialIds, setInterstitialIds] = useState([]);
    const [nativeIds, setNativeIds] = useState([]);
    const [rewardIds, setRewardIds] = useState([]);
    const [bannerIdsIOS, setBannerIdsIOS] = useState([]);
    const [interstitialIdsIOS, setInterstitialIdsIOS] = useState([]);
    const [nativeIdsIOS, setNativeIdsIOS] = useState([]);
    const [rewardIdsIOS, setRewardIdsIOS] = useState([]);
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const getData = (id) => {
            dispatch(action.getAdsPlatformDetails({ id: id })).then((response) => {
                let data = response.responseDetails;
                data.ad_banner_id = data.ad_banner_id && data.ad_banner_id !== '' ? data.ad_banner_id.split('|') : [];
                data.ad_interstitial_id = data.ad_interstitial_id && data.ad_interstitial_id !== '' ? data.ad_interstitial_id.split('|') : [];
                data.ad_native_id = data.ad_native_id && data.ad_native_id !== '' ? data.ad_native_id.split('|') : [];
                data.ad_reward_id = data.ad_reward_id && data.ad_reward_id !== '' ? data.ad_reward_id.split('|') : [];
                setBannerIds(data.ad_banner_id);
                setInterstitialIds(data.ad_interstitial_id);
                setNativeIds(data.ad_native_id);
                setRewardIds(data.ad_reward_id);
                data.ad_banner_id_ios = data.ad_banner_id_ios && data.ad_banner_id_ios !== '' ? data.ad_banner_id_ios.split('|') : [];
                data.ad_interstitial_id_ios = data.ad_interstitial_id_ios && data.ad_interstitial_id_ios !== '' ? data.ad_interstitial_id_ios.split('|') : [];
                data.ad_native_id_ios = data.ad_native_id_ios && data.ad_native_id_ios !== '' ? data.ad_native_id_ios.split('|') : [];
                data.ad_reward_id_ios = data.ad_reward_id_ios && data.ad_reward_id_ios !== '' ? data.ad_reward_id_ios.split('|') : [];
                setBannerIdsIOS(data.ad_banner_id_ios);
                setInterstitialIdsIOS(data.ad_interstitial_id_ios);
                setNativeIdsIOS(data.ad_native_id_ios);
                setRewardIdsIOS(data.ad_reward_id_ios);
                delete data.created_at;
                delete data.updated_at;
                setAdsData(data);
            });
        }
        getData(id);
    }, [dispatch, id]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setAdsData(prevData => ({ ...prevData, [name]: value }));
    }
    const handleToggle = (key, status) => {
        setAdsData(prevData => ({ ...prevData, [key]: status === 1 ? "0" : 1 }));
    }
    const updateAdsSettingData = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }

        setErrors({});
        let customErrors = {};
        if (adsData.ad_platform_name === '') {
            customErrors = { ...customErrors, ad_platform_name: "Please Enter Ads Platform Name" }
            adPlatformNameRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }
        let requestData = adsData;
        requestData.ad_banner_id = bannerIds.length > 0 ? bannerIds.join('|') : null;
        requestData.ad_interstitial_id = interstitialIds.length > 0 ? interstitialIds.join('|') : null;
        requestData.ad_native_id = nativeIds.length > 0 ? nativeIds.join('|') : null;
        requestData.ad_reward_id = rewardIds.length > 0 ? rewardIds.join('|') : null;
        requestData.ad_banner_id_ios = bannerIdsIOS.length > 0 ? bannerIdsIOS.join('|') : null;
        requestData.ad_interstitial_id_ios = interstitialIdsIOS.length > 0 ? interstitialIdsIOS.join('|') : null;
        requestData.ad_native_id_ios = nativeIdsIOS.length > 0 ? nativeIdsIOS.join('|') : null;
        requestData.ad_reward_id_ios = rewardIdsIOS.length > 0 ? rewardIdsIOS.join('|') : null;
        dispatch(action.updateAdsPlatformDetails(requestData)).then((response) => {
            toast.success(response.responseMessage);
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <section className="dashboard-section section">
                        <div className="dashboard-cards">
                            <div className="dashboard-blog">
                                <div className="general-settings-section">
                                    <form className="settings-form" onSubmit={updateAdsSettingData}>
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_platform_name">Ads Platform Name</label>
                                                    <input type="text" id="ad_platform_name" name="ad_platform_name" ref={adPlatformNameRefFocus} value={adsData?.ad_platform_name} onChange={onChange} />
                                                    <span className='text-danger pt-2'>{errors?.ad_platform_name}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_publisher_id">Ads Publisher Id</label>
                                                    <input type="text" id="ad_publisher_id" name="ad_publisher_id" value={adsData?.ad_publisher_id} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-12">
                                                <div className="form-group d-flex align-items-center">
                                                    <label htmlFor="ad_banner_status">Ads Banner Status</label>
                                                    <div className="padding-checkbox checkbox-slider d-flex align-items-center">
                                                        <label>
                                                            <input type="checkbox" className="d-none hideContent ad_banner_status" checked={parseInt(adsData.ad_banner_status) === 1} onChange={() => handleToggle('ad_banner_status', adsData.ad_banner_status)} />
                                                            <span className="toggle_background">
                                                                <div className="circle-icon"></div>
                                                                <div className="vertical_line"></div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_banner_id">Ads Banner Id</label>
                                                    <Select2Create value={bannerIds} onChange={setBannerIds} placeholder="Banner IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_banner_id">Ads Banner Id (IOS)</label>
                                                    <Select2Create value={bannerIdsIOS} onChange={setBannerIdsIOS} placeholder="Banner IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_banner_remarks">Ads Banner Remarks</label>
                                                    <input type="text" id="ad_banner_remarks" name="ad_banner_remarks" value={adsData?.ad_banner_remarks} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-12">
                                                <div className="form-group d-flex align-items-center">
                                                    <label htmlFor="ad_interstitial_status">Ads Interstitial Status</label>
                                                    <div className="padding-checkbox checkbox-slider d-flex align-items-center">
                                                        <label>
                                                            <input type="checkbox" className="d-none hideContent ad_banner_status" checked={parseInt(adsData.ad_interstitial_status) === 1} onChange={() => handleToggle('ad_interstitial_status', adsData.ad_interstitial_status)} />
                                                            <span className="toggle_background">
                                                                <div className="circle-icon"></div>
                                                                <div className="vertical_line"></div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_interstitial_id">Ads Interstitial Id</label>
                                                    <Select2Create value={interstitialIds} onChange={setInterstitialIds} placeholder="Interstitial IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_interstitial_id">Ads Interstitial Id (IOS)</label>
                                                    <Select2Create value={interstitialIdsIOS} onChange={setInterstitialIdsIOS} placeholder="Interstitial IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_interstitial_remarks">Ads Interstitial Remarks</label>
                                                    <input type="text" id="ad_interstitial_remarks" name="ad_interstitial_remarks" value={adsData?.ad_interstitial_remarks} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_interstitial_clicks">Ads Interstitial Clicks</label>
                                                    <NumberInput id="ad_interstitial_clicks" name="ad_interstitial_clicks" value={adsData?.ad_interstitial_clicks} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-12">
                                                <div className="form-group d-flex align-items-center">
                                                    <label htmlFor="ad_native_status">Ads Native Status</label>
                                                    <div className="padding-checkbox checkbox-slider d-flex align-items-center">
                                                        <label>
                                                            <input type="checkbox" className="d-none hideContent ad_banner_status" checked={parseInt(adsData.ad_native_status) === 1} onChange={() => handleToggle('ad_native_status', adsData.ad_native_status)} />
                                                            <span className="toggle_background">
                                                                <div className="circle-icon"></div>
                                                                <div className="vertical_line"></div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_native_id">Ads Native Id</label>
                                                    <Select2Create value={nativeIds} onChange={setNativeIds} placeholder="Native IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_native_id">Ads Native Id (IOS)</label>
                                                    <Select2Create value={nativeIdsIOS} onChange={setNativeIdsIOS} placeholder="Native IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_native_remarks">Ads Native Remarks</label>
                                                    <input type="text" id="ad_native_remarks" name="ad_native_remarks" value={adsData?.ad_native_remarks} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-12">
                                                <div className="form-group d-flex align-items-center">
                                                    <label htmlFor="ad_reward_status">Ads Reward Status</label>
                                                    <div className="padding-checkbox checkbox-slider d-flex align-items-center">
                                                        <label>
                                                            <input type="checkbox" className="d-none hideContent ad_banner_status" checked={parseInt(adsData.ad_reward_status) === 1} onChange={() => handleToggle('ad_reward_status', adsData.ad_reward_status)} />
                                                            <span className="toggle_background">
                                                                <div className="circle-icon"></div>
                                                                <div className="vertical_line"></div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_reward_id">Ads Reward Id</label>
                                                    <Select2Create value={rewardIds} onChange={setRewardIds} placeholder="Reward IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_reward_id">Ads Reward Id (IOS)</label>
                                                    <Select2Create value={rewardIdsIOS} onChange={setRewardIdsIOS} placeholder="Reward IDs" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="ad_reward_remarks">Ads Reward Remarks</label>
                                                    <input type="text" id="ad_reward_remarks" name="ad_reward_remarks" value={adsData?.ad_reward_remarks} onChange={onChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-12">
                                                <div className="form-group d-flex align-items-center">
                                                    <label htmlFor="status">Status</label>
                                                    <div className="padding-checkbox checkbox-slider d-flex align-items-center">
                                                        <label>
                                                            <input type="checkbox" className="d-none hideContent ad_banner_status" checked={parseInt(adsData.status) === 1} onChange={() => handleToggle('status', adsData.status)} />
                                                            <span className="toggle_background">
                                                                <div className="circle-icon"></div>
                                                                <div className="vertical_line"></div>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="setting-btn">
                                                <button type="submit" className="btn" disabled={UpdateAdsSettingLoading.loading}>
                                                    {UpdateAdsSettingLoading.loading ? (
                                                        <div className="spinner-border text-light" style={{ width: '16px', height: '16px' }} role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        "Save Settings"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            }
        </>
    );
};

export default AdsSettingUpdate;
