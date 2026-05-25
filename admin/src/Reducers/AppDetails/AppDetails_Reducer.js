import { UPDATE_APP_DETAILS_ERROR, UPDATE_APP_DETAILS_LOADING, UPDATE_APP_DETAILS_SUCCESS, GET_APP_DETAILS_ERROR, GET_APP_DETAILS_LOADING, GET_APP_DETAILS_SUCCESS, UPDATE_APP_CURRENCY_DETAILS_ERROR, UPDATE_APP_CURRENCY_DETAILS_LOADING, UPDATE_APP_CURRENCY_DETAILS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateAppDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_APP_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_APP_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_APP_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateAppCurrencyDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_APP_CURRENCY_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_APP_CURRENCY_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_APP_CURRENCY_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetAppDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_APP_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_APP_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_APP_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

