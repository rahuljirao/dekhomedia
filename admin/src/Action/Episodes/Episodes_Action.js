import {UPDATE_EPISODES_ERROR, UPDATE_EPISODES_LOADING, UPDATE_EPISODES_SUCCESS, ADD_MULTIPLE_EPISODES_ERROR, ADD_MULTIPLE_EPISODES_LOADING, ADD_MULTIPLE_EPISODES_SUCCESS, ADD_EPISODES_ERROR, ADD_EPISODES_LOADING, ADD_EPISODES_SUCCESS, GET_EPISODES_ERROR, GET_EPISODES_LOADING, GET_EPISODES_SUCCESS, GET_EPISODES_DETAILS_ERROR, GET_EPISODES_DETAILS_LOADING, GET_EPISODES_DETAILS_SUCCESS, DELETE_EPISODES_ERROR, DELETE_EPISODES_LOADING, DELETE_EPISODES_SUCCESS, ADD_EPISODES_URLS_ERROR, ADD_EPISODES_URLS_LOADING, ADD_EPISODES_URLS_SUCCESS} from "../Type";
import * as Authservices from '../../Services/services';

export const getEpisodes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_EPISODES_LOADING,
                data: true
            })
            Authservices.getEpisodes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_EPISODES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_EPISODES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const getEpisodesDetails = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: GET_EPISODES_DETAILS_LOADING,
                data: true
            })
            Authservices.getEpisodesDetails(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: GET_EPISODES_DETAILS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: GET_EPISODES_DETAILS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addEpisodes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_EPISODES_LOADING,
                data: true
            })
            Authservices.addEpisodes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_EPISODES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_EPISODES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addMultipleEpisodes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_MULTIPLE_EPISODES_LOADING,
                data: true
            })
            Authservices.addMultipleEpisodes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_MULTIPLE_EPISODES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_MULTIPLE_EPISODES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const addEpisodesUrls = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_EPISODES_URLS_LOADING,
                data: true
            })
            Authservices.addEpisodesUrl(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: ADD_EPISODES_URLS_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: ADD_EPISODES_URLS_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const updateEpisodes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_EPISODES_LOADING,
                data: true
            })
            Authservices.updateEpisodes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: UPDATE_EPISODES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: UPDATE_EPISODES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}
export const deleteEpisodes = (data) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: DELETE_EPISODES_LOADING,
                data: true
            })
            Authservices.deleteEpisodes(data).then((data) => {
                if (data?.status === 200) {
                    dispatch({
                        type: DELETE_EPISODES_SUCCESS,
                        data: data?.data
                    })
                    return resolve(data?.data);
                }
            }).catch((error) => {
                if (error) {
                    dispatch({
                        type: DELETE_EPISODES_ERROR,
                        data: error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.responseMessage
                    })
                }
                return reject(error?.response?.data)
            })
        })
    }
}