import { UPDATE_SERIES_ERROR, UPDATE_SERIES_LOADING, UPDATE_SERIES_SUCCESS, UPDATE_ACTIVE_SERIES_ERROR, UPDATE_ACTIVE_SERIES_LOADING, UPDATE_ACTIVE_SERIES_SUCCESS, UPDATE_RECOMMANDED_SERIES_ERROR, UPDATE_RECOMMANDED_SERIES_LOADING, UPDATE_RECOMMANDED_SERIES_SUCCESS, UPDATE_FREE_SERIES_ERROR, UPDATE_FREE_SERIES_LOADING, UPDATE_FREE_SERIES_SUCCESS, GET_SERIES_DETAILS_ERROR, GET_SERIES_DETAILS_LOADING, GET_SERIES_DETAILS_SUCCESS, GET_SERIES_ERROR, GET_SERIES_LOADING, GET_SERIES_SUCCESS, ADD_SERIES_ERROR, ADD_SERIES_LOADING, ADD_SERIES_SUCCESS, DELETE_SERIES_ERROR, DELETE_SERIES_LOADING, DELETE_SERIES_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const GetSeriesDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SERIES_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_SERIES_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_SERIES_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateRecommandedSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_RECOMMANDED_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_RECOMMANDED_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_RECOMMANDED_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateActiveSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_ACTIVE_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_ACTIVE_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateFreeSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_FREE_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_FREE_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_FREE_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteSeriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_SERIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_SERIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_SERIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}