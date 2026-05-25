import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as action from '../Action/Login/Login_Action';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [resetPasswordData, setResetPasswordData] = useState({ token: token, newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.ResetPasswordReducer);
    const newPasswordRefFocus = useRef(null);
    const confirmPasswordRefFocus = useRef(null);
        
    useEffect(() => {
        document.body.classList.add('log-in-page');
        return () => {
            document.body.classList.remove('log-in-page');
        };
    }, []);
    
    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    }, [token])
    
    const onchange = (e) => {
        setResetPasswordData({ ...resetPasswordData, [e.target.name]: e.target.value })
    }
    const ResetPassword = (e) => {
        e.preventDefault();
        setErrors({});
        let customErrors = {};
        let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,}$/;
        if (resetPasswordData.newPassword === '') {
            customErrors = { ...customErrors, newPassword: "Please Enter New Password" }
            newPasswordRefFocus.current.focus();
        } else if (!passwordRegex.test(resetPasswordData?.newPassword)) {
            customErrors = { ...customErrors, newPassword: "The password must be at least 8 characters long and include one uppercase letter, one digit, and one special character." }
            newPasswordRefFocus.current.focus();
        } else if (resetPasswordData.confirmPassword === '') {
            customErrors = { ...customErrors, confirmPassword: "Please Enter Confirm Password" }
            confirmPasswordRefFocus.current.focus();
        } else if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            customErrors = { ...customErrors, confirmPassword: "New password and confirm password are not match"}
            confirmPasswordRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            'token': resetPasswordData.token,
            'newPassword': resetPasswordData.newPassword,
            'confirmPassword': resetPasswordData.confirmPassword
        };
        dispatch(action.resetPassword(data)).then((response) => {
            toast.success(response.responseMessage);
            setTimeout(() => {
                setResetPasswordData({ token:'', newPassword: '', confirmPassword: '' });
                window.location.href = '/login';
            }, 1000);
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            <div className="container">
                <div className="image-section"></div>

                <div className="form-section">
                <div className="form-container">
                    <h2>Reset Password</h2>
                    <p>Enter your new password below.</p>

                    <form onSubmit={ResetPassword}>

                        <div className="input-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" ref={newPasswordRefFocus} value={resetPasswordData.newPassword} onChange={onchange} placeholder="Enter New Password" />
                            <span className='text-danger pt-2'>{errors?.newPassword}</span>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" ref={confirmPasswordRefFocus} value={resetPasswordData.confirmPassword} onChange={onchange} placeholder="Confirm New Password" />
                            <span className='text-danger pt-2'>{errors?.confirmPassword}</span>
                        </div>

                        <div className="actions">
                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                            <Link to={'/login'} className="forgot-password">Back to Sign In</Link>
                        </div>
                    </form>

                    {/* <p className="signup-link">Don't have an account? <a href="signup.html">Sign Up</a></p> */}
                </div>
                </div>
            </div>
        </>
    );
};
  
export default ResetPassword;