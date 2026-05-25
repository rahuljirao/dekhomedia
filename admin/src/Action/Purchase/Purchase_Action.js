import { GET_VIP_PURCHASE_HISTORY_ERROR, GET_VIP_PURCHASE_HISTORY_LOADING, GET_VIP_PURCHASE_HISTORY_SUCCESS, GET_COIN_PURCHASE_HISTORY_ERROR, GET_COIN_PURCHASE_HISTORY_LOADING, GET_COIN_PURCHASE_HISTORY_SUCCESS } from "../Type";
import * as Authservices from '../../Services/services';

export const getCoinPurchaseHistory = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_VIP_PURCHASE_HISTORY_LOADING,
                data: true
            })
            Authservices.getCoinPlanOrderList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_VIP_PURCHASE_HISTORY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_VIP_PURCHASE_HISTORY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getVIPPurchaseHistory = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_COIN_PURCHASE_HISTORY_LOADING,
                data: true
            })
            Authservices.getVipPlanOrderList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_COIN_PURCHASE_HISTORY_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_COIN_PURCHASE_HISTORY_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}