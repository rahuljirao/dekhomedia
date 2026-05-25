import { UPDATE_PAYMENT_METHOD_STATUS_ERROR, UPDATE_PAYMENT_METHOD_STATUS_LOADING, UPDATE_PAYMENT_METHOD_STATUS_SUCCESS, UPDATE_PAYMENT_METHOD_ERROR, UPDATE_PAYMENT_METHOD_LOADING, UPDATE_PAYMENT_METHOD_SUCCESS, ADD_PAYMENT_METHOD_ERROR, ADD_PAYMENT_METHOD_LOADING, ADD_PAYMENT_METHOD_SUCCESS, GET_PAYMENT_METHOD_ERROR, GET_PAYMENT_METHOD_LOADING, GET_PAYMENT_METHOD_SUCCESS, DELETE_PAYMENT_METHOD_ERROR, DELETE_PAYMENT_METHOD_LOADING, DELETE_PAYMENT_METHOD_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetPaymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PAYMENT_METHOD_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PAYMENT_METHOD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PAYMENT_METHOD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdatePaymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PAYMENT_METHOD_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PAYMENT_METHOD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PAYMENT_METHOD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeletePaymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_PAYMENT_METHOD_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_PAYMENT_METHOD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_PAYMENT_METHOD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddPaymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PAYMENT_METHOD_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_PAYMENT_METHOD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_PAYMENT_METHOD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdatePaymentMethodStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PAYMENT_METHOD_STATUS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PAYMENT_METHOD_STATUS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PAYMENT_METHOD_STATUS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}