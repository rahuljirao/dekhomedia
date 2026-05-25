import {UPDATE_CATEGORIES_ERROR, UPDATE_CATEGORIES_LOADING, UPDATE_CATEGORIES_SUCCESS, ADD_CATEGORIES_ERROR, ADD_CATEGORIES_LOADING, ADD_CATEGORIES_SUCCESS, GET_CATEGORIES_ERROR, GET_CATEGORIES_LOADING, GET_CATEGORIES_SUCCESS, DELETE_CATEGORIES_ERROR, DELETE_CATEGORIES_LOADING, DELETE_CATEGORIES_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getCategories = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_CATEGORIES_LOADING,
                data: true
            })
            Authservices.getCategories(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_CATEGORIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_CATEGORIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addCategories = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_CATEGORIES_LOADING,
                data: true
            })
            Authservices.addCategories(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_CATEGORIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_CATEGORIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateCategories = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_CATEGORIES_LOADING,
                data: true
            })
            Authservices.updateCategories(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_CATEGORIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_CATEGORIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteCategories = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_CATEGORIES_LOADING,
                data: true
            })
            Authservices.deleteCategories(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_CATEGORIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_CATEGORIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}