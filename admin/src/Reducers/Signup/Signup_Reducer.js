import { REGISTER_ERROR, REGISTER_LOADING, REGISTER_SUCCESS, SEND_CONFIRM_EMAIL_ERROR, SEND_CONFIRM_EMAIL_LOADING, SEND_CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_ERROR, CONFIRM_EMAIL_LOADING, CONFIRM_EMAIL_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const SignupReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_LOADING:
            return Object.assign({}, state, { loading: true })
        case REGISTER_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case REGISTER_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const SendConfirmationEmailReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_CONFIRM_EMAIL_LOADING:
            return Object.assign({}, state, { loading: true })
        case SEND_CONFIRM_EMAIL_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case SEND_CONFIRM_EMAIL_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const VerifyConfirmationEmailReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONFIRM_EMAIL_LOADING:
            return Object.assign({}, state, { loading: true })
        case CONFIRM_EMAIL_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case CONFIRM_EMAIL_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

