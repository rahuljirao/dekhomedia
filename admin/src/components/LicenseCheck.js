import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verifyLicense } from '../Action/License/License_Action';
import Loader from '../components/Loader';
 
const LicenseCheck = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.VerifyLicenseReducer);
    const getLoading = useSelector(state => state.GetLicenseReducer);
    const [data, setData] = useState({
        code: "",
        username: ""
    });
    const [errors, setErrors] = useState({});
    const usernameRefFocus = useRef(null);
    const codeRefFocus = useRef(null);

    useEffect(() => {
        document.body.classList.add('log-in-page');

        return () => {
            document.body.classList.remove('log-in-page');
        };
    }, []);
 
    const checkLicense = async (e) => {
        e.preventDefault();
        setErrors({});
        let customErrors = {};
        if (data.username === '') {
            customErrors = { ...customErrors, username: "Please Enter Username" }
            usernameRefFocus.current.focus();
        } else if (data.code === '') {
            customErrors = { ...customErrors, code: "Please Enter Code" }
            codeRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        try {
            let payload = {
                username: data.username,
                code: data.code,
                id: '23045302',
                ip: '',
                referer: window.location.origin,
                path: window.location.pathname,
                type: 'admin'
            }
            dispatch(verifyLicense(payload)).then((response) => {
                window.location.href = '/';
            }).catch(error => {
                toast.error(error?.responseMessage);
            })
        } catch (error) {
            toast.error(error?.responseMessage);
        }
    };

    if(getLoading.loading){
        return <Loader />;
    }
 
    return (
        <div className="container"> 
            <div className="image-section"></div>
            <div className="form-section">
                <div className="form-container text-start">
                    <h6 className='text-center'>Verify License</h6>
                    <form className='mt-4' onSubmit={checkLicense}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={data.username}
                                ref={usernameRefFocus}
                                onChange={e => setData(prev => ({...prev, username: e.target.value}))}
                            />
                            <span className='text-danger pt-2'>{errors?.username}</span>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Purchase Code"
                                value={data.code}
                                ref={codeRefFocus}
                                onChange={e => setData(prev => ({...prev, code: e.target.value}))}
                            />
                            <span className='text-danger pt-2'>{errors?.code}</span>
                        </div>
                        <button
                            type='submit'
                            className="btn submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </form>
                </div>
            </div>   
        </div>
    );
};
 
export default LicenseCheck;