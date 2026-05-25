import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import * as action from '../Action/Login/Login_Action';

const ForgetPassword = () => {
    const [forgetPasswordData, setForgetPasswordData] = useState({ email: '' });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.ForgetPasswordReducer);
    const emailRefFocus = useRef(null);

    useEffect(() => {
        document.body.classList.add('log-in-page');
        return () => {
            document.body.classList.remove('log-in-page');
        };
    }, []);

    const onchange = (e) => {
        setForgetPasswordData({ ...forgetPasswordData, [e.target.name]: e.target.value })
    }
    const ForgetPassword = (e) => {
        e.preventDefault();
        setErrors({});
        let customErrors = {};
        if (forgetPasswordData.email === '') {
            customErrors = { ...customErrors, email: "Please Enter Email" }
            emailRefFocus.current.focus();
        } else if (!/^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/.test(forgetPasswordData.email)) {
            customErrors = { ...customErrors, email: "Please Enter Valid Email" }
            emailRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            'email': forgetPasswordData.email
        };
        dispatch(action.forgetPassword(data)).then((response) => {
            toast.success(response.responseMessage);
            setTimeout(() => {
                setForgetPasswordData({ email: '' });
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
                        <h2>Forgot Password?</h2>
                        <p>Enter your email address to receive a reset link.</p>

                        <form onSubmit={ForgetPassword} autoComplete='off'>

                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" ref={emailRefFocus} value={forgetPasswordData.email} onChange={onchange} placeholder="Enter Your Email" />
                                <span className='text-danger pt-2'>{errors?.email}</span>
                            </div>

                            <div className="actions">
                                <button className="btn" type="submit" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner-border text-light" style={{ width: '16px', height: '16px' }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                                <Link to={'/login'} className="forgot-password">Back to Sign In</Link>
                            </div>
                        </form>

                        {/* <p className="signup-link">Don't have an account? <Link to={'/signup'}>Sign Up</Link></p> */}
                    </div>
                </div>
            </div>
            {/* <div className="hidden md:block box-border flex flex-wrap justify-center items-center w-full login-header-bg">
                <div className="flex items-center justify-center h-screen">
                    <div className="min-h-[700px] w-[900px] bg-white rounded-2xl flex shadow-custom">
                        <div className="w-1/2 rounded-l-2xl background-box left-0 p-6 flex flex-col justify-center items-center text-white">
                            <h3 className="text-xl font-bold mb-4">Already a DiskWala Family Member ?</h3>
                            <p className="px-5 text-center text-md">
                                If you are already a memeber of DiskWala Family then please click on "Login" button to enter you details and LogIn.
                            </p>
                            <div className='pt-5'>
                                <a href='/' className='joinnowsignin bg-transparent border-white'>Login</a>
                            </div>
                        </div>
                        <div className="w-1/2 right-0 p-4 flex flex-col justify-center items-center">
                            <h3 className="text-lg font-semibold mb-4">Admin</h3>
                            <div>
                                <img src={data.logo || 'logo.webp'} alt='' className='w-[300px]' />
                            </div>
                            <h2 className="text-2xl font-bold my-6">Forget Password?</h2>
                            <form onSubmit={ForgetPassword} className="w-full max-w-xl">
                                <div className="mb-4">
                                    <input id="email" type="email" name="email" onChange={onchange} ref={emailRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Email" required />
                                    <span className='pl-3 text-red-500'>{errors?.email}</span>
                                </div>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Send Email"
                                    )}
                                </button>
                            </form>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className='block md:hidden flex justify-center items-center h-screen'>
                <div className="box-border flex flex-wrap w-full justify-center items-center">
                    <div className='wrapper'>
                        <a href='/' className='border border-black rounded-md text-black cursor-pointer text-3xl px-6 py-1 font-semibold text-center'>
                            Login Here
                        </a>
                        <div className="absolute bottom-[-15%] left-1/2 w-[calc(100%+220px)] h-full bg-white rounded-[35%] shadow-[0_-5px_10px_rgba(0,0,0,0.1)] px-[125px] py-[20px] transform -translate-x-1/2 transition-all duration-600 ease">
                            <div className='px-14'>
                                <img src={data.logo || 'logo.webp'} alt='' />
                            </div>
                            <h3 className="text-3xl font-semibold my-4">Forget Password?</h3>
                            <form onSubmit={ForgetPassword} className="w-full max-w-xl">
                                <div className="mb-4">
                                    <input id="email" type="email" name="email" onChange={onchange} ref={emailRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Email" required />
                                    <span className='pl-3 text-red-500'>{errors?.email}</span>
                                </div>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Send Email"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default ForgetPassword;