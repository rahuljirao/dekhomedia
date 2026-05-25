import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import * as action from '../../Action/AppDetails/AppDetails_Action';
import { useAuth } from "../../context/Context";

const Currency = () => {
    const { user } = useAuth();
    const [appData, setAppData] = useState({
        country: '',
        currency: '',
        currency_symbol: ''
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.GetAppDetailsReducer);
    const updateLoading = useSelector(state => state.UpdateAppCurrencyDetailsReducer);
    const hasFetched = useRef(null);
    const countryRefFocus = useRef(null);
    const currencyRefFocus = useRef(null);
    const currencySymbolRefFocus = useRef(null);
    
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        dispatch(action.getAppDetails()).then((response) => {
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setAppData((prev) => ({ ...prev, country: data?.country || '', currency: data?.currency || '', currency_symbol: data?.currency_symbol || '' }));
        });
    }, [dispatch]);
    
    const onChange = (e) => {
        const { name, value } = e.target;
        setAppData(prevData => ({ ...prevData, [name]: value }));
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
        if (appData.country === '') {
            customErrors = { ...customErrors, country: "Please Enter Country" }
            countryRefFocus.current.focus();
        } else if (appData.currency === '') {
            customErrors = { ...customErrors, currency: "Please Enter Currency" }
            currencyRefFocus.current.focus();
        } else if (appData.currency_symbol === '') {
            customErrors = { ...customErrors, currency_symbol: "Please Enter Currency Symbol" }
            currencySymbolRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        dispatch(action.updateAppCurrencyDetails(appData)).then((response) => {
            toast.success(response.responseMessage);
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setAppData({
                country: data?.country || '',
                currency: data?.currency || '',
                currency_symbol: data?.currency_symbol || ''
            });
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            { loading ? <Loader /> : 
                <>
                    <div className="general-settings-section">
                        <h2 className="section-title">Currency Settings</h2>
                        <form className="settings-form" onSubmit={updateProfile}>
                            <div className="subscription-wrapper">
                                <div className="tab-content-data">
                                    <div className="row">
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="country">Country</label>
                                                <input type="text" id="country" ref={countryRefFocus} value={appData?.country} onChange={onChange} name="country" placeholder="Enter country" />
                                                <span className='text-danger pt-2'>{errors?.country}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="currency">Currency</label>
                                                <input type="text" id="currency" ref={currencyRefFocus} value={appData?.currency} onChange={onChange} name="currency" placeholder="Enter currency" />
                                                <span className='text-danger pt-2'>{errors?.currency}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="currency_symbol">Currency Symbol</label>
                                                <input type="text" id="currency_symbol" ref={currencySymbolRefFocus} value={appData?.currency_symbol} onChange={onChange} name="currency_symbol" placeholder="Enter currency symbol" />
                                                <span className='text-danger pt-2'>{errors?.currency_symbol}</span>
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
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            }
        </>
    );
};

export default Currency;