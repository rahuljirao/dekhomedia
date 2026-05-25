import { GET_ADS_PLATFORM_ERROR, GET_ADS_PLATFORM_LOADING, GET_ADS_PLATFORM_SUCCESS, UPDATE_STATUS_ADS_PLATFORM_ERROR, UPDATE_STATUS_ADS_PLATFORM_LOADING, UPDATE_STATUS_ADS_PLATFORM_SUCCESS, GET_ADS_PLATFORM_DETAILS_ERROR, GET_ADS_PLATFORM_DETAILS_LOADING, GET_ADS_PLATFORM_DETAILS_SUCCESS, UPDATE_ADS_PLATFORM_DETAILS_ERROR, UPDATE_ADS_PLATFORM_DETAILS_LOADING, UPDATE_ADS_PLATFORM_DETAILS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetAdsPLatformListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADS_PLATFORM_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_ADS_PLATFORM_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_ADS_PLATFORM_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateAdsPLatformStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATUS_ADS_PLATFORM_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_STATUS_ADS_PLATFORM_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_STATUS_ADS_PLATFORM_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}
export const GetAdsPlatformDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADS_PLATFORM_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_ADS_PLATFORM_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_ADS_PLATFORM_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateAdsPlatformDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ADS_PLATFORM_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_ADS_PLATFORM_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_ADS_PLATFORM_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}