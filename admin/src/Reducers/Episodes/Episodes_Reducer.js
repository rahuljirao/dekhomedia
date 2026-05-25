import { UPDATE_EPISODES_ERROR, UPDATE_EPISODES_LOADING, UPDATE_EPISODES_SUCCESS, GET_EPISODES_ERROR, GET_EPISODES_LOADING, GET_EPISODES_SUCCESS, ADD_MULTIPLE_EPISODES_ERROR, ADD_MULTIPLE_EPISODES_LOADING, ADD_MULTIPLE_EPISODES_SUCCESS, ADD_EPISODES_ERROR, ADD_EPISODES_LOADING, ADD_EPISODES_SUCCESS, DELETE_EPISODES_ERROR, DELETE_EPISODES_LOADING, DELETE_EPISODES_SUCCESS, ADD_EPISODES_URLS_ERROR, ADD_EPISODES_URLS_LOADING, ADD_EPISODES_URLS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetEpisodesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EPISODES_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_EPISODES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_EPISODES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateEpisodesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_EPISODES_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_EPISODES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_EPISODES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddEpisodesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EPISODES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_EPISODES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_EPISODES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddMultipleEpisodesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MULTIPLE_EPISODES_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_MULTIPLE_EPISODES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_MULTIPLE_EPISODES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddEpisodesUrlsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EPISODES_URLS_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_EPISODES_URLS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_EPISODES_URLS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteEpisodesReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EPISODES_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_EPISODES_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_EPISODES_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}