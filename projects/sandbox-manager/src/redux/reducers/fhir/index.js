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
        case types.FHIR_SET_METADATA_LOADING:
            state.metadataLoading = action.payload.loading;
            break;
        case types.FHIR_SET_METADATA:
            state.metadata = action.payload.data;
            break;
        case types.FHIR_SET_RESOURCES_COUNT:
            state.metadataCounts = action.payload.data;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_EXECUTING:
            state.executing = action.payload.executing;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_GETTING_NEXT_PAGE:
            state.gettingNextPage = action.payload.executing;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_RESULTS:
            state.customSearchResults = action.payload.results;
            break;
        case types.FHIR_SET_CUSTOM_SEARCH_RESULTS_NEXT:
            let results = action.payload.results;
            results.entry = state.customSearchResults.entry.concat(results.entry);
            state.customSearchResults = results;
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
