import { UPDATE_PLANS_ERROR, UPDATE_PLANS_LOADING, UPDATE_PLANS_SUCCESS, GET_PLANS_ERROR, GET_PLANS_LOADING, GET_PLANS_SUCCESS, ADD_PLANS_ERROR, ADD_PLANS_LOADING, ADD_PLANS_SUCCESS, DELETE_PLANS_ERROR, DELETE_PLANS_LOADING, DELETE_PLANS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetPlansReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PLANS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_PLANS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_PLANS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdatePlansReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PLANS_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_PLANS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_PLANS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddPlansReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PLANS_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_PLANS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_PLANS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeletePlansReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_PLANS_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_PLANS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_PLANS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}