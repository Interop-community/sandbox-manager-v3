import * as types from "./types";
import API from '../../lib/api';

export function fhir_Reset () {
    return { type: types.FHIR_RESET };
}

export function fhir_SetContext (context) {
    return {
        type: types.FHIR_SET_CONTEXT,
        payload: context
    };
}

export function fhir_SetMeta (payload) {
    return {
        type: types.FHIR_SET_META,
        payload
    };
}

export function fhir_SetParsedPatientDemographics (data) {
    return {
        type: types.FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS,
        payload: data
    };
}

export function fhir_setCustomSearchExecuting (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setLoadingMetadata (loading) {
    return {
        type: types.FHIR_SET_METADATA_LOADING,
        payload: { loading }
    };
}

export function fhir_setMetadata (data) {
    return {
        type: types.FHIR_SET_METADATA,
        payload: { data }
    };
}

export function fhir_setResourcesCount (data) {
    return {
        type: types.FHIR_SET_RESOURCES_COUNT,
        payload: { data }
    };
}

export function fhir_setCustomSearchGettingNextPage (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_GETTING_NEXT_PAGE,
        payload: { executing }
    };
}

export function fhir_SetSampleData () {
    return { type: types.FHIR_SET_SAMPLE_DATA };
}

export function fhir_setCustomSearchResults (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS,
        payload: { results }
    }
}

export function fhir_setCustomSearchResultsNext (results) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_RESULTS_NEXT,
        payload: { results }
    }
}

export function fhir_setExportSearchResults (exportResults) {
    return {
        type: types.FHIR_SET_EXPORT_SEARCH_RESULTS,
        payload: { exportResults }
    }
}

export function fhir_SetSmart (payload) {
    return dispatch => {
        if (payload.status === 'ready') {
            window.fhirClient = FHIR.client({
                serviceUrl: payload.data.server.serviceUrl, // Overwrite response.iss with internal Fhir Api data store
                credentials: 'include',
                auth: {
                    type: 'bearer',
                    token: payload.data.tokenResponse.access_token
                }
            });
        }

        dispatch({ type: types.FHIR_SET_SMART, payload });
    }
}

export function customSearch (query, endpoint) {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults(null));
        dispatch(fhir_setCustomSearchExecuting(true));

        endpoint = endpoint ? endpoint : window.fhirClient.server.serviceUrl;
        API.get(`${endpoint}/${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResults(data));
                dispatch(fhir_setCustomSearchExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchExecuting(false));
            });
    }
}

export function getMetadata () {
    return dispatch => {
        dispatch(fhir_setLoadingMetadata(true));
        API.get(`${window.fhirClient.server.serviceUrl}/metadata?_format=json&_pretty=true`, dispatch)
            .then(data => {
                dispatch(fhir_setMetadata(data));
                dispatch(getResourcesCount(data));
                dispatch(fhir_setLoadingMetadata(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingMetadata(false));
            });
    }
}

export function getResourcesCount (data) {
    return dispatch => {
        let counts = {};
        let promises = [];
        data.rest[0].resource.map(res => {
            promises.push(new Promise(resolve => {
                API.get(`${window.fhirClient.server.serviceUrl}/${res.type}?_count=1`, dispatch)
                    .then(d => {
                        counts[res.type] = d.total;
                        resolve();
                    })
            }))
        });
        Promise.all(promises)
            .then(() => {
                dispatch(fhir_setResourcesCount(counts));
            })
    };
}

export function customSearchNextPage (link) {
    return dispatch => {
        dispatch(fhir_setCustomSearchGettingNextPage(true));

        API.get(link.url, dispatch)
            .then(data => {
                dispatch(fhir_setCustomSearchResultsNext(data));
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchGettingNextPage(false));
            });
    }
}

export function clearSearchResults () {
    return dispatch => {
        dispatch(fhir_setCustomSearchResults());
    }
}
