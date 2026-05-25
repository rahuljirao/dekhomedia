import {GET_USERS_DETAILS_ERROR, GET_USERS_DETAILS_LOADING, GET_USERS_DETAILS_SUCCESS, GET_USERS_LIST_ERROR, GET_USERS_LIST_LOADING, GET_USERS_LIST_SUCCESS, UPDATE_IS_BLOCKED_ERROR, UPDATE_IS_BLOCKED_LOADING, UPDATE_IS_BLOCKED_SUCCESS, GET_REWARD_HISTORY_ERROR, GET_REWARD_HISTORY_LOADING, GET_REWARD_HISTORY_SUCCESS, GET_PURCHASE_COIN_HISTORY_ERROR, GET_PURCHASE_COIN_HISTORY_LOADING, GET_PURCHASE_COIN_HISTORY_SUCCESS, GET_PURCHASE_VIP_HISTORY_ERROR, GET_PURCHASE_VIP_HISTORY_LOADING, GET_PURCHASE_VIP_HISTORY_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetUsersDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_USERS_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_USERS_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetUsersListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_LIST_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_USERS_LIST_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_USERS_LIST_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateIsBlockedUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_IS_BLOCKED_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_IS_BLOCKED_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_IS_BLOCKED_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}
export const GetRewardHistoryListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REWARD_HISTORY_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_REWARD_HISTORY_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_REWARD_HISTORY_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}
export const GetPurchaseCoinHistoryListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PURCHASE_COIN_HISTORY_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PURCHASE_COIN_HISTORY_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PURCHASE_COIN_HISTORY_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}
export const GetPurchaseVIPHistoryListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PURCHASE_VIP_HISTORY_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PURCHASE_VIP_HISTORY_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PURCHASE_VIP_HISTORY_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

