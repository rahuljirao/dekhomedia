import { GET_DASHBOARD_DETAILS_ERROR, GET_DASHBOARD_DETAILS_LOADING, GET_DASHBOARD_DETAILS_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const GetDashboardDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DASHBOARD_DETAILS_LOADING:
            return Object.assign({}, state, { loading: true })
        case GET_DASHBOARD_DETAILS_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case GET_DASHBOARD_DETAILS_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}