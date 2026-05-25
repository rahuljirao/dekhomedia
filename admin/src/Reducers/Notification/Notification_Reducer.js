import { SEND_NOTIFICATION_ERROR, SEND_NOTIFICATION_LOADING, SEND_NOTIFICATION_SUCCESS} from "../../Action/Type";

const initialState = {
    payload: {},
    loading: false,
    error: ''
}

export const SendNotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_NOTIFICATION_LOADING:
            return Object.assign({}, state, { loading: true })
        case SEND_NOTIFICATION_SUCCESS:
            return Object.assign({}, state, { payload: action.data, loading: false })
        case SEND_NOTIFICATION_ERROR:
            return Object.assign({}, state, { payload: action.data, loading: false })
        default:
            return state
    }
}