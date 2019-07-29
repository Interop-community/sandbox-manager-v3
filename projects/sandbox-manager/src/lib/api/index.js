import { goHome, setGlobalError, showGlobalSessionModal } from '../../redux/action-creators';

export default {
    post (url, data, dispatch, isFormData, type = "application/json") {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("POST", data, isFormData, type))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    postNoErrorManagement (url, data, dispatch, isFormData) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("POST", data, isFormData))
                .then(response => parseResponse(response, dispatch, resolve, reject, true))
                .catch(e => parseError(e, dispatch, reject, true));
        });
    },

    put (url, data, dispatch, isFormData, type = "application/json") {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("PUT", data, isFormData, type))
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    },

    getNoErrorManagement (url, dispatch) {
        return new Promise((resolve, reject) => {
            fetch(url, get_config("GET"))
                .then(response => parseResponse(response, dispatch, resolve, reject, true))
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
                .then(response => parseResponse(response, dispatch, resolve, reject))
                .catch(e => parseError(e, dispatch, reject));
        });
    }
};

// Helpers

const get_config = (method, data, isFormData, contentType = "application/json") => {
    let CONFIG = {
        headers: {
            Authorization: window.fhirClient && window.fhirClient.server && window.fhirClient.server.auth ? `BEARER ${window.fhirClient.server.auth.token}` : undefined,
            Accept: "application/json",
            "Content-Type": contentType
        },
        method
    };

    if (data) {
        CONFIG.body = JSON.stringify(data);
        if (isFormData) {
            contentType === "application/json" && delete CONFIG.headers['Content-Type'];
            CONFIG.body = data;
        }

        console.log(CONFIG);
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

const parseResponse = (response, dispatch, resolve, reject, noGlobalError = false) => {

    // TMP CODE HERE TO EASE THE USERS DURING THE UPGRADE PROCESS
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    if (response.status === 500) {
        // check the sandbox version
        fetch(sessionStorage.sandboxApiEndpointCheck)
            .then(tmp => tmp.json()
                .then(indexData => {
                    if (indexData.apiEndpointIndex !== sessionStorage.sandboxApiEndpointIndex) {
                        goHome();
                    }
                }));
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // TMP CODE HERE TO EASE THE USERS DURING THE UPGRADE PROCESS

    if (response.status === 404) {
        dispatch(setGlobalError(`Resource "${url}" not found!`));
        reject('Not found!');
    } else if (!noGlobalError && response.status >= 300) {
        response.text()
            .then(a => {
                try {
                    let parsed = JSON.parse(a);
                    if (parsed.error && parsed.error === 'invalid_token') {
                        dispatch(showGlobalSessionModal());
                        setTimeout(goHome, 3000);
                    } else if (parsed.message) {
                        !noGlobalError && dispatch(setGlobalError(JSON.stringify(parsed)));
                    } else if (parsed.issue) {
                        let issue = parsed.issue.map(i => i.diagnostics) || [];
                        !noGlobalError && dispatch(setGlobalError(issue.join('\n')));
                    }
                    reject();
                } catch (e) {
                    if (a.indexOf('User not authorized to perform this action') >= 0) {
                        dispatch(showGlobalSessionModal());
                        setTimeout(goHome, 3000);
                    } else {
                        !noGlobalError && dispatch(setGlobalError(a));
                    }
                    reject();
                }
            })
            .catch(e => {
                !noGlobalError && dispatch(setGlobalError(e));
                reject();
            });
    } else {
        response.json()
            .then(terms => resolve(terms))
            .catch(e => {
                if (response.status < 300) {
                    resolve(e);
                } else {
                    !noGlobalError && dispatch(setGlobalError(e));
                    reject(e);
                }
            })
    }
};

const parseError = (error, dispatch, reject, noGlobalError = false) => {
    !noGlobalError && dispatch(setGlobalError(error));
    reject(error);
};
