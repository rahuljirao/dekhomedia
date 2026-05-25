import { VERIFY_LICENSE_ERROR, VERIFY_LICENSE_LOADING, VERIFY_LICENSE_SUCCESS, GET_LICENSE_ERROR, GET_LICENSE_LOADING, GET_LICENSE_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const verifyLicense = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: VERIFY_LICENSE_LOADING,
                data: true
            })
            Authservices.verifyLicense(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: VERIFY_LICENSE_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: VERIFY_LICENSE_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

export const getLicense = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_LICENSE_LOADING,
                data: true
            })
            Authservices.getLicense(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_LICENSE_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_LICENSE_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

