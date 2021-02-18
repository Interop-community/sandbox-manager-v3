import * as actionTypes from './types';
import {authorize, goHome, saveSandboxApiEndpointIndex} from './fhirauth';
import {fhir_setCustomSearchExecuting, fhir_setExportSearchResults} from './fhir';
import {fetchPersonas} from "./persona";
import {resetState, setGlobalError} from "./app";
import API from '../../lib/api';

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const setDefaultUrl = (sandboxId) => {
    return {
        type: actionTypes.SET_FHIR_SERVER_URL,
        sandboxId: sandboxId
    }
};

export const selectSandboxById = (sandboxId) => {
    localStorage.setItem('sandboxId', sandboxId);
    sessionStorage['sandboxId'] = sandboxId;
    return {type: actionTypes.SELECT_SANDBOX}
};

export function setUpdatingUser(updating) {
    return {
        type: actionTypes.UPDATING_USER,
        payload: {updating}
    }
}

export function setSandboxExportStatus(status) {
    return {
        type: actionTypes.SET_SANDBOX_EXPORT_STATUS,
        payload: {status}
    }
}

export function setFetchSingleLocation(fetching) {
    return {
        type: actionTypes.FETCHING_SINGLE_LOCATION,
        payload: {fetching}
    }
}

export function setNotificationLoading(loading) {
    return {
        type: actionTypes.SET_NOTIFICATIONS_LOADING,
        payload: {loading}
    }
}

export function setNotifications(notifications) {
    return {
        type: actionTypes.SET_NOTIFICATIONS,
        payload: {notifications}
    }
}

export function setLoginInfo(loginInfo) {
    sessionStorage.loading = false;
    return {
        type: actionTypes.SET_LOGIN_INFO,
        payload: {loginInfo}
    }
}

export function setUserLoginInfo(loginInfo) {
    return {
        type: actionTypes.SET_USER_LOGIN_INFO,
        payload: {loginInfo}
    }
}

export function setFetchingLoginInfo(fetching) {
    return {
        type: actionTypes.FETCHING_LOGIN_INFO,
        payload: {fetching}
    }
}

export function setFetchingUserLoginInfo(fetching) {
    return {
        type: actionTypes.FETCHING_USER_LOGIN_INFO,
        payload: {fetching}
    }
}

export function setFetchSingleEncounter(fetching) {
    return {
        type: actionTypes.FETCHING_SINGLE_ENCOUNTER,
        payload: {fetching}
    }
}

export function setSingleEncounter(encounter) {
    return {
        type: actionTypes.SET_SINGLE_ENCOUNTER,
        payload: {encounter}
    }
}

export function setFetchingSingleEncounterError(error) {
    return {
        type: actionTypes.SET_SINGLE_ENCOUNTER_LOAD_ERROR,
        payload: {error}
    }
}

export function setFetchSingleIntent(fetching) {
    return {
        type: actionTypes.FETCHING_SINGLE_INTENT,
        payload: {fetching}
    }
}

export function setSingleIntent(intent) {
    return {
        type: actionTypes.SET_SINGLE_INTENT,
        payload: {intent}
    }
}

export function setFetchingSingleIntentError(error) {
    return {
        type: actionTypes.SET_SINGLE_INTENT_LOAD_ERROR,
        payload: {error}
    }
}

export function setFetchSingleResource(fetching) {
    return {
        type: actionTypes.FETCHING_SINGLE_RESOURCE,
        payload: {fetching}
    }
}

export function setFetchAnyResource(fetching, type) {
    return {
        type: actionTypes.FETCHING_ANY_RESOURCE,
        payload: {fetching, type}
    }
}

export function setSingleResource(resource) {
    return {
        type: actionTypes.SET_SINGLE_RESOURCE,
        payload: {resource}
    }
}

export function addFetchedResource(resource) {
    return {
        type: actionTypes.SET_ANY_RESOURCE,
        payload: {resource}
    }
}

export function resetFetchedResource() {
    return {
        type: actionTypes.RESET_ANY_RESOURCE
    }
}

export function clearResourceFetch(type) {
    return {
        type: actionTypes.CLEAR_RESOURCE_FETCH,
        payload: {type}
    }
}

export function setFetchingSingleResourceError(error) {
    return {
        type: actionTypes.SET_SINGLE_RESOURCE_LOAD_ERROR,
        payload: {error}
    }
}

export function setFetchingAnyResourceError(type, error) {
    return {
        type: actionTypes.SET_ANY_RESOURCE_LOAD_ERROR,
        payload: {error, type}
    }
}

export function setSingleLocation(location) {
    return {
        type: actionTypes.SET_SINGLE_LOCATION,
        payload: {location}
    }
}

export function modifyingCustomContext(modifying) {
    return {
        type: actionTypes.ADDING_CUSTOM_CONTENT,
        payload: {modifying}
    }
}

export function setFetchingSingleLocationError(error) {
    return {
        type: actionTypes.SET_SINGLE_LOCATION_LOAD_ERROR,
        payload: {error}
    }
}

export function setSandboxSelecting(selecting) {
    return {
        type: actionTypes.SET_SANDBOX_SELECTING,
        payload: {selecting}
    }
}

export const clearResults = () => {
    return {
        type: actionTypes.CLEAR_RESULTS
    }
};

export const setDataImporting = (importing) => {
    return {
        type: actionTypes.SET_DATA_IMPORTING,
        payload: {importing}
    }
};

export const setImportResults = (results) => {
    return {
        type: actionTypes.SET_IMPORT_RESULTS,
        payload: {results}
    }
};

export function setLaunchScenariosLoading(loading) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_LOADING,
        payload: {loading}
    }
}

export function setUserInviting(inviting) {
    return {
        type: actionTypes.SET_USER_INVITING,
        payload: {inviting}
    }
}

export function setCopying(copying) {
    return {
        type: actionTypes.SET_COPYING,
        payload: {copying}
    }
}

export function setScenarioCreating(creating) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_CREATING,
        payload: {creating}
    }
}

export function setScenarioDeleting(deleting) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS_DELETING,
        payload: {deleting}
    }
}

export function setLaunchScenarios(scenarios) {
    return {
        type: actionTypes.SET_LAUNCH_SCENARIOS,
        payload: {scenarios}
    }
}

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

export const setCreatingSandbox = (creating, info) => {
    return {
        type: actionTypes.CREATING_SANDBOX,
        payload: {creating, info}
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
        payload: {user}
    }
};

export const setInvitesLoading = (loading) => {
    return {
        type: actionTypes.SET_INVITES_LOADING,
        payload: {loading}
    }
};

export const setInvites = (invites) => {
    return {
        type: actionTypes.SET_INVITES,
        payload: {invites}
    }
};

export const setResettingCurrentSandbox = (resetting) => {
    return {
        type: actionTypes.SET_RESETTING_CURRENT_SANDBOX,
        payload: {resetting}
    }
};

export const setDeletingCurrentSandbox = (deleting) => {
    return {
        type: actionTypes.SET_DELETING_CURRENT_SANDBOX,
        payload: {deleting}
    }
};

export function createResource(data) {
    return dispatch => {
        let url = `${window.fhirClient.server.serviceUrl}/${data.resourceType}`;
        API.post(url, data, dispatch).finally(() => dispatch(fetchPersonas(data.resourceType)));
    }
}

export const importData = (data) => {
    return dispatch => {
        dispatch(setDataImporting(true));

        // The promis is a list even though we only have one to get arround the
        // no "catch" for the returned values from the fhirClient.api
        let promises;
        try {
            let dataObject = undefined;
            let type = undefined;
            let xmlDoc = undefined;

            try {
                dataObject = JSON.parse(data);
            } catch (e) {
                dataObject = data;
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(dataObject, 'text/xml');
                type = 'application/xml';
            }

            if (type === 'application/xml' && xmlDoc.querySelector('Bundle')) {
                promises = [API.post(window.fhirClient.server.serviceUrl, dataObject, dispatch, true, type)];
            } else if (type === 'application/xml' && !xmlDoc.querySelector('Bundle')) {
                let id = xmlDoc.querySelector('id');
                id = id.getAttribute('value');
                promises = [API.put(`${window.fhirClient.server.serviceUrl}/${xmlDoc.firstChild.tagName}/${id}`, dataObject, dispatch, true, type)];
            } else if (!type && dataObject.resourceType === 'Bundle') {
                promises = [window.fhirClient.api.transaction({data})];
            } else if (dataObject.id !== undefined) {
                promises = [window.fhirClient.api.update({type: dataObject.resourceType, id: dataObject.id, data: data})];
            } else {
                promises = [window.fhirClient.api.create({type: dataObject.resourceType, data: data})];
            }
        } catch (err) {
            // This will take care of informing the user that the JSON was not formatted correctly
            promises = [window.fhirClient.api.transaction({data})];
        }

        Promise.all(promises)
            .then(result => {
                let res = result[0] && result[0].data ? result[0].data : result;
                dispatch(setDataImporting(false));
                dispatch(setImportResults(res));
            })
            .catch(error => {
                console.log(error);
                dispatch(setDataImporting(false));
                error && error.error && error.error.responseJSON && dispatch(setImportResults(error.error.responseJSON));
                error && !error.error && dispatch(setImportResults(error));
            });
    }
};

export const deleteCurrentSandbox = (history) => {
    return (dispatch, getState) => {
        let state = getState();

        let sandboxId = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(setDeletingCurrentSandbox(true));

        API.delete(`${configuration.sandboxManagerApiUrl}/sandbox/${sandboxId}`, dispatch)
            .then(() => {
                history && history.push('/dashboard');
                dispatch(selectSandboxById());
            })
            .finally(() => dispatch(setDeletingCurrentSandbox(false)));
    }
};

export const resetCurrentSandbox = (applyDefaultDataSet) => {
    return (dispatch, getState) => {
        dispatch(setResettingCurrentSandbox(true));
        let state = getState();

        let sandboxId = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        let dataSet = (applyDefaultDataSet ? 'DEFAULT' : 'NONE');
        let data = {sandboxId, dataSet};
        API.post(`${configuration.sandboxManagerApiUrl}/fhirdata/reset?sandboxId=${sandboxId}&dataSet=${dataSet}`, data, dispatch).finally(() => dispatch(setResettingCurrentSandbox(false)))
    }
};

export const updateSandbox = (sandboxDetails) => {
    const UPDATE_EVENT = {
        type: actionTypes.UPDATE_SANDBOX,
        sandboxDetails: sandboxDetails
    };

    return (dispatch, getState) => {
        let state = getState();

        let selectedSandbox = sessionStorage.sandboxId;
        let configuration = state.config.xsettings.data.sandboxManager;
        let data = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
        data = Object.assign(data, sandboxDetails);
        API.put(`${configuration.sandboxManagerApiUrl}/sandbox/${selectedSandbox}`, data, dispatch).then(() => dispatch(UPDATE_EVENT));
    };
};

export const selectSandbox = (sandbox) => {
    return (dispatch, getState) => {
        dispatch(setSandboxSelecting(!!sandbox));
        let state = getState();

        let queryParams = "?userId=" + encodeURIComponent(state.users.oauthUser.sbmUserId);

        let configuration = state.config.xsettings.data.sandboxManager;

        const domain = window.location.host.split(":")[0].split(".").slice(-2).join(".");

        let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        if (isIE11) {
            document.cookie = `${configuration.personaCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; path=/`;
        } else {
            document.cookie = `${configuration.personaCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; path=/`;
        }

        if (sandbox !== undefined) {
            let sandboxId = sandbox.sandboxId;
            API.post(configuration.sandboxManagerApiUrl + '/sandbox/' + sandboxId + "/login" + queryParams, {}, dispatch)
                .then(() => {
                    dispatch(authorizeSandbox(sandbox));
                    dispatch(setDefaultUrl(sandboxId));
                    dispatch(selectSandboxById(sandboxId));
                })
                .finally(() => dispatch(setCreatingSandbox(false)));
        }
    };
};

export function toggleUserAdminRights(userId, toggle) {
    return (dispatch, getState) => {
        dispatch(setUpdatingUser(true));
        let state = getState();
        let queryParams = "?editUserRole=" + encodeURIComponent(userId) + "&role=ADMIN&add=" + (toggle ? 'true' : 'false');

        let configuration = state.config.xsettings.data.sandboxManager;
        API.put(configuration.sandboxManagerApiUrl + '/sandbox/' + sessionStorage.sandboxId + queryParams, {}, dispatch)
            .finally(() => {
                dispatch(setUpdatingUser(false));
                dispatch(fetchSandboxes());
            });
    };
}

export function deleteScenario(scenario) {
    return (dispatch, getState) => {
        dispatch(setScenarioDeleting(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        API.delete(`${configuration.sandboxManagerApiUrl}/launchScenario/${scenario.id}`, dispatch).finally(() => dispatch(setScenarioDeleting(false)));
    }
}

export function createScenario(data) {
    return (dispatch, getState) => {
        dispatch(setScenarioCreating(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        let url = configuration.sandboxManagerApiUrl + '/launchScenario/';
        data.id && (url += data.id);
        let method = data.id ? API.put : API.post;

        method(url, data, dispatch)
            .finally(() => {
                dispatch(loadLaunchScenarios());
                dispatch(setScenarioCreating(false));
            });
    }
}

export function updateLaunchScenario(scenario, description, title) {
    return (dispatch, getState) => {
        dispatch(setScenarioCreating(true));
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        description && (scenario.description = description);
        title && (scenario.title = title);
        !description && !title && (scenario.lastLaunchSeconds = new Date().getTime());
        let url = `${configuration.sandboxManagerApiUrl}/launchScenario/${scenario.id}`;
        !description && !title && (url += '/launched');

        API.put(url, scenario, dispatch).finally(() => dispatch(setScenarioCreating(false)));
    }
}

export function updateNeedPatientBanner(scenario) {
    return (dispatch, getState) => {
        let state = getState();

        let configuration = state.config.xsettings.data.sandboxManager;
        let url = `${configuration.sandboxManagerApiUrl}/launchScenario/${scenario.id}`;

        dispatch(modifyingCustomContext(true));

        API.put(url, scenario, dispatch).finally(() => dispatch(modifyingCustomContext(false)));
    }
}

export const inviteNewUser = (email) => {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setUserInviting(true));
        let configuration = state.config.xsettings.data.sandboxManager;
        const data = {
            invitedBy: {
                sbmUserId: state.users.oauthUser.sbmUserId
            },
            invitee: {
                email
            },
            sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId)
        };
        API.put(configuration.sandboxManagerApiUrl + '/sandboxinvite', data, dispatch)
            .then(() => dispatch(fetchSandboxInvites()))
            .finally(() => dispatch(setUserInviting(false)));
    };
};

export const removeInvitation = (id) => {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setUserInviting(true));
        let configuration = state.config.xsettings.data.sandboxManager;
        API.put(configuration.sandboxManagerApiUrl + '/sandboxinvite/' + id + '?status=REVOKED', {}, dispatch)
            .then(() => dispatch(fetchSandboxInvites()))
            .finally(() => dispatch(setUserInviting(false)));
    };
};

export function getDefaultUserForSandbox(sandboxId) {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();

            let configuration = state.config.xsettings.data.sandboxManager;
            API.get(`${configuration.sandboxManagerApiUrl}/userPersona/default?sandboxId=${sandboxId}`, dispatch)
                .then(user => dispatch(setDefaultSandboxUser(user)))
                .catch(() => dispatch(setDefaultSandboxUser(undefined)))
                .finally(() => dispatch(setSandboxSelecting(false)));
        } else {
            goHome();
        }
    }
}

export function authorizeSandbox(sandbox) {
    return (dispatch, getState) => {
        if (sandbox !== undefined) {
            dispatch(saveSandboxApiEndpointIndex(sandbox.apiEndpointIndex));
            const state = getState();

            // TMP CODE HERE TO EASE THE USERS DURING THE UPGRADE PROCESS
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            let managerUrl = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
            sessionStorage.sandboxApiEndpointIndex = sandbox.apiEndpointIndex;
            sessionStorage.sandboxApiEndpointCheck = `${managerUrl}/sandbox?sandboxId=${sandbox.sandboxId}`;
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

            // TMP CODE HERE TO EASE THE USERS DURING THE UPGRADE PROCESS
            authorize(window.location, state, sandbox.sandboxId);
        }
    }
}

export const createSandbox = (sandboxDetails) => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(setCreatingSandbox(true));
        let clonedSandbox = {};
        if (sandboxDetails.apiEndpointIndex === "8") {
            clonedSandbox.sandboxId = "MasterDstu2Smart";
            if (sandboxDetails.dataSet === "NONE") {
                clonedSandbox.sandboxId = "MasterDstu2Empty";
            }
        } else if (sandboxDetails.apiEndpointIndex === "9") {
            clonedSandbox.sandboxId = "MasterStu3Smart";
            if (sandboxDetails.dataSet === "NONE") {
                clonedSandbox.sandboxId = "MasterStu3Empty";
            }
        } else if (sandboxDetails.apiEndpointIndex === "10") {
            clonedSandbox.sandboxId = "MasterR4Smart";
            if (sandboxDetails.dataSet === "NONE") {
                clonedSandbox.sandboxId = "MasterR4Empty";
            }
        } else if (sandboxDetails.apiEndpointIndex === "11") {
            clonedSandbox.sandboxId = "MasterR5Empty";
            // if (sandboxDetails.dataSet === "NONE") {
            //     clonedSandbox.sandboxId = "MasterR5Empty";
            // }
        }
        let cloneBody = {
            "clonedSandbox": clonedSandbox,
            "newSandbox": sandboxDetails
        };

        API.post(configuration.sandboxManagerApiUrl + '/sandbox/clone', cloneBody, dispatch)
            .then(() => {
                let creatingDetails = state.sandbox.creatingSandboxInfo ? state.sandbox.creatingSandboxInfo.slice() : [];
                creatingDetails.push(sandboxDetails);
                dispatch(setCreatingSandbox(true, creatingDetails));
                dispatch(getCurrentState(sandboxDetails));
            })
            .catch(() => dispatch(createSandboxFail("error")));
    };
};

export const getCurrentState = (sandboxDetails) => {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        API.get(`${configuration.sandboxManagerApiUrl}/sandbox/creationStatus/${sandboxDetails.sandboxId}`, dispatch)
            .then(res => {
                state = getState();
                let creatingDetails = (state.sandbox.creatingSandboxInfo || []).slice();
                let index = creatingDetails.findIndex(i => i.sandboxId === sandboxDetails.sandboxId);
                let obj = Object.assign({}, creatingDetails[index], {...sandboxDetails, queuePosition: res.queuePosition});
                index = index >= 0 ? index : creatingDetails.length;
                creatingDetails[index] = obj;
                if (res.sandboxCreationStatus === 'QUEUED') {
                    dispatch(setCreatingSandbox(true, creatingDetails));
                    setTimeout(() => dispatch(getCurrentState(sandboxDetails)), 1000);
                } else {
                    dispatch(getLoginInfo(false));
                    dispatch(fetchSandboxes(undefined, data => {
                        let sandboxes = data.filter(s => s.creationStatus !== 'QUEUED');
                        creatingDetails.splice(index, 1);
                        creatingDetails.length > 0
                            ? dispatch(setCreatingSandbox(true, creatingDetails))
                            : dispatch(setCreatingSandbox(false));
                        dispatch(fetchSandboxesSuccess(sandboxes));
                    }))
                    // dispatch(fetchSandboxes());
                }
            });
    }
}

export const fetchSandboxes = (toSelect, returnValue) => {
    return (dispatch, getState) => {
        const state = getState();
        if (!state.sandbox.loading) {
            !returnValue && dispatch(getLoginInfo());
            if (!toSelect && localStorage.sandboxIdToRedirectTo) {
                toSelect = localStorage.sandboxIdToRedirectTo;
                localStorage.removeItem('sandboxIdToRedirectTo');
            }
            !toSelect && !returnValue && dispatch(fetchSandboxesStart());
            let configuration = state.config.xsettings.data.sandboxManager;
            const queryParams = '?userId=' + state.users.oauthUser.sbmUserId + '&_sort:asc=name';

            API.get(configuration.sandboxManagerApiUrl + '/sandbox' + queryParams, dispatch)
                .then(data => {
                    const sandboxes = [];
                    for (let key in data) {
                        sandboxes.push({
                            ...data[key], id: key
                        });
                    }
                    if (!returnValue) {
                        dispatch(fetchSandboxesSuccess(sandboxes));
                        setTimeout(() => dispatch(selectSandbox(sandboxes.find(i => i.sandboxId === toSelect))), 300);
                        !toSelect && sandboxes.map(s => s.creationStatus === 'QUEUED' && dispatch(getCurrentState(s)));

                        let toCreate = sandboxes.filter(s => s.creationStatus === 'QUEUED');
                        dispatch(setCreatingSandbox(true, toCreate));
                        // if (toCreate.length) {
                        //     toCreate.map(i => () => dispatch(getCurrentState(i)));
                        // }
                    } else {
                        returnValue(sandboxes);
                    }
                })
                .catch(err => {
                    sessionStorage.clear();
                    localStorage.clear();

                    dispatch(resetState());
                    window.location.href = window.location.origin;
                    dispatch(fetchSandboxesFail(err));
                });
        }
    };
};

export const fetchSandboxInvites = () => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(fetchSandboxInvitesStart());

        const queryParams = '?sandboxId=' + sessionStorage.sandboxId + '&status=PENDING';

        API.get(configuration.sandboxManagerApiUrl + '/sandboxinvite' + queryParams, dispatch)
            .then(res => {

                const invitations = [];
                for (let key in res) {
                    invitations.push({...res[key]});
                }
                dispatch(fetchSandboxInvitesSuccess(invitations));
            })
            .catch(err => {
                dispatch(fetchSandboxInvitesFail(err));
            })
    };
};

export const fetchUserNotifications = () => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(setNotificationLoading(true));

        const queryParams = `?userId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}`;
        API.get(configuration.sandboxManagerApiUrl + '/notification' + queryParams, dispatch)
            .then((notifications) => {
                dispatch(setNotifications(notifications));
            })
            .finally(() => {
                dispatch(setNotificationLoading(false));
            });
    };
};

export const hideNotification = (notification) => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;

        const queryParams = `?userId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}`;

        notification.hidden = true;

        dispatch(setNotificationLoading(true));
        API.put(configuration.sandboxManagerApiUrl + `/notification/${notification.id}` + queryParams, notification, dispatch)
            .then(() => {
                dispatch(fetchUserNotifications());
                dispatch(setNotificationLoading(false));
            })
            .catch(() => {
                dispatch(setNotificationLoading(false));
            });
    };
};

export const markAllNotificationsSeen = () => {
    return (dispatch, getState) => {
        const state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;

        const queryParams = `?userId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}`;

        API.put(configuration.sandboxManagerApiUrl + `/notification/mark-seen` + queryParams, {}, dispatch)
            .finally(() => dispatch(fetchUserNotifications()));
    };
};

export function loadLaunchScenarios() {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            dispatch(setLaunchScenariosLoading(true));
            let state = getState();
            if (state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl) {
                let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + '/launchScenario?sandboxId=' + sessionStorage.sandboxId;
                API.get(url, dispatch)
                    .then(scenarios => dispatch(setLaunchScenarios(scenarios)))
                    .finally(() => dispatch(setLaunchScenariosLoading(false)));
            }
        } else {
            goHome();
        }
    }
}

export function fetchEncounter(id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(setFetchSingleEncounter(true));
            window.fhirClient.api.read({type: 'Encounter', id})
                .done(patient => {
                    dispatch(setSingleEncounter(patient.data));
                    dispatch(setFetchSingleEncounter(false));
                })
                .fail(e => {
                    dispatch(setFetchingSingleEncounterError(e));
                    dispatch(setFetchSingleEncounter(false));
                });
        }
    }
}

export function fetchLocation(id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(setFetchSingleLocation(true));
            window.fhirClient.api.read({type: 'Location', id})
                .done(patient => {
                    dispatch(setSingleLocation(patient.data));
                    dispatch(setFetchSingleLocation(false));
                })
                .fail(e => {
                    dispatch(setFetchingSingleLocationError(e));
                    dispatch(setFetchSingleLocation(false));
                });
        }
    }
}

export function fetchIntent(id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(setFetchSingleIntent(true));
            window.fhirClient.api.read({type: 'Intent', id})
                .done(patient => {
                    dispatch(setSingleIntent(patient.data));
                    dispatch(setFetchSingleIntent(false));
                })
                .fail(e => {
                    dispatch(setFetchingSingleIntentError(e));
                    dispatch(setFetchSingleIntent(false));
                });
        }
    }
}

export function fetchResource(id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(setFetchSingleResource(true));
            window.fhirClient.api.read({type: 'Resource', id})
                .done(patient => {
                    dispatch(setSingleResource(patient.data));
                    dispatch(setFetchSingleResource(false))
                })
                .fail(e => {
                    dispatch(setFetchingSingleResourceError(e));
                    dispatch(setFetchSingleResource(false))
                });
        }
    }
}

export function fetchAnyResource(type, id) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(setFetchAnyResource(true, type));
            window.fhirClient.api.read({type, id})
                .done(patient => {
                    dispatch(addFetchedResource(patient.data));
                    dispatch(setFetchAnyResource(false, type))
                })
                .fail(e => {
                    dispatch(setFetchingAnyResourceError(type, e));
                    dispatch(setFetchAnyResource(false, type))
                });
        }
    }
}

export function searchAnyResource(type, crit) {
    return dispatch => {
        if (window.fhirClient) {
            dispatch(resetFetchedResource());
            dispatch(setFetchAnyResource(true, type));
            window.fhirClient.api.search({type, query: crit})
                .done(res => {
                    res.data.resourceType = type;
                    dispatch(addFetchedResource(res.data));
                    dispatch(setFetchAnyResource(false, type));
                })
                .fail(e => {
                    dispatch(setFetchingAnyResourceError(type, e));
                    dispatch(setFetchAnyResource(false, type));
                });
        }
    }
}

export function removeUser(userId, history) {
    return (dispatch, getState) => {
        dispatch(setInvitesLoading(true));
        let sandboxId = sessionStorage.sandboxId;
        let state = getState();

        if (state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandbox/${sandboxId}?removeUserId=${encodeURIComponent(userId)}`;
            API.put(url, {}, dispatch)
                .then(() => {
                    if (userId === state.users.user.sbmUserId) {
                        history && history.push('/dashboard');
                    }

                    dispatch(setInvitesLoading(false));
                    dispatch({type: actionTypes.REMOVE_SANDBOX_USER, userId: userId});
                })
        }
    }
}

export function updateSandboxInvite(invite, answer) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setInvitesLoading(true));
        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandboxinvite/${invite.id}?status=${answer}`;
        API.put(url, {}, dispatch)
            .finally(() => {
                dispatch(loadInvites());
                dispatch(fetchSandboxes());
            });
    }
}

export function loadInvites() {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(setInvitesLoading(true));
        if (state.config.xsettings.data.sandboxManager && window.fhirClient) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandboxinvite?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}&status=PENDING`;
            API.get(url, dispatch)
                .then(invitations => dispatch(setInvites(invitations)))
                .finally(() => dispatch(setInvitesLoading(false)));
        } else {
            goHome();
        }
    }
}

export function addCustomContext(sc, key, val) {
    return (dispatch, getState) => {
        let state = getState();
        let data = Object.assign({}, sc);
        data.contextParams = data.contextParams ? data.contextParams : [];
        data.contextParams.push({name: key, value: val});
        dispatch(modifyingCustomContext(true));

        let configuration = state.config.xsettings.data.sandboxManager;

        API.put(`${configuration.sandboxManagerApiUrl}/launchScenario/${sc.id}`, data, dispatch)
            .finally(() => dispatch(modifyingCustomContext(false)));
    }
}

export function deleteCustomContext(sc, context) {
    return (dispatch, getState) => {
        let state = getState();
        let data = Object.assign({}, sc);
        data.contextParams.splice(context, 1);
        dispatch(modifyingCustomContext(true));

        let configuration = state.config.xsettings.data.sandboxManager;

        API.put(`${configuration.sandboxManagerApiUrl}/launchScenario/${sc.id}`, data, dispatch)
            .finally(() => dispatch(modifyingCustomContext(false)));
    }
}

export function getLoginInfo(showLoader = true) {
    return (dispatch, getState) => {
        let state = getState();
        showLoader && dispatch(setFetchingLoginInfo(true));

        if (state.config.xsettings.data.sandboxManager) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandbox-access?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}`;
            API.get(url, dispatch)
                .then(loginInfo => dispatch(setLoginInfo(loginInfo)))
                .finally(() => showLoader && dispatch(setFetchingLoginInfo(false)));
        } else {
            goHome();
        }
    }
}

export function getUserLoginInfo() {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setFetchingUserLoginInfo(true));

        if (state.config.xsettings.data.sandboxManager) {
            let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/sandbox-access?sandboxId=${sessionStorage.sandboxId}`;
            API.get(url, dispatch)
                .then(loginInfo => dispatch(setUserLoginInfo(loginInfo)))
                .catch(() => dispatch(setFetchingUserLoginInfo(false)));
        } else {
            goHome();
        }
    }
}

export function loadExportResources(query) {
    return (dispatch, getState) => {
        let state = getState();
        let sandboxVersion = state.sandbox.sandboxApiEndpointIndex
            ? state.sandbox.sandboxApiEndpointIndexes.find(i => i.index === state.sandbox.sandboxApiEndpointIndex)
            : undefined;

        dispatch(setSandboxExportStatus({loading: true, error: false, resourceList: [], details: undefined, content: undefined}));
        if (sandboxVersion) {
            API.get(`/data/export-resources_${sandboxVersion.fhirTag}.json`, dispatch)
                .then(resourceList => {
                    dispatch(setSandboxExportStatus({loading: true, error: false, resourceList, details: undefined, content: undefined}));
                    dispatch(getTotalItemsToExport(resourceList, query));
                });
        } else {
            dispatch(setSandboxExportStatus({loading: false, error: true, resourceList: [], details: undefined, content: undefined, errorText: 'Unknown sandbox API endpoint version!'}));
        }

    }
}

export function getTotalItemsToExport(resourceList, query) {
    return (dispatch, getState) => {
        let content = {};
        let details = {};

        let getNext = function (data, type) {
            if (getState().sandbox.exportStatus.loading) {
                window.fhirClient.api.nextPage({bundle: data})
                    .then(d => {
                        if (d.data) {
                            let hasNext = d.data.link[1] && d.data.link[1].relation === "next";
                            content[type] = content[type].concat(d.data.entry);
                            hasNext && getNext(d.data, type);

                            //We need to check if we have the total amount of items in the DB
                            //for longer list FHIR does not return the total on the first search
                            //and we need to update the data when the total is first returned
                            !details[type].total && (details[type].total = d.data.total);
                            !hasNext && (details[type].loading = false);
                        }
                        if (getState().sandbox.exportStatus.loading) {
                            dispatch(setSandboxExportStatus({loading: true, error: false, resourceList: [1], details, content}));
                        }
                    });
            }
        };

        if (query.length === 0) {
            let promises = [];
            resourceList.map(resource => {
                let params = {type: resource, count: 50};

                promises.push(window.fhirClient.api.search(params));
            });

            Promise.all(promises)
                .then(data => {
                    data.map(d => {
                        if (d.data && d.data.entry && d.data.entry.length) {
                            let hasNext = !!d.data.link[1];

                            details[d.config.type] = {
                                total: d.data.total,
                                loading: hasNext
                            };

                            content[d.config.type] = d.data.entry;
                            hasNext && getNext(d.data, d.config.type);
                        }
                    });
                    dispatch(setSandboxExportStatus({loading: true, error: false, resourceList, details, content}));
                })
        } else {
            dispatch(setSandboxExportStatus({loading: true, error: false, resourceList: [], details, content: {}}));
            let endpoint = window.fhirClient.server.serviceUrl;
            API.get(`${endpoint}/${query}`, dispatch)
                .then(data => {
                    if (data && data.entry && data.entry.length) {
                        let type = data.entry[0].resource.resourceType;
                        let hasNext = !!data.link[1];

                        details[type] = {
                            total: data.total,
                            loading: hasNext
                        };

                        content[type] = data.entry;
                        !hasNext && resourceList.push(1);
                        hasNext && getNext(data, type);
                    } else {
                        let type = data.resourceType;
                        let dataList = [];
                        dataList.push(data);
                        content[type] = dataList;
                    }
                    dispatch(fhir_setExportSearchResults(data));
                    dispatch(fhir_setCustomSearchExecuting(false));
                    dispatch(setSandboxExportStatus({loading: true, error: false, resourceList, details, content}));
                })
                .catch(() => {
                    dispatch(setSandboxExportStatus({loading: false, error: true, resourceList: [1], details: "Could not load data", content: undefined}));
                    dispatch(fhir_setCustomSearchExecuting(false));
                });
        }
    }
}

export function cancelDownload() {
    return dispatch => {
        dispatch(setSandboxExportStatus({loading: false, error: false, resourceList: [], details: undefined, content: undefined}));
    }
}

export function doLaunch(app, persona, user = {}, noUser, scenario) {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        user = user.id ? user : state.sandbox.defaultUser;

        let params = {};
        if (scenario) {
            persona && (params = {patient: persona});
            scenario.encounter && (params.encounter = scenario.encounter);
            scenario.location && (params.location = scenario.location);
            scenario.resource && (params.resource = scenario.resource);
            scenario.smartStyleUrl && (params.smartStyleUrl = scenario.smartStyleUrl);
            scenario.intent && (params.intent = scenario.intent);
            if (scenario.contextParams) {
                for (let i = 0; i < scenario.contextParams.length; i++) {
                    let name = scenario.contextParams[i]['name'];
                    let value = scenario.contextParams[i]['value'];
                    params[name] = value;
                }
            }
        } else if (persona) {
            params = {patient: persona};
        }

        params["need_patient_banner"] = scenario ? scenario.needPatientBanner === 'T' : true;
        let embedded = !params["need_patient_banner"];

        let key = random(32);
        window.localStorage[key] = {
            status: "requested-launch",
            embedded
        };

        let appWindow = window.open('/launchApp?' + key, '_blank');
        let data = {};
        user && !noUser && (data = {username: user.personaUserId, password: user.password});
        let launchDetails = {};
        persona && (launchDetails.patientContext = persona);
        user && !noUser && (launchDetails.userPersona = Object.assign({}, user));

        try {
            user && !noUser && API.post(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", data, dispatch)
                .then(data => {
                    const url = window.location.host.split(":")[0].split(".").slice(-2).join(".");
                    const date = new Date();
                    date.setTime(date.getTime() + (3 * 60 * 1000));
                    let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
                    if (isIE11) {
                        document.cookie = `hspc-persona-token=${data.jwt}; expires=${date.toUTCString()}; domain=${url}; path=/`;
                    } else {
                        document.cookie = `hspc-persona-token=${data.jwt}; expires=${date.getTime()}; domain=${url}; path=/`;
                    }
                });
            registerAppContext(app, params, launchDetails, key, dispatch);
        } catch (e) {
            console.log(e);
            appWindow.close();
        }
    }
}

export function copyToClipboard(str) {
    return async dispatch => {
        dispatch(setCopying(true));
        let el = document.getElementById('copy-area');
        el.value = str;
        el.select();
        try {
            function listener(e) {
                console.log(e.clipboardData);
                e.clipboardData.setData("text/plain", str);
                e.preventDefault();
            }

            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);
        } catch (e) {
            console.log(e);
        }
        setTimeout(function () {
            dispatch(setCopying(false));
        }, 1500);
    }
}

export function random(length) {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += CHARS[Math.round(Math.random() * (CHARS.length - 1))];
    }
    return result;
}

function registerAppContext(app, params, launchDetails, key, dispatch) {
    let appToLaunch = Object.assign({}, app);
    delete appToLaunch.clientJSON;
    delete appToLaunch.createdBy;
    delete appToLaunch.sandbox;
    callRegisterContext(appToLaunch, params, window.fhirClient.server.serviceUrl, launchDetails, key, dispatch);
}

function callRegisterContext(appToLaunch, params, issuer, launchDetails, key, dispatch) {
    let data = {
        client_id: appToLaunch.clientId,
        parameters: params
    };

    API.post(issuer + '/_services/smart/Launch', data, dispatch)
        .then(context =>
            window.localStorage[key] = JSON.stringify({
                app: appToLaunch,
                iss: issuer,
                launchDetails: launchDetails,
                context,
                embedded: !params["need_patient_banner"]
            }))
}
