import {UPDATE_LANGUAGES_ERROR, UPDATE_LANGUAGES_LOADING, UPDATE_LANGUAGES_SUCCESS, ADD_LANGUAGES_ERROR, ADD_LANGUAGES_LOADING, ADD_LANGUAGES_SUCCESS, GET_LANGUAGES_ERROR, GET_LANGUAGES_LOADING, GET_LANGUAGES_SUCCESS, DELETE_LANGUAGES_ERROR, DELETE_LANGUAGES_LOADING, DELETE_LANGUAGES_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getLanguages = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_LANGUAGES_LOADING,
                data: true
            })
            Authservices.getLanguages(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_LANGUAGES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_LANGUAGES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addLanguages = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_LANGUAGES_LOADING,
                data: true
            })
            Authservices.addLanguages(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_LANGUAGES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_LANGUAGES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateLanguages = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_LANGUAGES_LOADING,
                data: true
            })
            Authservices.updateLanguages(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_LANGUAGES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_LANGUAGES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteLanguages = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_LANGUAGES_LOADING,
                data: true
            })
            Authservices.deleteLanguages(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_LANGUAGES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_LANGUAGES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}