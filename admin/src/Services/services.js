import axios from "axios";
const token = localStorage.getItem('token');
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const login = (data) => { return axios.post(`${API_BASE_URL}admin/v1/signin`, data, { headers: { 'Content-Type': 'application/json' } }) }
export const forgetPassword = (data) => { return axios.post(`${API_BASE_URL}admin/v1/forget-password`, data, { headers: { 'Content-Type': 'application/json' } }) }
export const resetPassword = (data) => { return axios.post(`${API_BASE_URL}admin/v1/reset-password`, data, { headers: { 'Content-Type': 'application/json' } }) }
export const updateProfile = (data) => { return axios.post(`${API_BASE_URL}admin/v1/update-profile`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getProfile = () => { return axios.get(`${API_BASE_URL}admin/v1/get-profile`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateSiteDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/site-details/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getSiteDetails = () => { return axios.get(`${API_BASE_URL}admin/v1/site-details/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateSocialLinks = (data) => { return axios.post(`${API_BASE_URL}admin/v1/social-links/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getSocialLinks = () => { return axios.get(`${API_BASE_URL}admin/v1/social-links/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateAppDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/app-data/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateAppCurrencyDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/app-data/update-currency`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getAppDetails = () => { return axios.get(`${API_BASE_URL}admin/v1/app-data/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePassword = (data) => { return axios.post(`${API_BASE_URL}admin/v1/update-password`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getUsersList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/list`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getUsersDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/details`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getPaymentMethod = (data) => { return axios.post(`${API_BASE_URL}admin/v1/payment-methods/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addPaymentMethod = (data) => { return axios.post(`${API_BASE_URL}admin/v1/payment-methods/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePaymentMethod = (data) => { return axios.post(`${API_BASE_URL}admin/v1/payment-methods/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePaymentMethodStatus = (data) => { return axios.post(`${API_BASE_URL}admin/v1/payment-methods/update-status`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deletePaymentMethod = (data) => { return axios.post(`${API_BASE_URL}admin/v1/payment-methods/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const verifyToken = (data) => { return axios.post(`${API_BASE_URL}admin/v1/verify-token`, data, { headers: { 'Content-Type': 'application/json' } }) }
export const getCategories = (data) => { return axios.post(`${API_BASE_URL}admin/v1/category/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addCategories = (data) => { return axios.post(`${API_BASE_URL}admin/v1/category/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateCategories = (data) => { return axios.post(`${API_BASE_URL}admin/v1/category/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteCategories = (data) => { return axios.post(`${API_BASE_URL}admin/v1/category/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getTags = (data) => { return axios.post(`${API_BASE_URL}admin/v1/tags/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addTags = (data) => { return axios.post(`${API_BASE_URL}admin/v1/tags/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateTags = (data) => { return axios.post(`${API_BASE_URL}admin/v1/tags/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteTags = (data) => { return axios.post(`${API_BASE_URL}admin/v1/tags/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getLanguages = (data) => { return axios.post(`${API_BASE_URL}admin/v1/language/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addLanguages = (data) => { return axios.post(`${API_BASE_URL}admin/v1/language/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateLanguages = (data) => { return axios.post(`${API_BASE_URL}admin/v1/language/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteLanguages = (data) => { return axios.post(`${API_BASE_URL}admin/v1/language/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getTypes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/types/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addTypes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/types/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateTypes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/types/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteTypes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/types/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getPlans = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addPlans = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePlans = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deletePlans = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getSeriesDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/details`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateRecommandedSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/update-recommended`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateActiveSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/update-active`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateFreeSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/update-free`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteSeries = (data) => { return axios.post(`${API_BASE_URL}admin/v1/series/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getEpisodes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/seriesWise`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getEpisodesDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/details`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addEpisodes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addMultipleEpisodes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/add-multiple`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addEpisodesUrl = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/add-urls`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateEpisodes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteEpisodes = (data) => { return axios.post(`${API_BASE_URL}admin/v1/episode/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getDashboardDetails = () => { return axios.get(`${API_BASE_URL}admin/v1/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateAboutUs = (data) => { return axios.post(`${API_BASE_URL}admin/v1/about-us/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getAboutUs = () => { return axios.get(`${API_BASE_URL}admin/v1/about-us/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateTermsCondition = (data) => { return axios.post(`${API_BASE_URL}admin/v1/terms-condition/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getTermsCondition = () => { return axios.get(`${API_BASE_URL}admin/v1/terms-condition/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePrivacyPolicy = (data) => { return axios.post(`${API_BASE_URL}admin/v1/privacy-policy/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getPrivacyPolicy = () => { return axios.get(`${API_BASE_URL}admin/v1/privacy-policy/details`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getAdsPLatformList = () => { return axios.get(`${API_BASE_URL}admin/v1/ads/get`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateAdsPlatformStatus = (data) => { return axios.post(`${API_BASE_URL}admin/v1/ads/update-status`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getAdsPlatformDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/ads/details`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateAdsPlatformDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/ads/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateIsBlockedDetails = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/update-blocked`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getRewardHistoryList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/reward-history`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getPurchaseCoinHistoryList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/coin-plan-history`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getPurchaseVIPHistoryList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/users/vip-plan-history`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateIsActivePlan = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/update-status`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getVipPlanList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/plans/get-vip`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getVipPlanOrderList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/coin-order-history/get-vip`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getCoinPlanOrderList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/coin-order-history/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getReportReason = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addReportReason = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateReportReason = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteReportReason = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getTicketList = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/get-tickets`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateTicketStatus = (data) => { return axios.post(`${API_BASE_URL}admin/v1/report-reason/update-ticket-status`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getFAQ = (data) => { return axios.post(`${API_BASE_URL}admin/v1/faq/get`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addFAQ = (data) => { return axios.post(`${API_BASE_URL}admin/v1/faq/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updateFAQ = (data) => { return axios.post(`${API_BASE_URL}admin/v1/faq/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deleteFAQ = (data) => { return axios.post(`${API_BASE_URL}admin/v1/faq/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getSiteData = () => { return axios.get(`${API_BASE_URL}details`, { headers: { 'Content-Type': 'application/json' } }) }
export const verifyLicense = (data) => { return axios.post(`${API_BASE_URL}v1/license`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const getLicense = (data) => { return axios.post(`${API_BASE_URL}v1/license/verify`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const sendNotification = (data) => { return axios.post(`${API_BASE_URL}admin/v1/notification/send`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }

// ─── Promoters ──────────────────────────────────────────────────────────────
export const getPromotersList = () => { return axios.get(`${API_BASE_URL}admin/v1/promoters/list`, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const addPromoter = (data) => { return axios.post(`${API_BASE_URL}admin/v1/promoters/add`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const updatePromoter = (data) => { return axios.post(`${API_BASE_URL}admin/v1/promoters/update`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
export const deletePromoter = (data) => { return axios.post(`${API_BASE_URL}admin/v1/promoters/delete`, data, { headers: { 'Authorization': `Bearer ${token}` } }) }
