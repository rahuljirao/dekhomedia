import {UPDATE_PRIVACY_POLICY_ERROR, UPDATE_PRIVACY_POLICY_LOADING, UPDATE_PRIVACY_POLICY_SUCCESS,  GET_PRIVACY_POLICY_ERROR, GET_PRIVACY_POLICY_LOADING, GET_PRIVACY_POLICY_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const updatePrivacyPolicy = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PRIVACY_POLICY_LOADING,
                data: true
            })
            Authservices.updatePrivacyPolicy(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PRIVACY_POLICY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PRIVACY_POLICY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getPrivacyPolicy = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PRIVACY_POLICY_LOADING,
                data: true
            })
            Authservices.getPrivacyPolicy().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PRIVACY_POLICY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PRIVACY_POLICY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}