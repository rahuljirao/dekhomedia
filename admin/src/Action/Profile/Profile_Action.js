import {UPDATE_PROFILE_ERROR, UPDATE_PROFILE_LOADING, UPDATE_PROFILE_SUCCESS, GET_PROFILE_ERROR, GET_PROFILE_LOADING, GET_PROFILE_SUCCESS, UPDATE_PASSWORD_ERROR, UPDATE_PASSWORD_LOADING, UPDATE_PASSWORD_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateProfile = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PROFILE_LOADING,
                data: true
            })
            Authservices.updateProfile(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PROFILE_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PROFILE_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getProfile = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PROFILE_LOADING,
                data: true
            })
            Authservices.getProfile().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PROFILE_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PROFILE_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const updatePassword = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PASSWORD_LOADING,
                data: true
            })
            Authservices.updatePassword(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PASSWORD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PASSWORD_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}