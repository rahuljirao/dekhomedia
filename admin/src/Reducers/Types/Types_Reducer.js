import { UPDATE_TYPES_ERROR, UPDATE_TYPES_LOADING, UPDATE_TYPES_SUCCESS, GET_TYPES_ERROR, GET_TYPES_LOADING, GET_TYPES_SUCCESS, ADD_TYPES_ERROR, ADD_TYPES_LOADING, ADD_TYPES_SUCCESS, DELETE_TYPES_ERROR, DELETE_TYPES_LOADING, DELETE_TYPES_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TYPES_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_TYPES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_TYPES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TYPES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_TYPES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_TYPES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TYPES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_TYPES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_TYPES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_TYPES_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_TYPES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_TYPES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}