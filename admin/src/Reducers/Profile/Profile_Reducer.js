import { UPDATE_PROFILE_ERROR, UPDATE_PROFILE_LOADING, UPDATE_PROFILE_SUCCESS, GET_PROFILE_ERROR, GET_PROFILE_LOADING, GET_PROFILE_SUCCESS, UPDATE_PASSWORD_LOADING, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_ERROR} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PROFILE_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PROFILE_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PROFILE_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PROFILE_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PROFILE_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdatePasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PASSWORD_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PASSWORD_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PASSWORD_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

