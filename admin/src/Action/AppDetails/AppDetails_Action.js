import {UPDATE_APP_DETAILS_ERROR, UPDATE_APP_DETAILS_LOADING, UPDATE_APP_DETAILS_SUCCESS, GET_APP_DETAILS_ERROR, GET_APP_DETAILS_LOADING, GET_APP_DETAILS_SUCCESS, UPDATE_APP_CURRENCY_DETAILS_ERROR, UPDATE_APP_CURRENCY_DETAILS_LOADING, UPDATE_APP_CURRENCY_DETAILS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateAppDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_APP_DETAILS_LOADING,
                data: true
            })
            Authservices.updateAppDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_APP_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_APP_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const updateAppCurrencyDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_APP_CURRENCY_DETAILS_LOADING,
                data: true
            })
            Authservices.updateAppCurrencyDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_APP_CURRENCY_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_APP_CURRENCY_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getAppDetails = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_APP_DETAILS_LOADING,
                data: true
            })
            Authservices.getAppDetails().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_APP_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_APP_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}