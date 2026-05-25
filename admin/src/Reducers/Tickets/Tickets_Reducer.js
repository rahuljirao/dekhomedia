import {  GET_TICKETS_ERROR, GET_TICKETS_LOADING, GET_TICKETS_SUCCESS, UPDATE_TICKET_STATUS_ERROR, UPDATE_TICKET_STATUS_LOADING, UPDATE_TICKET_STATUS_SUCCESS } from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetTicketListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TICKETS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_TICKETS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_TICKETS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateTicketStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TICKET_STATUS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_TICKET_STATUS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_TICKET_STATUS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}