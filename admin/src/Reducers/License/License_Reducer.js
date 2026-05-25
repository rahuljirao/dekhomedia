import { VERIFY_LICENSE_ERROR, VERIFY_LICENSE_LOADING, VERIFY_LICENSE_SUCCESS, GET_LICENSE_ERROR, GET_LICENSE_LOADING, GET_LICENSE_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const VerifyLicenseReducer = (state = initialState, action) => {
    switch (action.type) {
        case VERIFY_LICENSE_LOADING:
            return Object.assign({}, state, { loading: true })
        case VERIFY_LICENSE_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case VERIFY_LICENSE_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetLicenseReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LICENSE_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_LICENSE_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_LICENSE_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}