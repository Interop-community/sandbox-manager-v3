import { setGlobalError } from '../../redux/action-creators';

export default {
    post (url, data, dispatch, isFormData) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("POST", data, isFormData))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    put (url, data, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("PUT", data))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    get (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("GET"))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    getNoAuth (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config_no_auth("GET"))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => reject(e));
        });
    },

    delete (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("DELETE"))
                .then(() => resolve())
                .catch(e => parseError(e, dispatch, reject));
        });
    }
};

// Helpers

const get_config = (method, data, isFormData) => {
    let CONFIG = {
        headers: {
            Authorization: window.fhirClient && window.fhirClient.server && window.fhirClient.server.auth ? `BEARER ${window.fhirClient.server.auth.token}` : undefined,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method
    };

    if (data) {
        CONFIG.body = JSON.stringify(data);
        if (isFormData) {
            delete CONFIG.headers['Content-Type'];
            CONFIG.body = data;
        }
    }

    return CONFIG;
};

const get_config_no_auth = (method, data, isFormData) => {
    let CONFIG = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method
    };

    if (data) {
        CONFIG.body = JSON.stringify(data);
        if (isFormData) {
            delete CONFIG.headers['Content-Type'];
            CONFIG.body = data;
        }
    }

    return CONFIG;
};

const parseResponse = (response, dispatch, resolve, reject) => {
    if (response.status === 404) {
        dispatch(setGlobalError(`Resource "${url}" not found!`));
        reject();
    } else if (response.status >= 300) {
        response.text()
            .then(a => {
                dispatch(setGlobalError(a));
            })
            .catch(e => {
                dispatch(setGlobalError(e));
            });
        reject();
    } else {
        response.json()
            .then(terms => resolve(terms))
            .catch(e => {
                if (response.status < 300) {
                    resolve();
                } else {
                    dispatch(setGlobalError(e));
                    reject();
                }
            })
    }
};

const parseError = (error, dispatch, reject) => {
    dispatch(setGlobalError(error));
    reject();
};