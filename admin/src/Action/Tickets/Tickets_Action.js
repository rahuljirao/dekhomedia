import { GET_TICKETS_ERROR, GET_TICKETS_LOADING, GET_TICKETS_SUCCESS, UPDATE_TICKET_STATUS_ERROR, UPDATE_TICKET_STATUS_LOADING, UPDATE_TICKET_STATUS_SUCCESS } from "../Type";
import * as Authservices from '../../Services/services';

export const getTicketList = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_TICKETS_LOADING,
                data: true
            })
            Authservices.getTicketList(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_TICKETS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_TICKETS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateTicketStatus = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_TICKET_STATUS_LOADING,
                data: true
            })
            Authservices.updateTicketStatus(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_TICKET_STATUS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_TICKET_STATUS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}