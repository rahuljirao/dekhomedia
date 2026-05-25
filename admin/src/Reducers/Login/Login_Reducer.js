import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS, FORGET_PASSWORD_ERROR, FORGET_PASSWORD_LOADING, FORGET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR, RESET_PASSWORD_LOADING, RESET_PASSWORD_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_LOADING:
            return Object.assign({}, state, { loading: true })
        case LOGIN_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case LOGIN_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const ForgetPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case FORGET_PASSWORD_LOADING:
            return Object.assign({}, state, { loading: true })
        case FORGET_PASSWORD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case FORGET_PASSWORD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const ResetPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_PASSWORD_LOADING:
            return Object.assign({}, state, { loading: true })
        case RESET_PASSWORD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case RESET_PASSWORD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

