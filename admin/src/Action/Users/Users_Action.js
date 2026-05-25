import {GET_USERS_DETAILS_ERROR, GET_USERS_DETAILS_LOADING, GET_USERS_DETAILS_SUCCESS, GET_USERS_LIST_ERROR, GET_USERS_LIST_LOADING, GET_USERS_LIST_SUCCESS, UPDATE_IS_BLOCKED_ERROR, UPDATE_IS_BLOCKED_LOADING, UPDATE_IS_BLOCKED_SUCCESS, GET_REWARD_HISTORY_ERROR, GET_REWARD_HISTORY_LOADING, GET_REWARD_HISTORY_SUCCESS, GET_PURCHASE_COIN_HISTORY_ERROR, GET_PURCHASE_COIN_HISTORY_LOADING, GET_PURCHASE_COIN_HISTORY_SUCCESS, GET_PURCHASE_VIP_HISTORY_ERROR, GET_PURCHASE_VIP_HISTORY_LOADING, GET_PURCHASE_VIP_HISTORY_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getUsersDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_USERS_DETAILS_LOADING,
                data: true
            })
            Authservices.getUsersDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_USERS_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_USERS_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getUsersList = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_USERS_LIST_LOADING,
                data: true
            })
            Authservices.getUsersList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_USERS_LIST_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_USERS_LIST_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateIsBlockedUser = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_IS_BLOCKED_LOADING,
                data: true
            })
            Authservices.updateIsBlockedDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_IS_BLOCKED_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_IS_BLOCKED_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getRewardHistoryList = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_REWARD_HISTORY_LOADING,
                data: true
            })
            Authservices.getRewardHistoryList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_REWARD_HISTORY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_REWARD_HISTORY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getPurchaseCoinHistoryList = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PURCHASE_COIN_HISTORY_LOADING,
                data: true
            })
            Authservices.getPurchaseCoinHistoryList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PURCHASE_COIN_HISTORY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PURCHASE_COIN_HISTORY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getPurchaseVIPHistoryList = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PURCHASE_VIP_HISTORY_LOADING,
                data: true
            })
            Authservices.getPurchaseVIPHistoryList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PURCHASE_VIP_HISTORY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PURCHASE_VIP_HISTORY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}