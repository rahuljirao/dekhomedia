import {UPDATE_TYPES_ERROR, UPDATE_TYPES_LOADING, UPDATE_TYPES_SUCCESS, ADD_TYPES_ERROR, ADD_TYPES_LOADING, ADD_TYPES_SUCCESS, GET_TYPES_ERROR, GET_TYPES_LOADING, GET_TYPES_SUCCESS, DELETE_TYPES_ERROR, DELETE_TYPES_LOADING, DELETE_TYPES_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getTypes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_TYPES_LOADING,
                data: true
            })
            Authservices.getTypes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_TYPES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_TYPES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addTypes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_TYPES_LOADING,
                data: true
            })
            Authservices.addTypes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_TYPES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_TYPES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateTypes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_TYPES_LOADING,
                data: true
            })
            Authservices.updateTypes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_TYPES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_TYPES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteTypes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_TYPES_LOADING,
                data: true
            })
            Authservices.deleteTypes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_TYPES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_TYPES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}