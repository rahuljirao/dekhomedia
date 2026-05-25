import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import * as action from '../../Action/PrivacyPolicy/PrivacyPolicy_Action';
import CKEditor4 from "../CKEditor/Index";
import { useAuth } from "../../context/Context";

const PrivacyPolicy = () => {
    const { user } = useAuth();
    const [data, setData] = useState('');
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.GetPrivacyPolicyReducer);
    const updateLoading = useSelector(state => state.UpdatePrivacyPolicyReducer);
    const hasFetched = useRef(null);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        dispatch(action.getPrivacyPolicy()).then((response) => {
            setData(response.responseDetails?.privacy_and_policy || '');
        });
    }, [dispatch]);

    const updateAbout = (e) => {
        e.preventDefault();
        const isAccessAllowed = user?.login_type !== 'Guest';

        if (!isAccessAllowed) {
            toast.error("Opps! You don't have Permission.");
            return false;
        }

        let payload = {
            privacy_policy: data
        }
        dispatch(action.updatePrivacyPolicy(payload)).then((response) => {
            toast.success(response.responseMessage);
            setData(response.responseDetails?.privacy_and_policy || '');
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }

    const handleChange = (event) => {
        setData(event.editor.getData());
    };

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <section id="settings-section" className="setting-section section">
                        <div className="general-settings-section">
                            <h2 className="section-title">Privacy Policy</h2>
                            <form className="settings-form" onSubmit={updateAbout}>
                                <div className="row">
                                    <CKEditor4 data={data} handleChange={handleChange} />
                                </div>
                                <div className="setting-btn mt-3">
                                    <button type="submit" className="btn" disabled={updateLoading.loading}>
                                        {updateLoading.loading ? (
                                            <div className="spinner-border text-light" style={{ width: '16px', height: '16px' }} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            "Save"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            }
        </>
    );
};

export default PrivacyPolicy;
