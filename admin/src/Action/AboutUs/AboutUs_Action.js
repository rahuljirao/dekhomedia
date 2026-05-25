import {UPDATE_ABOUT_US_ERROR, UPDATE_ABOUT_US_LOADING, UPDATE_ABOUT_US_SUCCESS,  GET_ABOUT_US_ERROR, GET_ABOUT_US_LOADING, GET_ABOUT_US_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateAboutUs = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_ABOUT_US_LOADING,
                data: true
            })
            Authservices.updateAboutUs(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_ABOUT_US_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_ABOUT_US_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getAboutUs = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_ABOUT_US_LOADING,
                data: true
            })
            Authservices.getAboutUs().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_ABOUT_US_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_ABOUT_US_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}