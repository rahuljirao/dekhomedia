import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Movies from './Movies';
import TvShows from './TvShows';
import Users from './Users';
import Content from './Content/Index';
import Reports from './Reports';
import Settings from './Settings';
import Profile from './Profile';
import PaymentMethod from './PaymentMethod';
import Loader from './Loader';
import Dashboard from './Dashboard';
import ScrollProgress from './ScrollProgress';
import MediaGallery from './MediaGallery';
import TopContents from './TopContents';
import Actors from './Actors';
import Genres from './Genres';
import Languages from './Languages';
import LiveTvCategories from './LiveTvCategories';
import LiveTvChannels from './LiveTvChannels';
import Notification from './Notification';
import Tags from './Tags';
import Types from './Types';
import Plans from './Plans';
import Episodes from './Content/Episodes';
import Breadcrumbs from './Breadcrumbs';
import ViewUser from './ViewUser';
import AboutUs from './Pages/AboutUs';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsCondition from './Pages/TermsCondition';
import AdsSetting from './AdsSetting';
import AdsSettingUpdate from './AdsSettingUpdate';
import VipPlans from './VipPlans';
import OrderHistory from './OrderHistory';
import Reward from './Settings/Reward';
import Tickets from './Tickets';
import { useAuth } from '../context/Context';
import SendNotification from './SendNotification';
import Promoters from './Promoters';
import PremiumVideos from './PremiumVideos';  // ← NEW

const PINK = "#E91E8C";

const Main = () => {
    const { logout, token, user } = useAuth();
    const location  = useLocation();
    const currentRoute = location.pathname.replace(/\/+$/, '');
    const { loading }  = useSelector(state => state.VerifyTokenReducer);
    const { payload }  = useSelector(state => state.GetSiteDataReducer);
    const [siteData, setSiteData]   = useState({});
    const [menuOpen, setMenuOpen]   = useState(false);
    const popupRef = useRef(null);

    useEffect(() => { setSiteData(payload?.responseDetails); }, [payload]);
    useEffect(() => {
        if (menuOpen) document.body.classList.add('no_scroll', 'active_menu');
        else document.body.classList.remove('no_scroll', 'active_menu');
    }, [menuOpen]);
    useEffect(() => {
        const h = (e) => { if (popupRef.current && e.target === popupRef.current) setMenuOpen(false); };
        window.addEventListener('click', h);
        return () => window.removeEventListener('click', h);
    }, []);

    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setTimeout(() => setMenuOpen(p => !p), 50);
    const onMobile = (setter) => { if (window.innerWidth <= 991) setter(p => !p); };

    if (!token) return <Navigate to="/login" replace />;

    return (
        <>
            {loading ? <Loader /> : <>
                {menuOpen && <div className="overlay active" onClick={closeMenu} />}

                {/* ── Sidebar ──────────────────────────────────────────────── */}
                <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
                    <div className="sidebar-header">
                        <Link to="/" className="logo-col d-flex align-items-center">
                            <img src={siteData?.logo} alt="logo" loading="lazy" />
                            {siteData?.title}
                            <button className="close-sidebar-btn" onClick={closeMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </Link>
                    </div>
                    <ul className="sidebar-menu">

                        <li><ul><li><strong>Menu</strong></li><hr /></ul></li>
                        <li><Link to="/"          className={currentRoute===''          ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-house"/>         Dashboard</Link></li>
                        <li><Link to="/users"      className={currentRoute==='/users'    ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-users"/>         Users</Link></li>
                        <li><Link to="/tickets"    className={currentRoute==='/tickets'  ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-ticket-alt"/>    Tickets</Link></li>

                        <li><ul><hr /><li><strong>Film Management</strong></li><hr /></ul></li>
                        <li><Link to="/series"     className={currentRoute==='/series'   ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-video"/>         Series</Link></li>
                        <li><Link to="/genres"     className={currentRoute==='/genres'   ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-box-open"/>      Genres</Link></li>
                        <li><Link to="/tags"       className={currentRoute==='/tags'     ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-tag"/>           Tags</Link></li>
                        <li><Link to="/types"      className={currentRoute==='/types'    ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-box-open"/>      Types</Link></li>

                        {/* ★ Premium Videos — pink highlight */}
                        <li>
                            <Link
                                to="/premium-videos"
                                className={currentRoute==='/premium-videos'?'active':''}
                                onClick={()=>onMobile(setMenuOpen)}
                                style={ currentRoute==='/premium-videos' ? {} : {} }
                            >
                                <i className="fas fa-film" style={{ color:PINK }} />
                                <span style={{ color: currentRoute==='/premium-videos' ? undefined : PINK, fontWeight:700 }}>
                                    {' '}Premium Videos
                                </span>
                                <span style={{ marginLeft:6, fontSize:'0.6rem', padding:'2px 6px', background:PINK, color:'#fff', borderRadius:20 }}>NEW</span>
                            </Link>
                        </li>

                        <li><ul><hr /><li><strong>Package</strong></li><hr /></ul></li>
                        <li><Link to="/plans"          className={currentRoute==='/plans'         ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-coins"/>           Coin Plans</Link></li>
                        <li><Link to="/vip-plans"      className={currentRoute==='/vip-plans'     ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-project-diagram"/> VIP Plans</Link></li>
                        <li><Link to="/order-history"  className={currentRoute==='/order-history' ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-trophy"/>          Order History</Link></li>

                        <li><ul><hr /><li><strong>General</strong></li><hr /></ul></li>
                        <li><Link to="/payment-method"    className={currentRoute==='/payment-method'   ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-money-bill"/>  Payment Method</Link></li>
                        <li><Link to="/languages"          className={currentRoute==='/languages'        ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-language"/>    Languages</Link></li>
                        <li><Link to="/reward"             className={currentRoute==='/reward'           ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-atom"/>        Reward</Link></li>
                        <li><Link to="/settings"           className={currentRoute==='/settings'         ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-cog"/>         Settings</Link></li>
                        <li><Link to="/ads-setting"        className={currentRoute==='/ads-setting'      ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-ad"/>          Ads Setting</Link></li>
                        <li><Link to="/send-notification"  className={currentRoute==='/send-notification'?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-bell"/>        Send Notification</Link></li>
                        <li>
                            <Link to="/promoters" className={currentRoute==='/promoters'?'active':''} onClick={()=>onMobile(setMenuOpen)}>
                                <i className="fas fa-link"/> Promoters
                                <span style={{ marginLeft:6, fontSize:'0.6rem', padding:'2px 6px', background:'var(--first-color,#FF5733)', color:'#fff', borderRadius:20 }}>NEW</span>
                            </Link>
                        </li>

                        <li><ul><hr /><li><strong>Pages</strong></li><hr /></ul></li>
                        <li><Link to="/about-us"        className={currentRoute==='/about-us'       ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-info"/> About Us</Link></li>
                        <li><Link to="/privacy-policy"  className={currentRoute==='/privacy-policy' ?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-info"/> Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions"className={currentRoute==='/terms-conditions'?'active':''} onClick={()=>onMobile(setMenuOpen)}><i className="fas fa-info"/> Terms Conditions</Link></li>
                    </ul>
                </aside>

                {/* ── Main Content ─────────────────────────────────────────── */}
                <main className="main-content">
                    <header className="site-header">
                        <div className="about-profile d-flex align-items-center justify-content-between gap-2">
                            <div />
                            <div className="about-profile-right d-flex align-items-center gap-3">
                                <div className="user-profile">
                                    <div className="dropdown">
                                        <div className="d-flex align-items-center gap-2 dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown">
                                            <img src={user?.profile_image??'/assets/images/profil-img-1.png'} alt="" className="rounded-circle profile_image" width="32" height="32"/>
                                            <span>{user?.name}</span>
                                        </div>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                                            <li><Link to="#" className="dropdown-item" onClick={logout}>Log Out</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <button className={`mobile-menu-btn ${menuOpen?'active_menu':''}`} onClick={toggleMenu}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    <Breadcrumbs />

                    {currentRoute === ''              && <Dashboard />}
                    {currentRoute === '/users'        && <Users />}
                    {currentRoute === '/tickets'      && <Tickets />}
                    {currentRoute === currentRoute.match(/^\/users\/\d+$/)?.input && <ViewUser />}
                    {currentRoute === '/series'       && <Content />}
                    {currentRoute === currentRoute.match(/^\/series\/\d+$/)?.input && <Episodes />}
                    {currentRoute === '/media-gallery'&& <MediaGallery />}
                    {currentRoute === '/top-contents' && <TopContents />}
                    {currentRoute === '/actors'       && <Actors />}
                    {currentRoute === '/genres'       && <Genres />}
                    {currentRoute === '/tags'         && <Tags />}
                    {currentRoute === '/types'        && <Types />}
                    {currentRoute === '/plans'        && <Plans />}
                    {currentRoute === '/vip-plans'    && <VipPlans />}
                    {currentRoute === '/order-history'&& <OrderHistory />}
                    {currentRoute === '/languages'    && <Languages />}
                    {currentRoute === '/live-tv-categories' && <LiveTvCategories />}
                    {currentRoute === '/live-tv-channels'   && <LiveTvChannels />}
                    {currentRoute === '/notification'       && <Notification />}
                    {currentRoute === '/send-notification'  && <SendNotification />}
                    {currentRoute === '/movies'       && <Movies />}
                    {currentRoute === '/tv-shows'     && <TvShows />}
                    {currentRoute === '/reports'      && <Reports />}
                    {currentRoute === '/settings'     && <Settings />}
                    {currentRoute === '/reward'       && <Reward />}
                    {currentRoute === '/profile'      && <Profile />}
                    {currentRoute === '/payment-method'  && <PaymentMethod />}
                    {currentRoute === '/about-us'     && <AboutUs />}
                    {currentRoute === '/privacy-policy'  && <PrivacyPolicy />}
                    {currentRoute === '/terms-conditions' && <TermsCondition />}
                    {currentRoute === '/ads-setting'  && <AdsSetting />}
                    {currentRoute === currentRoute.match(/^\/ads-setting\/\d+$/)?.input && <AdsSettingUpdate />}
                    {currentRoute === '/promoters'    && <Promoters />}
                    {currentRoute === '/premium-videos' && <PremiumVideos />}  {/* ← NEW */}

                    <ScrollProgress />
                </main>
            </>}
        </>
    );
};

export default Main;
