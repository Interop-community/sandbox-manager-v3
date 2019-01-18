import * as types from "./types";
import API from '../../lib/api';

export function resetState () {
    return { type: types.APP_RESET_STATE }
}

export function app_setScreen (screen) {
    ga && ga('set', 'page', screen);
    ga && ga('send', 'pageview');
    return { type: types.SET_APP_SCREEN, payload: screen }
}

export function setTermsLoading (loading) {
    return { type: types.SET_TERMS_LOADING, payload: { loading } }
}

export function setTerms (terms) {
    return { type: types.SET_TERMS, payload: { terms } }
}

export function resetGlobalError () {
    return {
        type: types.SET_ERROR_TO_SHOW,
        payload: { error: undefined }
    }
}

export function setGlobalError (error) {
    return dispatch => {
        dispatch({
            type: types.SET_ERROR_TO_SHOW,
            payload: { error }
        });
    }
}

export function loadTerms () {
    return (dispatch, getState) => {
        let state = getState();
        dispatch(setTermsLoading(true));

        let url = `${state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl}/termsofuse`;
        API.get(url, dispatch)
            .then(terms => dispatch(setTerms(terms)))
            .catch(() => dispatch(setTermsLoading(false)));
    }
}

export function signOut () {
    return (dispatch, getState) => {
        let state = getState();
        sessionStorage.clear();
        localStorage.clear();
        let configuration = state.config.xsettings.data.sandboxManager;

        dispatch(resetState());
        window.location.href = `${configuration.oauthLogoutUrl}?hspcRedirectUrl=${window.location.origin}`;
    }
}
