import { UPDATE_ABOUT_US_ERROR, UPDATE_ABOUT_US_LOADING, UPDATE_ABOUT_US_SUCCESS, GET_ABOUT_US_ERROR, GET_ABOUT_US_LOADING, GET_ABOUT_US_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateAboutUsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ABOUT_US_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_ABOUT_US_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_ABOUT_US_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetAboutUsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ABOUT_US_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_ABOUT_US_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_ABOUT_US_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

