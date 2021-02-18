import API from '../../lib/api';
import * as types from './types';
import {random} from './sandbox';
import {setGlobalError} from './app';
import {appCreating} from './apps';

const POSTFIX_SERVICE = '/cds-services';

const GETTERS = {
    userId: getUserId
};

export const hookExecuting = executing => {
    return {
        type: types.HOOKS_EXECUTING,
        payload: {executing}
    }
};

export const setResultCards = cards => {
    return {
        type: types.HOOKS_SET_CARDS,
        payload: {cards}
    }
};

export function removeResultCards() {
    return {
        type: types.HOOKS_REMOVE_CARDS
    }
}

export function setServices(services) {
    return {
        type: types.HOOKS_SET_SERVICES,
        payload: {services}
    }
}

export function setServicesLoading(loading) {
    return {
        type: types.HOOKS_SERVICE_LOADING,
        payload: {loading}
    }
}

export function setChangedServices(changed) {
    return {
        type: types.HOOKS_SET_CHANGED_SERVICES,
        payload: {changed}
    }
}

export function checkForHookUpdates() {
    return (dispatch, getState) => {
        let state = getState();
        let services = state.hooks.services;
        let changed = [];
        services.map(s => {
            API.getNoErrorManagement(s.url, dispatch)
                .then(result => {
                    let hasChanged = false;
                    if (result.services) {
                        hasChanged = result.services.length !== s.cdsHooks.length;
                        if (!hasChanged) {
                            s.cdsHooks.map(hook => {
                                let newHook = result.services.find(i => i.id === hook.hookId);
                                hasChanged = newHook.description !== hook.description || newHook.hook !== hook.hook || newHook.title !== hook.title ||
                                    ((hook.prefetch && !newHook.prefetch) || (!hook.prefetch && newHook.prefetch));
                                if (!hasChanged && hook.prefetch && newHook.prefetch) {
                                    let oldPrefetch = hook.prefetch || {};
                                    let newPrefetch = newHook.prefetch || {};
                                    let oldKeys = Object.keys(oldPrefetch);
                                    let newKeys = Object.keys(newPrefetch);
                                    hasChanged = oldKeys.length !== newKeys.length;
                                    if (!hasChanged) {
                                        oldKeys.map(key => {
                                            oldPrefetch[key] !== newPrefetch[key] && (hasChanged = true);
                                        })
                                    }
                                }
                            });
                        }
                    }
                    hasChanged && changed.push(s.id);
                    dispatch(setChangedServices(changed));
                });
        })
    }
}

export function updateService(service) {
    return (dispatch, getState) => {
        let url = service.url;
        let serviceName = service.title;
        // remove trailing slash if present
        url[url.length - 1] === '/' && (url = url.substr(0, url.length - 1));

        // add the final part of the path if not there
        url.indexOf(POSTFIX_SERVICE) === -1 && (url += POSTFIX_SERVICE);

        dispatch(setServicesLoading(true));
        API.getNoAuth(url)
            .then(result => {
                let state = getState();
                let services = state.hooks.services ? state.hooks.services.slice() : [];
                let newService = {
                    title: serviceName || url,
                    id: service.id,
                    url,
                    cdsHooks: [],
                    description: '',
                    sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
                    createdBy: state.users.oauthUser
                };
                if (result && result.services) {
                    result.services.map((srvc, i) => {
                        // if (i !== 2) {
                        let obj = Object.assign({}, srvc);
                        obj.hookId = obj.id;
                        !obj.title && (obj.title = obj.name ? obj.name : '');
                        let oldService = service.cdsHooks.find(i => i.hookId === obj.hookId);
                        oldService && (obj.id = oldService.id);
                        !oldService && (delete obj.id);
                        newService.cdsHooks.push(obj);
                        // }
                    });
                }
                let configuration = state.config.xsettings.data.sandboxManager;

                API.put(`${configuration.sandboxManagerApiUrl}/cds-services/${service.id}`, newService, dispatch)
                    .then(() => {
                        dispatch(loadServices());
                    });
                services.push(newService);
            })
            .catch(_ => {
                dispatch(setServicesLoading(false));
            });
    }
}

export function deleteService(service) {
    return (dispatch, getState) => {
        let state = getState();
        let configuration = state.config.xsettings.data.sandboxManager;
        dispatch(setServicesLoading(true));
        API.delete(`${configuration.sandboxManagerApiUrl}/cds-services/${service.id}`, dispatch)
            .then(() => {
                dispatch(loadServices());
            })
            .catch(_ => {
                dispatch(setServicesLoading(false));
            });
    }
}

export function createService(url, serviceName) {
    return (dispatch, getState) => {
        // remove trailing slash if present
        url[url.length - 1] === '/' && (url = url.substr(0, url.length - 1));

        // add the final part of the path if not there
        url.indexOf(POSTFIX_SERVICE) === -1 && (url += POSTFIX_SERVICE);

        dispatch(setServicesLoading(true));
        API.get(url, dispatch)
            .then(result => {
                let state = getState();
                let services = state.hooks.services ? state.hooks.services.slice() : [];
                let newService = {
                    title: serviceName || url,
                    url,
                    cdsHooks: [],
                    description: '',
                    sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
                    createdBy: state.users.oauthUser
                };
                if (result && result.services) {
                    result.services.map((service, i) => {
                        let obj = Object.assign({}, service);
                        obj.hookId = obj.id;
                        !obj.title && (obj.title = obj.name ? obj.name : '');
                        delete obj.id;
                        newService.cdsHooks.push(obj);
                    });
                }
                let configuration = state.config.xsettings.data.sandboxManager;

                API.post(`${configuration.sandboxManagerApiUrl}/cds-services`, newService, dispatch)
                    .then(() => {
                        dispatch(loadServices());
                    });
                services.push(newService);
            })
            .catch(_ => {
                dispatch(setServicesLoading(false));
            });
    }
}

export function updateHook(hookId, newImage) {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(appCreating(true));
        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/cds-hook/${hookId}/image`;

        if (newImage) {
            let formData = new FormData();
            formData.append("file", newImage);
            API.post(url, formData, dispatch, true)
                .finally(() => {
                    setTimeout(() => {
                        dispatch(loadServices());
                        dispatch(appCreating(false));
                    }, 550);
                });
        } else if (!newImage) {
            API.delete(url, dispatch).finally(() => {
                setTimeout(() => {
                    dispatch(loadServices());
                    dispatch(appCreating(false));
                }, 550);
            });
        }
    };
}

export function loadServices() {
    return (dispatch, getState) => {
        if (window.fhirClient) {
            let state = getState();
            let sandboxId = sessionStorage.sandboxId;
            if (sandboxId) {
                dispatch(setServicesLoading(true));

                let url = state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl + "/cds-services?sandboxId=" + sandboxId;
                API.get(url, dispatch)
                    .then(services => dispatch(setServices(services)))
                    .finally(() => {
                        dispatch(setServicesLoading(false));
                        dispatch(checkForHookUpdates());
                    });
            }
        }
    }
}

export const launchHook = (hook, launchContext) => {
    return async (dispatch, getState) => {
        dispatch(hookExecuting(true));
        let hookInstance = random(64);

        let state = getState();
        let context = await buildContext(hook.hook, launchContext, state, dispatch);
        // Authorize the hook
        let userData = {username: state.sandbox.defaultUser.personaUserId, password: state.sandbox.defaultUser.password};
        let configuration = state.config.xsettings.data.sandboxManager;

        context && API.post(configuration.sandboxManagerApiUrl + "/userPersona/authenticate", userData, dispatch)
            .then(authData => {
                let data = {
                    hookInstance,
                    hook: hook.hook,
                    fhirServer: window.fhirClient.server.serviceUrl,
                    context,
                    fhirAuthorization: {
                        access_token: JSON.parse(sessionStorage.getItem('tokenResponse')).access_token,
                        token_type: "Bearer",
                        scope: "patient/*.read user/*.read",
                        subject: hook.hook
                    },
                    prefetch: {}
                };

                // Prefetch any data that the hook might need
                if (hook.prefetch) {
                    let promises = [];
                    Object.keys(hook.prefetch).map(key => {
                        let url = hook.prefetch[key];
                        let regex = new RegExp(/\{\{context\.(.*?)\}\}/gi);
                        url = url.replace(regex, (a, b) => context[b]);
                        promises.push(new Promise((resolve, reject) => {
                            API.get(`${window.fhirClient.server.serviceUrl}/${encodeURI(url)}`, dispatch)
                                .then(result => {
                                    data.prefetch[key] = result;
                                    resolve();
                                })
                                .catch(e => {
                                    reject();
                                })
                        }));
                    });
                    Promise.all(promises)
                        .then(() => {
                            // Trigger the hook
                            let start = performance.now();
                            API.post(`${encodeURI(hook.hookUrl)}`, data, dispatch)
                                .then(cards => {
                                    if (cards) {
                                        cards.cards = cards.cards && cards.cards.length ? cards.cards : [{noCardsReturned: true}];
                                        cards.cards.map(card => {
                                            card.requestData = data;
                                        });
                                        dispatch(setResultCards({cards: cards.cards, time: performance.now() - start}));
                                    }
                                })
                                .finally(() => {
                                    dispatch(hookExecuting(false));
                                });
                        })
                        .catch(e => {
                            console.log(e);
                        })
                } else {
                    let start = performance.now();
                    // Trigger the hook
                    API.post(`${encodeURI(hook.hookUrl)}`, data, dispatch)
                        .then(cards => {
                            if (cards) {
                                cards.cards = cards.cards && cards.cards.length ? cards.cards : [{noCardsReturned: true}];
                                cards.cards.map(card => {
                                    card.requestData = data;
                                });
                                dispatch(setResultCards({cards: cards.cards, time: performance.now() - start}));
                            }
                        })
                        .finally(() => {
                            dispatch(hookExecuting(false));
                        });
                }
            });
    }
};

export const executeAction = (action) => {
    return dispatch => {
        let promise = undefined;
        switch (action.type) {
            case 'create':
                promise = window.fhirClient.api.create({type: action.resource.resourceType, data: action.resource});
                break;
            case 'delete':
                action.resource && API.delete(window.fhirClient.server.serviceUrl + '/' + action.resource, dispatch);
                break;
            case 'update':
                promise = window.fhirClient.api.update({type: action.resource.resourceType, id: action.resource.id, data: action.resource});
                break;
        }
    }
};

async function buildContext(hook, launchContext, state, dispatch) {
    let params = state.hooks.hookContexts[hook];
    let context = {};
    let hasMissingContext = false;
    if (params) {
        Object.keys(params).map(async key => {
            let required = params[key].required;
            let type = params[key].type;
            let val;
            if (type === 'object') {
                let localContext = launchContext.find(x => x.name === key);
                let resources = localContext.value.split(',');
                let promises = [];
                resources.forEach(res => {
                    promises.push(API.get(`${window.fhirClient.server.serviceUrl}/${encodeURI(res)}`));
                });
                let data = await Promise.all(promises);
                val = {
                    resourceType : "Bundle",
                    total: data.length,
                    entry: data
                }
            } else if (launchContext instanceof Array) {
                val = launchContext.find(x => x.name === key);
            } else {
                val = launchContext[key] ? launchContext[key] : GETTERS[key] ? GETTERS[key](state) : undefined;
            }
            if ((!val || val.length === 0) && required) {
                dispatch(setGlobalError(`Hook can not be launched! Missing required context "${key}".`));
                hasMissingContext = true;
            } else if (val && val.value) {
                context[key] = val.value;
            } else if (val) {
                context[key] = val;
            }
        });
    }

    return !hasMissingContext ? context : undefined;
}

function getUserId(state) {
    return state.sandbox.defaultUser.resourceUrl;
}
