import * as types from "./types";
import API from '../../lib/api';
import {saveSandboxManagerUser} from "./users";

export function resetState() {
    return {type: types.APP_RESET_STATE}
}

export function app_setScreen(screen) {
    // ga && ga('set', 'page', screen);
    // ga && ga('send', 'pageview');
    return {type: types.SET_APP_SCREEN, payload: screen}
}

export function setTermsLoading(loading) {
    return {type: types.SET_TERMS_LOADING, payload: {loading}}
}

export function setTerms(terms) {
    return {type: types.SET_TERMS, payload: {terms}}
}

export function resetGlobalError() {
    return {
        type: types.SET_ERROR_TO_SHOW,
        payload: {error: undefined}
    }
}

export function setGlobalError(error) {
    return dispatch => {
        dispatch({
            type: types.SET_ERROR_TO_SHOW,
            payload: {error}
        });
    }
}

export function showGlobalSessionModal() {
    return dispatch => {
        dispatch({
            type: types.SET_GLOBAL_SESSION_MODAL
        });
    }
}

export function loadTerms() {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setTermsLoading(true));

        // let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/termsofuse`;
        // API.get("/data/termsOfUse.json", dispatch)
        API.get(`${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/termsofuse`, dispatch)
            .then(terms => dispatch(setTerms(terms)))
            .catch(() => dispatch(setTermsLoading(false)));
    }
}

export function signOut() {
    return (dispatch, getState) => {
        let state = getState();
        sessionStorage.clear();
        localStorage.clear();
        let configuration = state.config.xsettings.data.sandboxManager;

        dispatch(resetState());
        window.location.href = `${configuration.oauthLogoutUrl}?hspcRedirectUrl=${window.location.origin}`;
    }
}

export function acceptTerms() {
    return (dispatch, getState) => {
        let state = getState();
        let config = state.config.xsettings.data.sandboxManager;

        API.post(`${config.sandboxManagerApiUrl}/user/acceptterms?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}&termsId=${state.app.terms.id}`, dispatch)
            .then(() => {
                API.get(`${config.sandboxManagerApiUrl}/user?sbmUserId=${encodeURIComponent(state.users.oauthUser.sbmUserId)}`, dispatch)
                    .then(data2 => dispatch(saveSandboxManagerUser(data2)))
            });
    }
}
