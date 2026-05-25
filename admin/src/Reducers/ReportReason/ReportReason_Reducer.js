import { UPDATE_REPORT_REASON_ERROR, UPDATE_REPORT_REASON_LOADING, UPDATE_REPORT_REASON_SUCCESS, GET_REPORT_REASON_ERROR, GET_REPORT_REASON_LOADING, GET_REPORT_REASON_SUCCESS, ADD_REPORT_REASON_ERROR, ADD_REPORT_REASON_LOADING, ADD_REPORT_REASON_SUCCESS, DELETE_REPORT_REASON_ERROR, DELETE_REPORT_REASON_LOADING, DELETE_REPORT_REASON_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetReportReasonReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REPORT_REASON_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_REPORT_REASON_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_REPORT_REASON_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const UpdateReportReasonReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_REPORT_REASON_LOADING:
            return Object.assign({}, state, { loading: true })
        case UPDATE_REPORT_REASON_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case UPDATE_REPORT_REASON_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const AddReportReasonReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REPORT_REASON_LOADING:
            return Object.assign({}, state, { loading: true })
        case ADD_REPORT_REASON_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case ADD_REPORT_REASON_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}

export const DeleteReportReasonReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_REPORT_REASON_LOADING:
            return Object.assign({}, state, { loading: true })
        case DELETE_REPORT_REASON_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case DELETE_REPORT_REASON_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}