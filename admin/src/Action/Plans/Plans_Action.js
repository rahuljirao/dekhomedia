import {UPDATE_PLANS_ERROR, UPDATE_PLANS_LOADING, UPDATE_PLANS_SUCCESS, ADD_PLANS_ERROR, ADD_PLANS_LOADING, ADD_PLANS_SUCCESS, GET_PLANS_ERROR, GET_PLANS_LOADING, GET_PLANS_SUCCESS, DELETE_PLANS_ERROR, DELETE_PLANS_LOADING, DELETE_PLANS_SUCCESS, UPDATE_IS_ACTIVE_PLAN_ERROR, UPDATE_IS_ACTIVE_PLAN_LOADING, UPDATE_IS_ACTIVE_PLAN_SUCCESS, GET_VIP_PLANS_ERROR, GET_VIP_PLANS_LOADING, GET_VIP_PLANS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getPlans = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_PLANS_LOADING,
                data: true
            })
            Authservices.getPlans(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_PLANS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_PLANS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addPlans = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_PLANS_LOADING,
                data: true
            })
            Authservices.addPlans(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_PLANS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_PLANS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updatePlans = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_PLANS_LOADING,
                data: true
            })
            Authservices.updatePlans(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_PLANS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_PLANS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deletePlans = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_PLANS_LOADING,
                data: true
            })
            Authservices.deletePlans(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_PLANS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_PLANS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateIsActivePlan = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_IS_ACTIVE_PLAN_LOADING,
                data: true
            })
            Authservices.updateIsActivePlan(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_IS_ACTIVE_PLAN_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_IS_ACTIVE_PLAN_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getVIPPlans = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_VIP_PLANS_LOADING,
                data: true
            })
            Authservices.getVipPlanList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_VIP_PLANS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_VIP_PLANS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}