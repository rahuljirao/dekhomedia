
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import * as action from '../Action/VerifyToken/VerifyToken_Action';
import { login } from '../Action/Login/Login_Action';
import * as site_action from '../Action/SiteDetails/SiteDetails_Action';
import { getLicense } from '../Action/License/License_Action';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const admin_details = localStorage.getItem('admin_details');
        return admin_details ? JSON.parse(admin_details) : {};
    });
    const [checkLicense, setCheckLicense] = useState(null);
    const [siteData, setSiteData] = useState({});

    useEffect(() => {
        const verifyLicense = async () => {
            try {
                dispatch(getLicense({ type: 'admin', referer: window.location.origin })).then((response) => {
                    setCheckLicense(true);
                    localStorage.setItem('checkLicense', true);
                    if(location.pathname === '/license'){
                        window.location.href = '/';
                    }
                }).catch(err => {
                    setCheckLicense(false);
                    localStorage.removeItem('checkLicense');
                    if(location.pathname !== '/license'){
                        window.location.href = '/license';
                    }
                });
            } catch (error) {
                setCheckLicense(false);
                localStorage.removeItem('checkLicense');
                if(location.pathname !== '/license'){
                    window.location.href = '/license';
                }
            }
        };

        if(!checkLicense){
            verifyLicense();
        }
    }, [dispatch, checkLicense, location]);
    
    const userLogin = useCallback((data) => {
        dispatch(login(data)).then((response) => {
            let data = response.responseDetails;
            localStorage.setItem('token', data.token.accessToken);
            localStorage.setItem('admin_details', JSON.stringify(data));
            setToken(data.token.accessToken);
            setUser(data);
            window.location.href = '/';
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }, [dispatch]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin_details');
        setToken(null);
        setUser({});
        if(location.pathname !== '/license'){
            navigate('/login');
        }
    }, [navigate, location]);

    const fetchUser = useCallback(async () => {
        if (!token) return;
        try {
            dispatch(action.verifyToken({'token': token})).then((response) => {
                let data = response.responseDetails;
                localStorage.setItem('admin_details', JSON.stringify(data));
                setUser(data);
            }).catch(error => {
                toast.error(error.message);
                logout();
            })
            dispatch(site_action.getSiteData()).then((response) => {
                setSiteData(response?.responseDetails);
            }).catch(error => {
                toast.error(error.message);
                logout();
            })
        } catch (err) {
            logout();
        }
    }, [dispatch, token, logout]);

    useEffect(() => {
        const publicPaths = ['/login', '/forget-password', '/reset-password', '/license', '/maintenance'];

        if (publicPaths.includes(location.pathname)) {
            return;
        }

        if(token){
            fetchUser();
        } else {
            logout();
        }
    }, [location.pathname, token, fetchUser, logout]);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken !== token) {
                setToken(storedToken);
            }
        };
    
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [token]);    

    return (
        <AuthContext.Provider value={{ token, user, userLogin, logout, siteData}}>
            {children}
        </AuthContext.Provider>
    );
};
