import { UPDATE_TAGS_ERROR, UPDATE_TAGS_LOADING, UPDATE_TAGS_SUCCESS, GET_TAGS_ERROR, GET_TAGS_LOADING, GET_TAGS_SUCCESS, ADD_TAGS_ERROR, ADD_TAGS_LOADING, ADD_TAGS_SUCCESS, DELETE_TAGS_ERROR, DELETE_TAGS_LOADING, DELETE_TAGS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetTagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TAGS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_TAGS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_TAGS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateTagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TAGS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_TAGS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_TAGS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddTagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TAGS_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_TAGS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_TAGS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteTagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_TAGS_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_TAGS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_TAGS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}