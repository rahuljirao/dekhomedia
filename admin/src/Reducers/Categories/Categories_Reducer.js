import { UPDATE_CATEGORIES_ERROR, UPDATE_CATEGORIES_LOADING, UPDATE_CATEGORIES_SUCCESS, GET_CATEGORIES_ERROR, GET_CATEGORIES_LOADING, GET_CATEGORIES_SUCCESS, ADD_CATEGORIES_ERROR, ADD_CATEGORIES_LOADING, ADD_CATEGORIES_SUCCESS, DELETE_CATEGORIES_ERROR, DELETE_CATEGORIES_LOADING, DELETE_CATEGORIES_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CATEGORIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_CATEGORIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_CATEGORIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CATEGORIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_CATEGORIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_CATEGORIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CATEGORIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_CATEGORIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_CATEGORIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_CATEGORIES_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_CATEGORIES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_CATEGORIES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}