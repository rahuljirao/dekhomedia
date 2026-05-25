import { GET_DASHBOARD_DETAILS_ERROR, GET_DASHBOARD_DETAILS_LOADING, GET_DASHBOARD_DETAILS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getDashboardDetails = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_DASHBOARD_DETAILS_LOADING,
                data: true
            })
            Authservices.getDashboardDetails().then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_DASHBOARD_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_DASHBOARD_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

