import { UPDATE_SOCIAL_LINKS_ERROR, UPDATE_SOCIAL_LINKS_LOADING, UPDATE_SOCIAL_LINKS_SUCCESS, GET_SOCIAL_LINKS_ERROR, GET_SOCIAL_LINKS_LOADING, GET_SOCIAL_LINKS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const UpdateSocialLinksReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SOCIAL_LINKS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_SOCIAL_LINKS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_SOCIAL_LINKS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetSocialLinksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SOCIAL_LINKS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_SOCIAL_LINKS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_SOCIAL_LINKS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

