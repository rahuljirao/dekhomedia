import {UPDATE_SITE_DETAILS_ERROR, UPDATE_SITE_DETAILS_LOADING, UPDATE_SITE_DETAILS_SUCCESS, GET_SITE_DETAILS_ERROR, GET_SITE_DETAILS_LOADING, GET_SITE_DETAILS_SUCCESS, SITE_DATA_ERROR, SITE_DATA_LOADING, SITE_DATA_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateSiteDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_SITE_DETAILS_LOADING,
                data: true
            })
            Authservices.updateSiteDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_SITE_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_SITE_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getSiteDetails = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_SITE_DETAILS_LOADING,
                data: true
            })
            Authservices.getSiteDetails().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_SITE_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_SITE_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getSiteData = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: SITE_DATA_LOADING,
                data: true
            })
            Authservices.getSiteData().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: SITE_DATA_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: SITE_DATA_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}