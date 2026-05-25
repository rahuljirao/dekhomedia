import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS, FORGET_PASSWORD_ERROR, FORGET_PASSWORD_LOADING, FORGET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR, RESET_PASSWORD_LOADING, RESET_PASSWORD_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const login = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: LOGIN_LOADING,
                data: true
            })
            Authservices.login(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: LOGIN_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const forgetPassword = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: FORGET_PASSWORD_LOADING,
                data: true
            })
            Authservices.forgetPassword(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: FORGET_PASSWORD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: FORGET_PASSWORD_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const resetPassword = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: RESET_PASSWORD_LOADING,
                data: true
            })
            Authservices.resetPassword(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: RESET_PASSWORD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: RESET_PASSWORD_ERROR,
                        data: error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}