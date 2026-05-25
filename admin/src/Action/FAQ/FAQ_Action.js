import {UPDATE_FAQ_ERROR, UPDATE_FAQ_LOADING, UPDATE_FAQ_SUCCESS, ADD_FAQ_ERROR, ADD_FAQ_LOADING, ADD_FAQ_SUCCESS, GET_FAQ_ERROR, GET_FAQ_LOADING, GET_FAQ_SUCCESS, DELETE_FAQ_ERROR, DELETE_FAQ_LOADING, DELETE_FAQ_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getFAQ = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_FAQ_LOADING,
                data: true
            })
            Authservices.getFAQ(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_FAQ_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_FAQ_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addFAQ = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_FAQ_LOADING,
                data: true
            })
            Authservices.addFAQ(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_FAQ_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_FAQ_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateFAQ = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_FAQ_LOADING,
                data: true
            })
            Authservices.updateFAQ(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_FAQ_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_FAQ_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteFAQ = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_FAQ_LOADING,
                data: true
            })
            Authservices.deleteFAQ(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_FAQ_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_FAQ_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}