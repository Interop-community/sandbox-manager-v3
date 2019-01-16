import * as types from "../../action-creators/types";
import initialState from "./init";

export default function (state = initialState, action) {
    state = Object.assign({}, state);

    switch (action.type) {
        case types.FHIR_SET_CONTEXT:
            state.context = action.payload;
            break;
        case types.FHIR_SET_META:
            state.meta = { status: "ready", ...action.payload };
            break;
        case types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS:
            state.parsed.patientDemographics = {
                status: "ready",
                data: action.payload,
            };
            break;
        case types.FHIR_SET_SMART:
            state.smart = action.payload;
            break;
        case types.APP_RESET_STATE:
            state = initialState;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_RESULTS:
            state.customSearchResults = action.payload.results;
            break;
        case types.FHIR_SET_EXPORT_SEARCH_RESULTS:
            state.customExportResults = action.payload.exportResults;
            break;
        case "persist/REHYDRATE":
            state = action.payload ? action.payload.fhir : state;
            state.customSearchResults = null;
            state.customExportResults = null;
            state.executing = false;
            break;
    }

    return state;
}
