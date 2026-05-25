import {UPDATE_SOCIAL_LINKS_ERROR, UPDATE_SOCIAL_LINKS_LOADING, UPDATE_SOCIAL_LINKS_SUCCESS,  GET_SOCIAL_LINKS_ERROR, GET_SOCIAL_LINKS_LOADING, GET_SOCIAL_LINKS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateSocialLinks = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_SOCIAL_LINKS_LOADING,
                data: true
            })
            Authservices.updateSocialLinks(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_SOCIAL_LINKS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_SOCIAL_LINKS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getSocialLinks = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_SOCIAL_LINKS_LOADING,
                data: true
            })
            Authservices.getSocialLinks().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_SOCIAL_LINKS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_SOCIAL_LINKS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}