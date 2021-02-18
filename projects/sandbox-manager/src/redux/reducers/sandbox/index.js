import initialState from "./init";
import * as actionTypes from "../../action-creators/types";

export default function (state = initialState, action) {
    state = Object.assign({}, state);

    switch (action.type) {
        case actionTypes.FETCH_SANDBOXES_START:
            state.loading = true;
            break;
        case actionTypes.SET_SANDBOX_SELECTING:
            state.selecting = action.payload.selecting;
            break;
        case actionTypes.FHIR_SET_SMART:
            state.selecting = false;
            break;
        case actionTypes.FETCHING_LOGIN_INFO:
            state.fetchingLoginInfo = action.payload.fetching;
            break;
        case actionTypes.FETCHING_USER_LOGIN_INFO:
            state.fetchingUserLoginInfo = action.payload.fetching;
            break;

        case actionTypes.FETCHING_SINGLE_ENCOUNTER:
            state.fetchingSingleEncounter = action.payload.fetching;
            if (action.payload.fetching) {
                state.singleEncounter = null;
                state.singleEncounterLoadingError = null;
            }
            break;
        case actionTypes.SET_SINGLE_ENCOUNTER:
            state.singleEncounter = action.payload.encounter;
            break;
        case actionTypes.SET_SINGLE_ENCOUNTER_LOAD_ERROR:
            state.singleEncounterLoadingError = action.payload.error;
            break;

        case actionTypes.FETCHING_SINGLE_INTENT:
            state.fetchingSingleIntent = action.payload.fetching;
            if (action.payload.fetching) {
                state.singleIntent = null;
                state.singleIntentLoadingError = null;
            }
            break;
        case actionTypes.SET_SINGLE_INTENT:
            state.singleIntent = action.payload.intent;
            break;
        case actionTypes.SET_SINGLE_INTENT_LOAD_ERROR:
            state.singleIntentLoadingError = action.payload.error;
            break;
        case actionTypes.FETCHING_SINGLE_RESOURCE:
            state.fetchingSingleResource = action.payload.fetching;
            if (action.payload.fetching) {
                state.singleResource = null;
                state.singleResourceLoadingError = null;
            }
            break;
        case actionTypes.FETCHING_ANY_RESOURCE:
            if (action.payload.fetching) {
                state.resourceListFetching[action.payload.type] = action.payload.fetching;
                delete state.resourceList[action.payload.type];
                delete state.resourceListLoadError[action.payload.type];
            } else {
                delete state.resourceListFetching[action.payload.type];
            }
            break;
        case actionTypes.SET_SINGLE_RESOURCE:
            state.singleResource = action.payload.resource;
            break;
        case actionTypes.SET_ANY_RESOURCE_LOAD_ERROR:
            delete state.resourceListLoadError[action.payload.type];
            action.payload.error && (state.resourceListLoadError[action.payload.type] = action.payload.error);
            break;
        case actionTypes.CLEAR_RESOURCE_FETCH:
            delete state.resourceListLoadError[action.payload.type];
            delete state.resourceList[action.payload.type];
            break;
        case actionTypes.SET_ANY_RESOURCE:
            state.resourceList[action.payload.resource.resourceType] = action.payload.resource;
            break;
        case actionTypes.RESET_ANY_RESOURCE:
            state.resourceList = {};
            break;
        case actionTypes.SET_SINGLE_RESOURCE_LOAD_ERROR:
            state.singleResourceLoadingError = action.payload.error;
            break;

        case actionTypes.FETCHING_SINGLE_LOCATION:
            state.fetchingSingleLocation = action.payload.fetching;
            if (action.payload.fetching) {
                state.singleLocation = null;
                state.singleLocationLoadingError = null;
            }
            break;
        case actionTypes.SET_SINGLE_LOCATION:
            state.singleLocation = action.payload.location;
            break;
        case actionTypes.SET_SINGLE_LOCATION_LOAD_ERROR:
            state.singleLocationLoadingError = action.payload.error;
            break;
        case actionTypes.ADDING_CUSTOM_CONTENT:
            state.modifyingCustomContext = action.payload.modifying;
            break;
        case actionTypes.FETCH_SANDBOXES_SUCCESS:
            state.sandboxes = action.sandboxes;
            state.loading = false;
            break;
        case actionTypes.FETCH_SANDBOXES_FAIL:
            state.loading = false;
            break;
        case actionTypes.SET_USER_INVITING:
            state.inviting = action.payload.inviting;
            break;
        case actionTypes.SET_COPYING:
            state.copying = action.payload.copying;
            break;
        case actionTypes.DELETE_SANDBOX:
            const sandboxes = state.sandboxes.filter(sandbox => sandbox.id !== action.sandboxId);
            state.sandboxes = sandboxes;
            break;
        case actionTypes.UPDATE_SANDBOX:
        case actionTypes.RESET_SANDBOX:
        case actionTypes.CREATE_SANDBOX_SUCCESS:
            state = updateSandbox(state, action);
            break;
        case actionTypes.SELECT_SANDBOX:
            state.selectedSandbox = action.sandboxId;
            break;
        case actionTypes.SET_LOGIN_INFO:
            state.loginInfo = action.payload.loginInfo;
            break;
        case actionTypes.SET_USER_LOGIN_INFO:
            state.userLoginInfo = action.payload.loginInfo;
            break;
        case actionTypes.REMOVE_SANDBOX_USER:
            state = removeUser(state, action);
            break;
        case actionTypes.CLEAR_RESULTS:
            state.dataImporting = false;
            state.importResults = undefined;
            break;
        case actionTypes.SET_DATA_IMPORTING:
            state.dataImporting = action.payload.importing;
            state.importResults = undefined;
            break;
        case actionTypes.SET_IMPORT_RESULTS:
            state.importResults = action.payload.results;
            break;
        case actionTypes.SET_INVITES_LOADING:
            state.userInvitesLoading = action.payload.loading;
            break;
        case actionTypes.SET_INVITES:
            state.userInvites = action.payload.invites;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_START:
            state.invitesLoading = true;
            break;
        case actionTypes.UPDATING_USER:
            state.updatingUser = action.payload.updating;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_SUCCESS:
            state.invitations = action.invitations;
            state.invitesLoading = false;
            break;
        case actionTypes.FETCH_SANDBOX_INVITES_FAIL:
            state.invitesLoading = false;
            break;
        case actionTypes.CREATING_SANDBOX:
            state.creatingSandbox = action.payload.creating;
            state.creatingSandboxInfo = action.payload.info;
            break;
        case actionTypes.CREATE_SANDBOX_FAIL:
            state.createSandboxError = action.error;
            state.creatingSandbox = false;
            state.creatingSandboxInfo = undefined;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_START:
            state.lookingForSandbox = true;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_SUCCESS:
            state.lookupSandbox = action.sandbox;
            break;
        case actionTypes.SET_NOTIFICATIONS:
            state.notifications = action.payload.notifications;
            break;
        case actionTypes.LOOKUP_SANDBOX_BY_ID_FAIL:
            state.lookingForSandbox = false;
            state.lookingForSandboxError = action.error;
            break;
        case actionTypes.SET_NOTIFICATIONS_LOADING:
            state.loadingNotifications = action.payload.loading;
            break;
        case actionTypes.SAVE_ENDPOINT_INDEX:
            state.sandboxApiEndpointIndex = action.index;
            break;
        case actionTypes.SET_DEFAULT_SANDBOX_USER:
            state.defaultUser = action.payload.user && action.payload.user.id ? action.payload.user : undefined;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_LOADING:
            state.launchScenariosLoading = action.payload.loading;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS:
            state.launchScenarios = action.payload.scenarios;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_CREATING:
            state.launchScenarioCreating = action.payload.creating;
            break;
        case actionTypes.SET_LAUNCH_SCENARIOS_DELETING:
            state.launchScenarioDeleting = action.payload.deleting;
            break;
        case actionTypes.SET_RESETTING_CURRENT_SANDBOX:
            state.resetting = action.payload.resetting;
            break;
        case actionTypes.SET_DELETING_CURRENT_SANDBOX:
            state.deleting = action.payload.deleting;
            break;
        case actionTypes.APP_RESET_STATE:
            state = initialState;
            break;
        case actionTypes.SET_SANDBOX_EXPORT_STATUS:
            state.exportStatus = action.payload.status;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.sandbox : state;
            state.defaultUser = undefined;
            state.dataImporting = false;
            state.launchScenarioDeleting = false;
            state.launchScenarioCreating = false;
            state.fetchingSingleEncounter = false;
            state.fetchingSingleLocation = false;
            state.fetchingSingleResource = false;
            state.loadingNotifications = false;
            state.creatingSandbox = false;
            state.creatingSandboxInfo = undefined;
            state.deleting = false;
            state.resetting = false;
            state.loading = false;
            state.resourceList = {};
            state.resourceListFetching = {};
            state.resourceListLoadError = {};
            state.exportStatus = initialState.exportStatus;
            state.sandboxApiEndpointIndexes = initialState.sandboxApiEndpointIndexes;
            state.createSandboxError = undefined;
            state.singleResource = undefined;
            state.singleResourceLoadingError = undefined;
            state.singleLocation = undefined;
            state.singleLocationLoadingError = undefined;
            state.singleEncounter = undefined;
            state.singleEncounterLoadingError = undefined;
            state.importResults = undefined;
            state.launchScenarios = undefined;
            let path = window.location.pathname;
            let search = window.location.search;
            let resetSelecting = (!sessionStorage.sandboxId || path === '/dashboard' || (path === '/apps' && search.indexOf('code=') >= 0));
            resetSelecting && (state.selecting = false);
            resetSelecting && (state.sandboxes = []);
            break;
    }

    return state;
};

const updateSandbox = (state, action) => {
    const sandbox = { ...state.sandboxes.filter((s) => s.sandboxId === sessionStorage.sandboxId)[0] };
    sandbox.name = action.sandboxDetails.name;
    sandbox.description = action.sandboxDetails.description;
    sandbox.allowOpenAccess = action.sandboxDetails.allowOpenAccess;

    let ind = 0;
    for (let index in state.sandboxes) {
        if (state.sandboxes[index].sandboxId === sessionStorage.sandboxId) {
            ind = index;
            break;
        }
    }

    state.sandboxes = [...state.sandboxes.slice(0, ind), sandbox, ...state.sandboxes.slice(ind + 1)];

    return state;
};

const removeUser = (state, action) => {
    const cloneState = { ...state };
    const sandbox = { ...cloneState.sandboxes.filter(s => s.sandboxId === sessionStorage.sandboxId)[0] };
    if (sandbox.userRoles) {
        const remainingUsers = sandbox.userRoles.slice().filter(role => role.user.sbmUserId !== action.userId);

        sandbox.userRoles = remainingUsers;

        let ind = 0;
        for (let index in state.sandboxes) {
            if (state.sandboxes[index].sandboxId === sessionStorage.sandboxId) {
                ind = index;
                break;
            }
        }

        state.sandboxes = [
            ...state.sandboxes.slice(0, ind),
            sandbox,
            ...state.sandboxes.slice(ind + 1)
        ];
    }

    return state;
};
