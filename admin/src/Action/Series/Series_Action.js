import {UPDATE_SERIES_ERROR, UPDATE_SERIES_LOADING, UPDATE_SERIES_SUCCESS, UPDATE_ACTIVE_SERIES_ERROR, UPDATE_ACTIVE_SERIES_LOADING, UPDATE_ACTIVE_SERIES_SUCCESS, UPDATE_RECOMMANDED_SERIES_ERROR, UPDATE_RECOMMANDED_SERIES_LOADING, UPDATE_RECOMMANDED_SERIES_SUCCESS, UPDATE_FREE_SERIES_ERROR, UPDATE_FREE_SERIES_LOADING, UPDATE_FREE_SERIES_SUCCESS, ADD_SERIES_ERROR, ADD_SERIES_LOADING, ADD_SERIES_SUCCESS, GET_SERIES_ERROR, GET_SERIES_LOADING, GET_SERIES_SUCCESS, GET_SERIES_DETAILS_ERROR, GET_SERIES_DETAILS_LOADING, GET_SERIES_DETAILS_SUCCESS, DELETE_SERIES_ERROR, DELETE_SERIES_LOADING, DELETE_SERIES_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_SERIES_LOADING,
                data: true
            })
            Authservices.getSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getSeriesDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_SERIES_DETAILS_LOADING,
                data: true
            })
            Authservices.getSeriesDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_SERIES_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_SERIES_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_SERIES_LOADING,
                data: true
            })
            Authservices.addSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_SERIES_LOADING,
                data: true
            })
            Authservices.updateSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateRecommandedSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_RECOMMANDED_SERIES_LOADING,
                data: true
            })
            Authservices.updateRecommandedSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_RECOMMANDED_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_RECOMMANDED_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateFreeSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_FREE_SERIES_LOADING,
                data: true
            })
            Authservices.updateFreeSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_FREE_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_FREE_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateActiveSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_ACTIVE_SERIES_LOADING,
                data: true
            })
            Authservices.updateActiveSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_ACTIVE_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_ACTIVE_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteSeries = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_SERIES_LOADING,
                data: true
            })
            Authservices.deleteSeries(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_SERIES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_SERIES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}