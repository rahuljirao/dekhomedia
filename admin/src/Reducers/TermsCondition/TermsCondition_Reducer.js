import { UPDATE_TERMS_CONDITIONS_ERROR, UPDATE_TERMS_CONDITIONS_LOADING, UPDATE_TERMS_CONDITIONS_SUCCESS, GET_TERMS_CONDITIONS_ERROR, GET_TERMS_CONDITIONS_LOADING, GET_TERMS_CONDITIONS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateTermsConditionReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TERMS_CONDITIONS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_TERMS_CONDITIONS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_TERMS_CONDITIONS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetTermsConditionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TERMS_CONDITIONS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_TERMS_CONDITIONS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_TERMS_CONDITIONS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

