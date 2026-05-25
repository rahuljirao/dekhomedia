import { GET_ADS_PLATFORM_ERROR, GET_ADS_PLATFORM_LOADING, GET_ADS_PLATFORM_SUCCESS, UPDATE_STATUS_ADS_PLATFORM_ERROR, UPDATE_STATUS_ADS_PLATFORM_LOADING, UPDATE_STATUS_ADS_PLATFORM_SUCCESS, GET_ADS_PLATFORM_DETAILS_ERROR, GET_ADS_PLATFORM_DETAILS_LOADING, GET_ADS_PLATFORM_DETAILS_SUCCESS, UPDATE_ADS_PLATFORM_DETAILS_ERROR, UPDATE_ADS_PLATFORM_DETAILS_LOADING, UPDATE_ADS_PLATFORM_DETAILS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getAdsPLatformList = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_ADS_PLATFORM_LOADING,
                data: true
            })
            Authservices.getAdsPLatformList().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_ADS_PLATFORM_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_ADS_PLATFORM_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const updateAdsPLatformStatus = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_STATUS_ADS_PLATFORM_LOADING,
                data: true
            })
            Authservices.updateAdsPlatformStatus(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_STATUS_ADS_PLATFORM_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_STATUS_ADS_PLATFORM_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getAdsPlatformDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_ADS_PLATFORM_DETAILS_LOADING,
                data: true
            })
            Authservices.getAdsPlatformDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_ADS_PLATFORM_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_ADS_PLATFORM_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateAdsPlatformDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_ADS_PLATFORM_DETAILS_LOADING,
                data: true
            })
            Authservices.updateAdsPlatformDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_ADS_PLATFORM_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_ADS_PLATFORM_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

