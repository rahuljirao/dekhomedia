import { UPDATE_LANGUAGES_ERROR, UPDATE_LANGUAGES_LOADING, UPDATE_LANGUAGES_SUCCESS, GET_LANGUAGES_ERROR, GET_LANGUAGES_LOADING, GET_LANGUAGES_SUCCESS, ADD_LANGUAGES_ERROR, ADD_LANGUAGES_LOADING, ADD_LANGUAGES_SUCCESS, DELETE_LANGUAGES_ERROR, DELETE_LANGUAGES_LOADING, DELETE_LANGUAGES_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetLanguagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LANGUAGES_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_LANGUAGES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_LANGUAGES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateLanguagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LANGUAGES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_LANGUAGES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_LANGUAGES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddLanguagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_LANGUAGES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_LANGUAGES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_LANGUAGES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteLanguagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_LANGUAGES_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_LANGUAGES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_LANGUAGES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}