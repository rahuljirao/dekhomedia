import {UPDATE_TAGS_ERROR, UPDATE_TAGS_LOADING, UPDATE_TAGS_SUCCESS, ADD_TAGS_ERROR, ADD_TAGS_LOADING, ADD_TAGS_SUCCESS, GET_TAGS_ERROR, GET_TAGS_LOADING, GET_TAGS_SUCCESS, DELETE_TAGS_ERROR, DELETE_TAGS_LOADING, DELETE_TAGS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getTags = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_TAGS_LOADING,
                data: true
            })
            Authservices.getTags(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_TAGS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_TAGS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addTags = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_TAGS_LOADING,
                data: true
            })
            Authservices.addTags(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_TAGS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_TAGS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateTags = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_TAGS_LOADING,
                data: true
            })
            Authservices.updateTags(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_TAGS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_TAGS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteTags = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_TAGS_LOADING,
                data: true
            })
            Authservices.deleteTags(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_TAGS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_TAGS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}