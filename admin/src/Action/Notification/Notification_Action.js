import { SEND_NOTIFICATION_ERROR, SEND_NOTIFICATION_LOADING, SEND_NOTIFICATION_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const sendNotification = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: SEND_NOTIFICATION_LOADING,
                data: true
            })
            Authservices.sendNotification(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: SEND_NOTIFICATION_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: SEND_NOTIFICATION_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

