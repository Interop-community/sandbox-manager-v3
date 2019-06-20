import * as actionTypes from '../../action-creators/types';
import initialState from "./init";

export default (state = initialState, action) => {
    state = Object.assign({}, state);
    let cards = state.cards.slice();
    switch (action.type) {
        case actionTypes.HOOKS_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case actionTypes.HOOKS_SET_CARDS:
            state.cards = cards.concat(action.payload.cards);
            break;
        case actionTypes.HOOKS_SERVICE_LOADING:
            state.servicesLoading = action.payload.loading;
            state.servicesLoading && (state.tmpServiceState = undefined);
            break;
        case actionTypes.HOOKS_SET_SERVICES:
            state.services = action.payload.services;
            break;
        case actionTypes.HOOKS_REMOVE_CARDS:
            state.cards = [];
            break;
        case actionTypes.HOOKS_SET_TMP_SERVICE_STATE:
            state.tmpServiceState = action.payload.state;
            break;
        case "persist/REHYDRATE":
            state = action.payload && action.payload.hooks ? action.payload.hooks : state;
            state.services = [];
            state.servicesLoading = false;
            state.tmpServiceState = undefined;
            state.hookContexts = initialState.hookContexts;
            break;
    }

    return state;
};
