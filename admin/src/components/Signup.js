import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import * as action from '../Action/SignUp/SignUp_Action';

const Signup = ({ data }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [signupData, setSignupData] = useState({ brand_name:'', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.SignupReducer);
    const brandNameRefFocus = useRef(null);
    const emailRefFocus = useRef(null);
    const passwordRefFocus = useRef(null);

    useEffect(() => {
        // if (localStorage.getItem('token')) {
        //     window.location.href = '/admin/';
        // }
    }, [])

    const onchange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value })
    }

    const SignUp = (e) => {
        e.preventDefault();
        setErrors({});
        let customErrors = {};
        if (signupData.brand_name === '') {
            customErrors = { ...customErrors, brand_name: "Please Enter Brand Name" }
            brandNameRefFocus.current.focus();
        } else if (signupData.email === '') {
            customErrors = { ...customErrors, email: "Please Enter Email" }
            emailRefFocus.current.focus();
        } else if (!/^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/.test(signupData.email)) {
            customErrors = { ...customErrors, email: "Please Enter Valid Email" }
            emailRefFocus.current.focus();
        } else if (signupData.password === '') {
            customErrors = { ...customErrors, password: "Please Enter Password" }
            passwordRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            'brand_name': signupData.brand_name,
            'email': signupData.email,
            'password': signupData.password
        };
        dispatch(action.signUp(data)).then((response) => {
            toast.success(response.responseMessage);
            setTimeout(() => {
                setSignupData({ brand_name:'', email: '', password: '' });
                window.location.href = '/welcome/login';
            }, 1000);
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            <div>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            </div>
            <div className="hidden md:block box-border flex flex-wrap justify-center items-center w-full login-header-bg">
                <div className="flex items-center justify-center h-screen">
                    <div className="min-h-[700px] w-[900px] bg-white rounded-2xl flex shadow-custom">
                        <div className="w-1/2 rounded-l-2xl background-box left-0 p-6 flex flex-col justify-center items-center text-white">
                            <h3 className="text-xl font-bold mb-4">Already a DiskWala Family Member ?</h3>
                            <p className="px-5 text-center text-md">
                                If you are already a memeber of DiskWala Family then please click on "Login" button to enter you details and LogIn.
                            </p>
                            <div className='pt-5'>
                                <a href='/welcome/login' className='joinnowsignin bg-transparent border-white'>Login</a>
                            </div>
                        </div>
                        <div className="w-1/2 right-0 p-4 flex flex-col justify-center items-center">
                            <h3 className="text-lg font-semibold mb-4">Welcome @</h3>
                            <div>
                                <img src={data.logo || 'logo.webp'} alt='' className='w-[300px]' />
                            </div>
                            <h2 className="text-2xl font-bold my-6">Create Account</h2>
                            <form onSubmit={SignUp} className="w-full max-w-xl">
                                <div className="mb-4">
                                    <input id="brand_name" name="brand_name" onChange={onchange} ref={brandNameRefFocus} type="text" className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Full Name" required />
                                    <span className='pl-3 text-red-500'>{errors?.brand_name}</span>
                                </div>
                                <div className="mb-4">
                                    <input id="email" type="email" name="email" onChange={onchange} ref={emailRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Email" required />
                                    <span className='pl-3 text-red-500'>{errors?.email}</span>
                                </div>
                                <div className="mb-4 relative">
                                    <input id="password" type={passwordVisible ? 'text' : 'password'} name="password" onChange={onchange} ref={passwordRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Password" required />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-5 text-gray-500" >
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </button>
                                    <span className='pl-3 text-red-500'>{errors?.password}</span>
                                </div>
                                <div className="mb-4 relative text-right">
                                    <a href='/welcome/send-confirm-email' className='text-gray-500'>Confirm Email?</a>
                                </div>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Join DiskWala Family"
                                    )}</button>
                                <p className="m-0 leading-6 text-[0.75rem] text-[#919eab] text-center">
                                    By Joining, I agree to &nbsp;
                                    <a href='/' target='_blank'><b>Terms of Service</b></a>&nbsp;
                                     And &nbsp;
                                    <a href='/' target='_blank'><b>Privacy Policy.</b></a>
                                </p>
                            </form>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className='block md:hidden flex justify-center items-center h-screen'>
                <div className="box-border flex flex-wrap w-full justify-center items-center">
                    <div className='wrapper'>
                        <a href='/welcome/login' className='border border-black rounded-md text-black cursor-pointer text-3xl px-6 py-1 font-semibold text-center'>
                            Login Here
                        </a>
                        <div className="absolute bottom-[-15%] left-1/2 w-[calc(100%+220px)] h-full bg-white rounded-[35%] shadow-[0_-5px_10px_rgba(0,0,0,0.1)] px-[125px] py-[20px] transform -translate-x-1/2 transition-all duration-600 ease">
                            <div className='px-14'>
                                <img src={data.logo || 'logo.webp'} alt='' />
                            </div>
                            <h3 className="text-3xl font-semibold my-4">New SignUp</h3>
                            <form onSubmit={SignUp} className="w-full max-w-xl">
                                <div className="mb-4">
                                    <input id="brand_name" name="brand_name" onChange={onchange} ref={brandNameRefFocus} type="text" className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Full Name" required />
                                    <span className='pl-3 text-red-500'>{errors?.brand_name}</span>
                                </div>
                                <div className="mb-4">
                                    <input id="email" type="email" name="email" onChange={onchange} ref={emailRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Email" required />
                                    <span className='pl-3 text-red-500'>{errors?.email}</span>
                                </div>
                                <div className="mb-4 relative">
                                    <input id="password" type={passwordVisible ? 'text' : 'password'} name="password" onChange={onchange} ref={passwordRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Password" required />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-5 text-gray-500" >
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </button>
                                    <span className='pl-3 text-red-500'>{errors?.password}</span>
                                </div>
                                <div className="mb-4 relative text-right">
                                    <a href='/welcome/send-confirm-email' className='text-gray-500'>Confirm Email?</a>
                                </div>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Join"
                                    )}
                                </button>
                                <p className="m-0 leading-6 text-[0.75rem] text-[#919eab] text-center">
                                    By Joining, I agree to &nbsp;
                                    <a href='/' target='_blank'><b>Terms of Service</b></a>&nbsp;
                                     And &nbsp;
                                    <a href='/' target='_blank'><b>Privacy Policy.</b></a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
  
export default Signup;
  