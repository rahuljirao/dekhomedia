import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Loader from "../Loader";
import * as action from '../../Action/AppDetails/AppDetails_Action';
import NumberInput from "../Input/Number";
import { useAuth } from "../../context/Context";

const Reward = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("adsCoinReward");
    const [appData, setAppData] = useState({
        daily_watch_maximum_ads: '',
        daily_watch_ads_for_minimum_coin: '',
        daily_watch_ads_for_maximum_coin: '',
        extra_daily: '',
        watch_ads_for_episode: '',
        how_many_episode_watch_after_ads: '',
        time_after_watch_ads: '',
        time_after_watch_daily_ads: '',
        time_between_daily_ads: '',
        per_episode_coin: '',
        day_1_coin: '',
        day_2_coin: '',
        day_3_coin: '',
        day_4_coin: '',
        day_5_coin: '',
        day_6_coin: '',
        day_7_coin: '',
        login_reward_coin: '',
        turn_on_notification_coin: '',
        bind_email_coin: '',
        link_whatsapp_coin: '',
        follow_us_on_facebook_coin: '',
        follow_us_on_youtube_coin: '',
        follow_us_on_instagram_coin: '',
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.GetAppDetailsReducer);
    const updateLoading = useSelector(state => state.UpdateAppDetailsReducer);
    const hasFetched = useRef(null);
    const dailyWatchMaximumAdsRefFocus = useRef(null);
    const dailyWatchAdsForMinimumCoinRefFocus = useRef(null);
    const dailyWatchAdsForMaximumCoinRefFocus = useRef(null);
    const extraDailyRefFocus = useRef(null);
    const watchAdsForEpisodeRefFocus = useRef(null);
    const howManyEpisodeWatchAfterAdsRefFocus = useRef(null);
    const timeAfterWatchAdsRefFocus = useRef(null);
    const timeAfterWatchDailyAdsRefFocus = useRef(null);
    const timeBetweenDailyAdsRefFocus = useRef(null);
    const perEpisodeCoinRefFocus = useRef(null);
    const day1CoinRefFocus = useRef(null);
    const day2CoinRefFocus = useRef(null);
    const day3CoinRefFocus = useRef(null);
    const day4CoinRefFocus = useRef(null);
    const day5CoinRefFocus = useRef(null);
    const day6CoinRefFocus = useRef(null);
    const day7CoinRefFocus = useRef(null);
    const loginRewardCoinRefFocus = useRef(null);
    const turnOnNotificationCoinRefFocus = useRef(null);
    const bindEmailCoinRefFocus = useRef(null);
    const linkWhatsappCoinRefFocus = useRef(null);
    const followUsOnFacebookCoinRefFocus = useRef(null);
    const followUsOnYoutubeCoinRefFocus = useRef(null);
    const followUsOnInstagramCoinRefFocus = useRef(null);
    
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        dispatch(action.getAppDetails()).then((response) => {
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setAppData(prevData => ({ ...prevData, ...data }));
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
        if (appData.daily_watch_maximum_ads === '') {
            customErrors = { ...customErrors, daily_watch_maximum_ads: "Please Enter Daily Watch Max Ads" }
            dailyWatchMaximumAdsRefFocus.current.focus();
        } else if (appData.daily_watch_ads_for_minimum_coin === '') {
            customErrors = { ...customErrors, daily_watch_ads_for_minimum_coin: "Please Enter Daily Watch Ads For Min Coin" }
            dailyWatchAdsForMinimumCoinRefFocus.current.focus();
        } else if (appData.daily_watch_ads_for_maximum_coin === '') {
            customErrors = { ...customErrors, daily_watch_ads_for_maximum_coin: "Please Enter Daily Watch Ads For Max Coin" }
            dailyWatchAdsForMaximumCoinRefFocus.current.focus();
        } else if (appData.extra_daily === '') {
            customErrors = { ...customErrors, extra_daily: "Please Enter Extra Coin Daily" }
            extraDailyRefFocus.current.focus();
        } else if (appData.watch_ads_for_episode === '') {
            customErrors = { ...customErrors, watch_ads_for_episode: "Please Enter Watch Ads For Episode" }
            watchAdsForEpisodeRefFocus.current.focus();
        } else if (appData.how_many_episode_watch_after_ads === '') {
            customErrors = { ...customErrors, how_many_episode_watch_after_ads: "Please Enter How Many Episode Watch After Ads" }
            howManyEpisodeWatchAfterAdsRefFocus.current.focus();
        } else if (appData.time_after_watch_ads === '') {
            customErrors = { ...customErrors, time_after_watch_ads: "Please Enter Time After Watch Episode Ads" }
            timeAfterWatchAdsRefFocus.current.focus();
        } else if (appData.time_after_watch_daily_ads === '') {
            customErrors = { ...customErrors, time_after_watch_daily_ads: "Please Enter Time After Watch Daily Ads" }
            timeAfterWatchDailyAdsRefFocus.current.focus();
        } else if (appData.time_between_daily_ads === '') {
            customErrors = { ...customErrors, time_between_daily_ads: "Please Enter Time Between Daily Ads" }
            timeBetweenDailyAdsRefFocus.current.focus();
        } else if (appData.per_episode_coin === '') {
            customErrors = { ...customErrors, per_episode_coin: "Please Enter Per Episode Coin" }
            perEpisodeCoinRefFocus.current.focus();
        } else if (appData.day_1_coin === '') {
            customErrors = { ...customErrors, day_1_coin: "Please Enter Day 1 Coin" }
            day1CoinRefFocus.current.focus();
        } else if (appData.day_2_coin === '') {
            customErrors = { ...customErrors, day_2_coin: "Please Enter Day 2 Coin" }
            day2CoinRefFocus.current.focus();
        } else if (appData.day_3_coin === '') {
            customErrors = { ...customErrors, day_3_coin: "Please Enter Day 3 Coin" }
            day3CoinRefFocus.current.focus();
        } else if (appData.day_4_coin === '') {
            customErrors = { ...customErrors, day_4_coin: "Please Enter Day 4 Coin" }
            day4CoinRefFocus.current.focus();
        } else if (appData.day_5_coin === '') {
            customErrors = { ...customErrors, day_5_coin: "Please Enter Day 5 Coin" }
            day5CoinRefFocus.current.focus();
        } else if (appData.day_6_coin === '') {
            customErrors = { ...customErrors, day_6_coin: "Please Enter Day 6 Coin" }
            day6CoinRefFocus.current.focus();
        } else if (appData.day_7_coin === '') {
            customErrors = { ...customErrors, day_7_coin: "Please Enter Day 7 Coin" }
            day7CoinRefFocus.current.focus();
        } else if (appData.login_reward_coin === '') {
            customErrors = { ...customErrors, login_reward_coin: "Please Enter Login Reward Coin" }
            loginRewardCoinRefFocus.current.focus();
        } else if (appData.turn_on_notification_coin === '') {
            customErrors = { ...customErrors, turn_on_notification_coin: "Please Enter Notification Coin" }
            turnOnNotificationCoinRefFocus.current.focus();
        } else if (appData.bind_email_coin === '') {
            customErrors = { ...customErrors, bind_email_coin: "Please Enter Bind Email Coin" }
            bindEmailCoinRefFocus.current.focus();
        } else if (appData.link_whatsapp_coin === '') {
            customErrors = { ...customErrors, link_whatsapp_coin: "Please Enter Link Whatsapp Coin" }
            linkWhatsappCoinRefFocus.current.focus();
        } else if (appData.follow_us_on_facebook_coin === '') {
            customErrors = { ...customErrors, follow_us_on_facebook_coin: "Please Enter Follow Facebook Coin" }
            followUsOnFacebookCoinRefFocus.current.focus();
        } else if (appData.follow_us_on_youtube_coin === '') {
            customErrors = { ...customErrors, follow_us_on_youtube_coin: "Please Enter Follow Youtube Coin" }
            followUsOnYoutubeCoinRefFocus.current.focus();
        } else if (appData.follow_us_on_instagram_coin === '') {
            customErrors = { ...customErrors, follow_us_on_instagram_coin: "Please Enter Follow Instagram Coin" }
            followUsOnInstagramCoinRefFocus.current.focus();
        }

        if (Object.keys(customErrors).length > 0) {
            setErrors(customErrors)
            return true
        }

        dispatch(action.updateAppDetails(appData)).then((response) => {
            toast.success(response.responseMessage);
            let data = response.responseDetails;
            delete data.created_at;
            delete data.updated_at;
            delete data.id;
            setAppData(data);
        }).catch(error => {
            toast.error(error.responseMessage);
        })
    }
    return (
        <>
            { loading ? <Loader /> : 
                <>
                    <div className="general-settings-section">
                        <h2 className="section-title">Reward Settings</h2>
                        <section id="notification-section" className="notification-section section">
                            <div className="coin-section">
                                <div className="tabs">
                                    <button
                                        className={
                                            activeTab === "adsCoinReward" ? "tab active" : "tab"
                                        }
                                        onClick={() => setActiveTab("adsCoinReward")}
                                    >
                                        Ads Coin Reward
                                    </button>
                                    <button
                                        className={
                                            activeTab === "dailyCoinReward" ? "tab active" : "tab"
                                        }
                                        onClick={() => setActiveTab("dailyCoinReward")}
                                    >
                                        Daily Coin Reward
                                    </button>
                                    <button
                                        className={
                                            activeTab === "loginCoinReward" ? "tab active" : "tab"
                                        }
                                        onClick={() => setActiveTab("loginCoinReward")}
                                    >
                                        Login Coin Reward
                                    </button>
                                    <button
                                        className={
                                            activeTab === "socialCoinReward" ? "tab active" : "tab"
                                        }
                                        onClick={() => setActiveTab("socialCoinReward")}
                                    >
                                        Social Coin Reward
                                    </button>
                                </div>
                            </div>
                            <form className="settings-form" onSubmit={updateProfile}>
                                <div className="subscription-wrapper">
                                    {activeTab === "adsCoinReward" && (
                                        <div className="tab-content-data">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="daily_watch_maximum_ads">Daily Watch Max Ads</label>
                                                        <NumberInput id="daily_watch_maximum_ads" name="daily_watch_maximum_ads" ref={dailyWatchMaximumAdsRefFocus} value={appData?.daily_watch_maximum_ads} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.daily_watch_maximum_ads}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="daily_watch_ads_for_minimum_coin">Daily Watch Ads For Min Coin</label>
                                                        <NumberInput id="daily_watch_ads_for_minimum_coin" name="daily_watch_ads_for_minimum_coin" ref={dailyWatchAdsForMinimumCoinRefFocus} value={appData?.daily_watch_ads_for_minimum_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.daily_watch_ads_for_minimum_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="daily_watch_ads_for_maximum_coin">Daily Watch Ads For Max Coin</label>
                                                        <NumberInput id="daily_watch_ads_for_maximum_coin" name="daily_watch_ads_for_maximum_coin" ref={dailyWatchAdsForMaximumCoinRefFocus} value={appData?.daily_watch_ads_for_maximum_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.daily_watch_ads_for_maximum_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="extra_daily">Extra Coin Daily</label>
                                                        <NumberInput id="extra_daily" name="extra_daily" ref={extraDailyRefFocus} value={appData?.extra_daily} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.extra_daily}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="watch_ads_for_episode">Watch Ads For Episode</label>
                                                        <NumberInput id="watch_ads_for_episode" name="watch_ads_for_episode" ref={watchAdsForEpisodeRefFocus} value={appData?.watch_ads_for_episode} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.watch_ads_for_episode}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="how_many_episode_watch_after_ads">How Many Episode Watch After Ads</label>
                                                        <NumberInput id="how_many_episode_watch_after_ads" name="how_many_episode_watch_after_ads" ref={howManyEpisodeWatchAfterAdsRefFocus} value={appData?.how_many_episode_watch_after_ads} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.how_many_episode_watch_after_ads}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="time_after_watch_ads">Time After Watch Episode Ads</label>
                                                        <input type="text" id="time_after_watch_ads" name="time_after_watch_ads" ref={timeAfterWatchAdsRefFocus} value={appData?.time_after_watch_ads} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.time_after_watch_ads}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="time_after_watch_daily_ads">Time After Watch Daily Ads</label>
                                                        <input type="text" id="time_after_watch_daily_ads" name="time_after_watch_daily_ads" ref={timeAfterWatchDailyAdsRefFocus} value={appData?.time_after_watch_daily_ads} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.time_after_watch_daily_ads}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="time_between_daily_ads">Time between Daily Ads</label>
                                                        <input type="text" id="time_between_daily_ads" name="time_between_daily_ads" ref={timeBetweenDailyAdsRefFocus} value={appData?.time_between_daily_ads} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.time_between_daily_ads}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="per_episode_coin">Per Episode Coin</label>
                                                        <NumberInput id="per_episode_coin" name="per_episode_coin" ref={perEpisodeCoinRefFocus} value={appData?.per_episode_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.per_episode_coin}</span>
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
                                    )}
                                    {activeTab === "dailyCoinReward" && (
                                        <div className="tab-content-data">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_1_coin">Day 1 Coin</label>
                                                        <NumberInput id="day_1_coin" name="day_1_coin" ref={day1CoinRefFocus} value={appData?.day_1_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_1_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_2_coin">Day 2 Coin</label>
                                                        <NumberInput id="day_2_coin" name="day_2_coin" ref={day2CoinRefFocus} value={appData?.day_2_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_2_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_3_coin">Day 3 Coin</label>
                                                        <NumberInput id="day_3_coin" name="day_3_coin" ref={day3CoinRefFocus} value={appData?.day_3_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_3_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_4_coin">Day 4 Coin</label>
                                                        <NumberInput id="day_4_coin" name="day_4_coin" ref={day4CoinRefFocus} value={appData?.day_4_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_4_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_5_coin">Day 5 Coin</label>
                                                        <NumberInput id="day_5_coin" name="day_5_coin" ref={day5CoinRefFocus} value={appData?.day_5_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_5_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_6_coin">Day 6 Coin</label>
                                                        <NumberInput id="day_6_coin" name="day_6_coin" ref={day6CoinRefFocus} value={appData?.day_6_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_6_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="day_7_coin">Day 7 Coin</label>
                                                        <NumberInput id="day_7_coin" name="day_7_coin" ref={day7CoinRefFocus} value={appData?.day_7_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.day_7_coin}</span>
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
                                    )}
                                    {activeTab === "loginCoinReward" && (
                                        <div className="tab-content-data">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="login_reward_coin">Login Reward Coin</label>
                                                        <NumberInput id="login_reward_coin" name="login_reward_coin" ref={loginRewardCoinRefFocus} value={appData?.login_reward_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.login_reward_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="turn_on_notification_coin">Notification Coin</label>
                                                        <NumberInput id="turn_on_notification_coin" name="turn_on_notification_coin" ref={turnOnNotificationCoinRefFocus} value={appData?.turn_on_notification_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.turn_on_notification_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="bind_email_coin">Bind Email Coin</label>
                                                        <NumberInput id="bind_email_coin" name="bind_email_coin" ref={bindEmailCoinRefFocus} value={appData?.bind_email_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.bind_email_coin}</span>
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
                                    )}
                                    {activeTab === "socialCoinReward" && (
                                        <div className="tab-content-data">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="link_whatsapp_coin">Link Whatsapp Coin</label>
                                                        <NumberInput id="link_whatsapp_coin" name="link_whatsapp_coin" ref={linkWhatsappCoinRefFocus} value={appData?.link_whatsapp_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.link_whatsapp_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="follow_us_on_facebook_coin">Follow Facebook Coin</label>
                                                        <NumberInput id="follow_us_on_facebook_coin" name="follow_us_on_facebook_coin" ref={followUsOnFacebookCoinRefFocus} value={appData?.follow_us_on_facebook_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.follow_us_on_facebook_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="follow_us_on_youtube_coin">Follow Youtube Coin</label>
                                                        <NumberInput id="follow_us_on_youtube_coin" name="follow_us_on_youtube_coin" ref={followUsOnYoutubeCoinRefFocus} value={appData?.follow_us_on_youtube_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.follow_us_on_youtube_coin}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="follow_us_on_instagram_coin">Follow Instagram Coin</label>
                                                        <NumberInput id="follow_us_on_instagram_coin" name="follow_us_on_instagram_coin" ref={followUsOnInstagramCoinRefFocus} value={appData?.follow_us_on_instagram_coin} onChange={onChange} />
                                                        <span className='text-danger pt-2'>{errors?.follow_us_on_instagram_coin}</span>
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
                                    )}
                                </div>
                            </form>
                        </section>
                    </div>
                </>
            }
        </>
    );
};

export default Reward;