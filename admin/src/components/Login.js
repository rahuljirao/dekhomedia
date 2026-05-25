import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
// import * as action from '../Action/Login/Login_Action';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';
const Login = () => {
    const { userLogin, token } = useAuth();
    const [loginData, setLoginData] = useState({ email: 'admin@gmail.com', password: 'Admin@123' });
    const [errors, setErrors] = useState({});
    // const dispatch = useDispatch();
    const { loading } = useSelector(state => state.LoginReducer);
    const emailRefFocus = useRef(null);
    const passwordRefFocus = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('log-in-page');
        return () => {
            document.body.classList.remove('log-in-page');
        };
    }, []);

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const onchange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const Login = (e) => {
        e.preventDefault();
        setErrors({});
        let customErrors = {};
        if (loginData.email === '') {
            customErrors = { ...customErrors, email: "Please Enter Email" }
            emailRefFocus.current.focus();
        } else if (!/^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$)/.test(loginData.email)) {
            customErrors = { ...customErrors, email: "Please Enter Valid Email" }
            emailRefFocus.current.focus();
        } else if (loginData.password === '') {
            customErrors = { ...customErrors, password: "Please Enter Password" }
            passwordRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        var data = {
            'email': loginData.email,
            'password': loginData.password
        };
        userLogin(data);
        // dispatch(action.login(data)).then((response) => {
        //     toast.success(response.responseMessage);
        //     localStorage.setItem('token', response.responseDetails.token.accessToken);
        //     localStorage.setItem('admin_details', JSON.stringify(response.responseDetails));
        //     setTimeout(() => {
        //         setLoginData({ email: '', password: '' });
        //         window.location.href = '/';
        //     }, 1000);
        // }).catch(error => {
        //     toast.error(error.responseMessage);
        // })
    }

    return (
        <>
            <div className="container">
                <div className="image-section"></div>
                <div className="form-section">
                    <div className="form-container">
                        <h2>Welcome Back</h2>
                        <p>Please sign in to your account</p>
                        <form onSubmit={Login} autoComplete='off'>
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" ref={emailRefFocus} value={loginData.email} onChange={onchange} name="email" placeholder="Enter Your Email" />
                                <span className='text-danger pt-2'>{errors?.email}</span>
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" ref={passwordRefFocus} value={loginData.password} onChange={onchange} name="password" placeholder="* * * * * * *" />
                                <span className='text-danger pt-2'>{errors?.password}</span>
                            </div>
                            <div className="actions">
                                <button className="btn" type="submit" disabled={loading}>
                                    {loading ? (
                                        <div className="spinner-border text-light" style={{width: '16px', height: '16px'}} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                                <Link to={"/forget-password"} className="forgot-password">Forgot Password?</Link>
                            </div>
                        </form>
                        {/* <p className="signup-link">Don't have an account? <Link to={"#"}>Sign Up</Link></p> */}
                    </div>
                </div>
            </div>
            <div className="progress-wrap active-progress">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{transition: 'stroke-dashoffset 10ms linear', strokeDasharray: '307.919, 307.919', strokeDashoffset: '211.945'}}>
                    </path>
                </svg>
            </div>
            {/* <div className="hidden md:block box-border flex flex-wrap justify-center items-center w-full login-header-bg">
                <div className="flex items-center justify-center h-screen">
                    <div className="min-h-[700px] w-[900px] bg-white rounded-2xl flex shadow-custom">
                        <div className="w-1/2 left-0 p-4 flex flex-col justify-center items-center">
                            <h3 className="text-lg font-semibold mb-4">Admin</h3>
                            <div>
                                <img src={data.logo || 'logo.webp'} alt='' className='w-[300px]' />
                            </div>
                            <h2 className="text-2xl font-bold my-6">Sign in</h2>
                            <form onSubmit={Login} className="w-full max-w-xl">
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
                                </div>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </form>
                        </div>
                        <div className="w-1/2 rounded-r-2xl background-box right-0 p-6 flex flex-col justify-center items-center text-white">
                            <h3 className="text-xl font-bold mb-4">Forget Your Password ?</h3>
                            <div className='pt-5'>
                                <a href='/forget-password' className='joinnowsignin bg-transparent border-white'>Forget Password</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='block md:hidden flex justify-center items-center h-screen'>
                <div className="box-border flex flex-wrap w-full justify-center items-center">
                    <div className='wrapper'>
                        <a href='/forget-password' className='border border-black rounded-md text-black cursor-pointer text-3xl px-6 py-1 font-semibold text-center'>
                            Forget Password ?
                        </a>
                        <div className="absolute bottom-[-15%] left-1/2 w-[calc(100%+220px)] h-full bg-white rounded-[35%] shadow-[0_-5px_10px_rgba(0,0,0,0.1)] px-[125px] py-[20px] transform -translate-x-1/2 transition-all duration-600 ease">
                            <div className='px-14'>
                                <img src={data.logo || 'logo.webp'} alt='' />
                            </div>
                            <h3 className="text-3xl font-semibold my-4">Admin</h3>
                            <form onSubmit={Login} className="w-full max-w-xl">
                                <div className="mb-4">
                                    <input id="email" type="email" name="email" onChange={onchange} ref={emailRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Email" required />
                                </div>
                                <span style={{ color: 'red' }}>{errors?.email}</span>
                                <div className="mb-4 relative">
                                    <input id="password" type={passwordVisible ? 'text' : 'password'} name="password" onChange={onchange} ref={passwordRefFocus} className="mt-2 p-3 w-full border border-gray-300 rounded-md" placeholder="Password" required />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-5 text-gray-500" >
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <span style={{ color: 'red' }}>{errors?.password}</span>
                                <button type="submit" className="signupin-button">
                                    {loading ? (
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        "Login"
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
  
export default Login;
  