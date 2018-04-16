import * as actionTypes from './types';
import { authorize } from './fhirauth';

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const selectSandboxById = (sandboxId) => {
    localStorage.setItem('sandboxId', sandboxId);
    return {
        type: actionTypes.SELECT_SANDBOX,
        sandboxId: sandboxId
    }
};

export const removeUser = (userId) => {
    return {
        type: actionTypes.REMOVE_SANDBOX_USER,
        userId: userId
    }
};

export const inviteNewUser = (email) => {
    return {
        type: actionTypes.INVITE_NEW_USER,
        email: email
    }
};

export const deleteSandbox = (sandboxId) => {
    return {
        type: actionTypes.DELETE_SANDBOX,
        sandboxId: sandboxId
    };
};

export const resetSandbox = (sandboxId) => {
    return {
        type: actionTypes.RESET_SANDBOX,
        sandboxId: sandboxId
    }
};

export const updateSandbox = (sandboxDetails) => {
    return {
        type: actionTypes.UPDATE_SANDBOX,
        sandboxDetails: sandboxDetails
    }
};

export const fetchSandboxesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOXES_START
    };
};

export const fetchSandboxInvitesStart = () => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_START
    };
};

export const fetchSandboxesSuccess = (sandboxes) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_SUCCESS,
        sandboxes: sandboxes
    }
};

export const fetchSandboxInvitesSuccess = (invitations) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_SUCCESS,
        invitations: invitations
    }
};

export const fetchSandboxesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOXES_FAIL,
        error: error
    }
};

export const fetchSandboxInvitesFail = (error) => {
    return {
        type: actionTypes.FETCH_SANDBOX_INVITES_FAIL,
        error: error
    }
};

export const createSandboxStart = () => {
    return {
        type: actionTypes.CREATE_SANDBOX_START
    }
};

export const createSandboxFail = (error) => {
    return {
        type: actionTypes.CREATE_SANDBOX_FAIL,
        error: error
    }
};

export const createSandboxSuccess = (sandbox) => {
    return {
        type: actionTypes.CREATE_SANDBOX_SUCCESS,
        sandbox: sandbox
    }
};

export const lookupSandboxByIdStart = () => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_START
    }
};

export const lookupSandboxByIdFail = (error) => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL,
        error: error
    }
};

export const lookupSandboxByIdSuccess = (sandboxes) => {
    return {
        type: actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS,
        sandboxes: sandboxes
    }
};

export const setDefaultSandboxUser = (user) => {
    return {
        type: actionTypes.SET_DEFAULT_SANDBOX_USER,
        payload: { user }
    }
};


const getConfig = (_state) => {
    return {
        headers: {
            Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    };
};

const setDefaultUrl = (sandboxId) => {
    return {
        type: actionTypes.SET_FHIR_SERVER_URL,
        sandboxId: sandboxId
    }
};

export const selectSandbox = (sandboxId) => {
    return (dispatch, getState) => {
        let state = getState();
        let queryParams = "?userId=" + encodeURIComponent(state.users.oauthUser.sbmUserId);

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token
            }
        };
        fetch(configuration.sandboxManagerApiUrl + '/sandbox/' + sandboxId + "/login" + queryParams, Object.assign({ method: "POST" }, config))
            .then(() => {
                dispatch(authorizeSandbox(sandboxId));
                dispatch(setDefaultUrl(sandboxId));
                dispatch(selectSandboxById(sandboxId));
                dispatch(getDefaultUserForSandbox(sandboxId))
            });
    };

};

export function getDefaultUserForSandbox (sandboxId) {
    return (dispatch, getState) => {
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        const config = {
            headers: {
                Authorization: 'BEARER ' + window.fhirClient.server.auth.token
            },
            contentType: "application/json",
        };

        fetch(`${configuration.sandboxManagerApiUrl}/userPersona/default?sandboxId=${sandboxId}`, config)
            .then(userResponse => userResponse.json()
                .then(user => {
                    dispatch(setDefaultSandboxUser(user));
                }))
            .catch(e => console.log(e));
    }
}

export function authorizeSandbox (sandboxId) {
    return (dispatch, getState) => {
        const state = getState();
        authorize(window.location, state, sandboxId);
    }
}

export const createSandbox = (sandboxDetails) => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(createSandboxStart());
        let config = getConfig(state);
        config.body = JSON.stringify(sandboxDetails);
        config.method = "POST";
        config.headers["Content-Type"] = "application/json";
        fetch(configuration.sandboxManagerApiUrl + '/sandbox', config)
            .then(res => {
                dispatch(createSandboxSuccess(res.data));
            })
            .catch(err => {
                dispatch(createSandboxFail(err));
            });
    };
};


export const fetchSandboxById = (sandboxId) => {
    return (dispatch, getState) => {
        const state = getState();
        if (!state.fhir.fhirClient) {
            return;
        }
        let configuration = JSON.parse(localStorage.getItem('config'));
        dispatch(lookupSandboxByIdStart());
        const queryParams = '?lookupId=' + sandboxId;
        axios.get(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
            .then(res => {
                const sandboxes = [];
                for (let key in res.data) {
                    sandboxes.push({
                        ...res.data[key], id: key
                    });
                }
                dispatch(lookupSandboxByIdSuccess(sandboxes));
            })
            .catch(err => {
                dispatch(lookupSandboxByIdFail(err));
            });
    };

};

export const fetchSandboxes = () => {
    return (dispatch, getState) => {
        const state = getState();
        // if(!state.fhir.fhirClient){
        //     return;
        // }
        dispatch(fetchSandboxesStart());
        let configuration = state.config.xsettings.data.sandboxManager;
        const queryParams = '?userId=' + state.users.oauthUser.sbmUserId;

        fetch(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, getConfig(state))
            .then(res => {
                res && res.json()
                    .then(data => {
                        const sandboxes = [];
                        for (let key in data) {
                            sandboxes.push({
                                ...data[key], id: key
                            });
                        }
                        dispatch(fetchSandboxesSuccess(sandboxes));
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch(fetchSandboxesFail(err));
            });
    };
};

export const fetchSandboxInvites = () => {
    return (dispatch, getState) => {
        const state = getState();
        if (!state.fhir.fhirClient) {
            return;
        }
        dispatch(fetchSandboxInvitesStart());
        let configuration = JSON.parse(localStorage.getItem('config'));

        const queryParams = '?sbmUserId=' + state.user.oauthUser.sbmUserId + '&status=PENDING';

        axios.get(configuration.sandboxManagerApiUrl + '/sandboxinvite' + queryParams, getConfig(state))
            .then(res => {
                const invitations = [];
                for (let key in res.data) {
                    invitations.push({
                        ...res.data[key], id: key
                    });
                }
                dispatch(fetchSandboxInvitesSuccess(invitations));
            })
            .catch(err => {
                dispatch(fetchSandboxInvitesFail(err));
            })
    };
};

export function doLaunch (app, persona, user) {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        user = user ? user : state.sandbox.defaultUser;

        let key = random(32);
        window.localStorage[key] = "requested-launch";

        let params = {};
        if (persona) {
            params = { patient: persona.id };
        }

        params["need_patient_banner"] = false;
        let appWindow = window.open('/launchApp?' + key, '_blank');
        let config = getConfig(state);
        config.body = JSON.stringify({ username: user.personaUserId, password: user.password });
        config.method = "POST";
        config.headers["Content-Type"] = "application/json";
        let launchDetails = {
            userPersona: Object.assign({}, user),
            patientContext: persona.id
        };

        try {
            registerAppContext(app, params, launchDetails, key);
            fetch(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", config)
                .then(function (response) {
                    response.json()
                        .then(data => {
                            const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
                            const date = new Date();
                            date.setTime(date.getTime() + (3 * 60 * 1000));
                            let cookie = `hspc-persona-token=${data.jwt}; expires=${date.toString()}; domain=${url}; path=/`;
                            document.cookie = cookie;
                        });
                });
        } catch (e) {
            console.log(e);
            appWindow.close();
        }
    }
}

function random (length) {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
    }
    return result;
}

function registerAppContext (app, params, launchDetails, key) {
    let appToLaunch = Object.assign({}, app);
    delete appToLaunch.clientJSON;
    delete appToLaunch.createdBy;
    delete appToLaunch.sandbox;
    callRegisterContext(appToLaunch, params, window.fhirClient.server.serviceUrl, launchDetails, key);
}

function callRegisterContext (appToLaunch, params, issuer, launchDetails, key) {
    let config = {
        method: 'POST',
        headers: {
            Authorization: 'BEARER ' + window.fhirClient.server.auth.token,
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: appToLaunch.authClient.clientId,
            parameters: params
        })
    };

    fetch(issuer + '/_services/smart/Launch', config)
        .then(response => {
            response.json()
                .then(context =>
                    window.localStorage[key] = JSON.stringify({
                        app: appToLaunch,
                        iss: issuer,
                        launchDetails: launchDetails,
                        context
                    }))
        })
}
