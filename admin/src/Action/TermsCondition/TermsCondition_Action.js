import {UPDATE_TERMS_CONDITIONS_ERROR, UPDATE_TERMS_CONDITIONS_LOADING, UPDATE_TERMS_CONDITIONS_SUCCESS,  GET_TERMS_CONDITIONS_ERROR, GET_TERMS_CONDITIONS_LOADING, GET_TERMS_CONDITIONS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updateTermsCondition = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_TERMS_CONDITIONS_LOADING,
                data: true
            })
            Authservices.updateTermsCondition(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_TERMS_CONDITIONS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_TERMS_CONDITIONS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getTermsCondition = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_TERMS_CONDITIONS_LOADING,
                data: true
            })
            Authservices.getTermsCondition().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_TERMS_CONDITIONS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_TERMS_CONDITIONS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}