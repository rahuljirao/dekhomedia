import { VERIFY_TOKEN_ERROR, VERIFY_TOKEN_LOADING, VERIFY_TOKEN_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const verifyToken = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: VERIFY_TOKEN_LOADING,
                data: true
            })
            Authservices.verifyToken(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: VERIFY_TOKEN_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: VERIFY_TOKEN_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}

