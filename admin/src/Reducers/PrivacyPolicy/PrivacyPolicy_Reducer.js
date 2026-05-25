import { UPDATE_PRIVACY_POLICY_ERROR, UPDATE_PRIVACY_POLICY_LOADING, UPDATE_PRIVACY_POLICY_SUCCESS, GET_PRIVACY_POLICY_ERROR, GET_PRIVACY_POLICY_LOADING, GET_PRIVACY_POLICY_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdatePrivacyPolicyReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRIVACY_POLICY_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PRIVACY_POLICY_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PRIVACY_POLICY_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetPrivacyPolicyReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PRIVACY_POLICY_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PRIVACY_POLICY_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PRIVACY_POLICY_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

