import { UPDATE_SITE_DETAILS_ERROR, UPDATE_SITE_DETAILS_LOADING, UPDATE_SITE_DETAILS_SUCCESS, GET_SITE_DETAILS_ERROR, GET_SITE_DETAILS_LOADING, GET_SITE_DETAILS_SUCCESS, SITE_DATA_ERROR, SITE_DATA_LOADING, SITE_DATA_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateSiteDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SITE_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_SITE_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_SITE_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetSiteDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SITE_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_SITE_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_SITE_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetSiteDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SITE_DATA_LOADING:
            return Object.assign({}, state, { loading: true })
        case SITE_DATA_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case SITE_DATA_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

