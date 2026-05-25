import {UPDATE_PAYMENT_METHOD_ERROR, UPDATE_PAYMENT_METHOD_LOADING, UPDATE_PAYMENT_METHOD_SUCCESS, UPDATE_PAYMENT_METHOD_STATUS_ERROR, UPDATE_PAYMENT_METHOD_STATUS_LOADING, UPDATE_PAYMENT_METHOD_STATUS_SUCCESS, ADD_PAYMENT_METHOD_ERROR, ADD_PAYMENT_METHOD_LOADING, ADD_PAYMENT_METHOD_SUCCESS, GET_PAYMENT_METHOD_ERROR, GET_PAYMENT_METHOD_LOADING, GET_PAYMENT_METHOD_SUCCESS, DELETE_PAYMENT_METHOD_ERROR, DELETE_PAYMENT_METHOD_LOADING, DELETE_PAYMENT_METHOD_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getPaymentMethod = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PAYMENT_METHOD_LOADING,
                data: true
            })
            Authservices.getPaymentMethod(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PAYMENT_METHOD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PAYMENT_METHOD_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addPaymentMethod = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_PAYMENT_METHOD_LOADING,
                data: true
            })
            Authservices.addPaymentMethod(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_PAYMENT_METHOD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_PAYMENT_METHOD_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deletePaymentMethod = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_PAYMENT_METHOD_LOADING,
                data: true
            })
            Authservices.deletePaymentMethod(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_PAYMENT_METHOD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_PAYMENT_METHOD_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updatePaymentMethod = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PAYMENT_METHOD_LOADING,
                data: true
            })
            Authservices.updatePaymentMethod(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PAYMENT_METHOD_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PAYMENT_METHOD_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updatePaymentMethodStatus = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PAYMENT_METHOD_STATUS_LOADING,
                data: true
            })
            Authservices.updatePaymentMethodStatus(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PAYMENT_METHOD_STATUS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PAYMENT_METHOD_STATUS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}