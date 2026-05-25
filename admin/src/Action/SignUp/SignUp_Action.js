import {REGISTER_ERROR, REGISTER_LOADING, REGISTER_SUCCESS, SEND_CONFIRM_EMAIL_ERROR, SEND_CONFIRM_EMAIL_LOADING, SEND_CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_ERROR, CONFIRM_EMAIL_LOADING, CONFIRM_EMAIL_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const signUp = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: REGISTER_LOADING,
                data: true
            })
            Authservices.signup(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: REGISTER_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: REGISTER_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const sendConfirmEmail = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: SEND_CONFIRM_EMAIL_LOADING,
                data: true
            })
            Authservices.sendConfirmEmail(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: SEND_CONFIRM_EMAIL_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: SEND_CONFIRM_EMAIL_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const verifyConfirmEmail = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: CONFIRM_EMAIL_LOADING,
                data: true
            })
            Authservices.verifyConfirmEmail(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: CONFIRM_EMAIL_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: CONFIRM_EMAIL_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}