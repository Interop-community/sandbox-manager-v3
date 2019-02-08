import * as types from "../../action-creators/types";
import initialState from "./init";

export default function (state = initialState, action) {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.PATIENT_DETAILS_FETCH_STARTED:
            state.fetching = true;
            state.details = {};
            break;
        case types.PATIENT_DETAILS_FETCH_SUCCESS:
            state.fetching = false;
            break;
        case types.SET_LOADING_PATIENT_RESOURCES:
            state.loadingResources = action.payload.loading;
            break;
        case types.SET_RESOURCES_FOR_PATIENT:
            state.resources = action.payload.resources;
            break;
        case types.PATIENT_DETAILS_FETCH_ERROR:
            state.fetching = false;
            state.fetchingError = action.payload.error;
            break;
        case types.FETCHING_SINGLE_PATIENT:
            state.fetchingSingle = action.payload.fetching;
            if (action.payload.fetching) {
                state.fetchingSingleError = null;
                state.singlePatient = null;
            }
            break;
        case types.SINGLE_PATIENT_DATA:
            state.singlePatient = action.payload.patient;
            break;
        case types.SINGLE_PATIENT_FETCH_FAILED:
            state.fetchingSingleError = action.payload.error;
            break;
        case types.SET_PATIENT_DETAILS:
            state.details = action.payload.details;
            break;
        case types.APP_RESET_STATE:
            state = initialState;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.patient : state;
            state.fetchingSingle = false;
            state.fetchingSingleError = undefined;
            break;
    }

    return state;
}
