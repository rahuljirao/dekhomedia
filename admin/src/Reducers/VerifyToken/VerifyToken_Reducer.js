import { VERIFY_TOKEN_ERROR, VERIFY_TOKEN_LOADING, VERIFY_TOKEN_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const VerifyTokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case VERIFY_TOKEN_LOADING:
            return Object.assign({}, state, { loading: true })
        case VERIFY_TOKEN_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case VERIFY_TOKEN_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}