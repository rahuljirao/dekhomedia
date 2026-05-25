import { UPDATE_FAQ_ERROR, UPDATE_FAQ_LOADING, UPDATE_FAQ_SUCCESS, GET_FAQ_ERROR, GET_FAQ_LOADING, GET_FAQ_SUCCESS, ADD_FAQ_ERROR, ADD_FAQ_LOADING, ADD_FAQ_SUCCESS, DELETE_FAQ_ERROR, DELETE_FAQ_LOADING, DELETE_FAQ_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetFAQReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_FAQ_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_FAQ_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_FAQ_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateFAQReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_FAQ_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_FAQ_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_FAQ_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddFAQReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FAQ_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_FAQ_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_FAQ_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteFAQReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_FAQ_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_FAQ_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_FAQ_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}