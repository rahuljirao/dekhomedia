import {UPDATE_REPORT_REASON_ERROR, UPDATE_REPORT_REASON_LOADING, UPDATE_REPORT_REASON_SUCCESS, ADD_REPORT_REASON_ERROR, ADD_REPORT_REASON_LOADING, ADD_REPORT_REASON_SUCCESS, GET_REPORT_REASON_ERROR, GET_REPORT_REASON_LOADING, GET_REPORT_REASON_SUCCESS, DELETE_REPORT_REASON_ERROR, DELETE_REPORT_REASON_LOADING, DELETE_REPORT_REASON_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getReportReason = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_REPORT_REASON_LOADING,
                data: true
            })
            Authservices.getReportReason(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_REPORT_REASON_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_REPORT_REASON_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addReportReason = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_REPORT_REASON_LOADING,
                data: true
            })
            Authservices.addReportReason(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_REPORT_REASON_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_REPORT_REASON_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateReportReason = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_REPORT_REASON_LOADING,
                data: true
            })
            Authservices.updateReportReason(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_REPORT_REASON_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_REPORT_REASON_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteReportReason = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_REPORT_REASON_LOADING,
                data: true
            })
            Authservices.deleteReportReason(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_REPORT_REASON_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_REPORT_REASON_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}