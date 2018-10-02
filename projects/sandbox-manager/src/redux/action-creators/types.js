// config
export const CONFIG_RESET = "config/RESET";
export const CONFIG_SET_XSETTINGS = "config/SET_XSETTINGS";

// fhir
export const FHIR_RESET = "fhir/RESET";
export const FHIR_SET_CONTEXT = "fhir/SET_CONTEXT";
export const FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS = "fhir/FHIR_SET_PARSED_PATIENT_DEMOGRAPHICS";
export const FHIR_SET_SAMPLE_DATA = "fhir/SET_SAMPLE_DATA";
export const FHIR_SET_SMART = "fhir/SET_SMART";
export const FHIR_SET_META = "fhir/SET_META";
export const FHIR_SET_CUSTOM_SEARCH_RESULTS = "fhir/FHIR_SET_CUSTOM_SEARCH_RESULTS";
export const FHIR_SET_CUSTOM_SEARCH_EXECUTING = "fhir/FHIR_SET_CUSTOM_SEARCH_EXECUTING";

// ui
export const UI_SET_CLIENT_WIDTH = "ui/SET_CLIENT_WIDTH";
export const UI_SET_FOOTER_HEIGHT = "ui/SET_FOOTER_HEIGHT";
export const UI_SET_INITIALIZED = "ui/SET_INITIALIZED";
export const UI_SET_RETINA = "ui/SET_RETINA";
export const UI_SET_THEME = "ui/SET_THEME";

// sandbox
export const RESET_SANDBOX = "RESET_SANDBOX";
export const SET_SANDBOX_EXPORT_STATUS = "SET_SANDBOX_EXPORT_STATUS";
export const SET_NOTIFICATIONS_LOADING = "SET_NOTIFICATIONS_LOADING";
export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const DELETE_SANDBOX = "DELETE_SANDBOX";
export const UPDATE_SANDBOX = "UPDATE_SANDBOX";
export const SELECT_SANDBOX = "SELECT_SANDBOX";
export const REMOVE_SANDBOX_USER = "REMOVE_SANDBOX_USER";
export const INVITE_NEW_USER = "INVITE_NEW_USER";
export const SET_FHIR_SERVER_URL = "SET_FHIR_SERVER_URL";
export const FETCH_SANDBOXES_START = "FETCH_SANDBOXES";
export const FETCH_SANDBOXES_SUCCESS = "FETCH_SANDBOXES_SUCCESS";
export const FETCH_SANDBOXES_FAIL = "FETCH_SANDBOXES_FAIL";
export const FETCH_SANDBOX_INVITES_START = "FETCH_SANDBOX_INVITES_START";
export const FETCH_SANDBOX_INVITES_SUCCESS = "FETCH_SANDBOX_INVITES_SUCCESS";
export const FETCH_SANDBOX_INVITES_FAIL = "FETCH_SANDBOX_INVITES_FAIL";
export const CREATING_SANDBOX = "CREATING_SANDBOX";
export const CREATE_SANDBOX_FAIL = "CREATE_SANDBOX_FAIL";
export const CREATE_SANDBOX_SUCCESS = "CREATE_SANDBOX_SUCCESS";
export const LOOKUP_SANDBOX_BY_ID_START = "LOOKUP_SANDBOX_BY_ID_START";
export const FETCHING_LOGIN_INFO = "FETCHING_LOGIN_INFO";
export const FETCHING_USER_LOGIN_INFO = "FETCHING_USER_LOGIN_INFO";
export const LOOKUP_SANDBOX_BY_ID_SUCCESS = "LOOKUP_SANDBOX_BY_ID_SUCCESS";
export const LOOKUP_SANDBOX_BY_ID_FAIL = "LOOKUP_SANDBOX_BY_ID_FAIL";
export const SET_DEFAULT_SANDBOX_USER = "SET_DEFAULT_SANDBOX_USER";
export const SET_RESETTING_CURRENT_SANDBOX = "SET_RESETTING_CURRENT_SANDBOX";
export const SET_DELETING_CURRENT_SANDBOX = "SET_DELETING_CURRENT_SANDBOX";
export const SET_INVITES_LOADING = "SET_INVITES_LOADING";
export const SET_INVITES = "SET_INVITES";
export const SET_DATA_IMPORTING = "SET_DATA_IMPORTING";
export const FETCHING_SINGLE_LOCATION = "FETCHING_SINGLE_LOCATION";
export const SET_SINGLE_LOCATION = "SET_SINGLE_LOCATION";
export const SET_SINGLE_LOCATION_LOAD_ERROR = "SET_SINGLE_LOCATION_LOAD_ERROR";
export const FETCHING_SINGLE_INTENT = "FETCHING_SINGLE_INTENT";
export const SET_SINGLE_INTENT = "SET_SINGLE_INTENT";
export const SET_SINGLE_INTENT_LOAD_ERROR = "SET_SINGLE_INTENT_LOAD_ERROR";
export const FETCHING_SINGLE_RESOURCE = "FETCHING_SINGLE_RESOURCE";
export const SET_SINGLE_RESOURCE = "SET_SINGLE_RESOURCE";
export const SET_SINGLE_RESOURCE_LOAD_ERROR = "SET_SINGLE_RESOURCE_LOAD_ERROR";
export const SET_IMPORT_RESULTS = "SET_IMPORT_RESULTS";
export const CLEAR_RESULTS = "CLEAR_RESULTS";
export const UPDATING_USER = "UPDATING_USER";
export const SET_LOGIN_INFO = "SET_LOGIN_INFO";
export const SET_USER_LOGIN_INFO = "SET_USER_LOGIN_INFO";
export const SET_SANDBOX_SELECTING = "SET_SANDBOX_SELECTING";
export const FETCHING_SINGLE_ENCOUNTER = "FETCHING_SINGLE_ENCOUNTER";
export const SET_SINGLE_ENCOUNTER = "SET_SINGLE_ENCOUNTER";
export const SET_USER_INVITING = "SET_USER_INVITING";
export const SET_SINGLE_ENCOUNTER_LOAD_ERROR = "SET_SINGLE_ENCOUNTER_LOAD_ERROR";
export const ADDING_CUSTOM_CONTENT = "ADDING_CUSTOM_CONTENT";

// users
export const SAVE_ENDPOINT_INDEX = "SAVE_ENDPOINT_INDEX";
export const SAVE_OAUTH_USER = "SAVE_OAUTH_USER";
export const SAVE_SANDBOX_USER = "SAVE_SANDBOX_USER";

// persona
export const LOOKUP_PERSONAS_START = "LOOKUP_PERSONAS_START";
export const LOOKUP_PERSONAS_SUCCESS = "LOOKUP_PERSONAS_SUCCESS";
export const LOOKUP_PERSONAS_FAIL = "LOOKUP_PERSONAS_FAIL";
export const CREATE_PERSONA_START = "CREATE_PERSONA_START";
export const CREATE_PERSONA_END = "CREATE_PERSONA_END";
export const RESET_PERSONAS = "RESET_PERSONAS";

// patient
export const PATIENT_DETAILS_FETCH_STARTED = "PATIENT_DETAILS_FETCH_STARTED";
export const PATIENT_DETAILS_FETCH_SUCCESS = "PATIENT_DETAILS_FETCH_SUCCESS";
export const PATIENT_DETAILS_FETCH_ERROR = "PATIENT_DETAILS_FETCH_ERROR";
export const FETCHING_SINGLE_PATIENT = "FETCHING_SINGLE_PATIENT";
export const SINGLE_PATIENT_DATA = "SINGLE_PATIENT_DATA";
export const SET_PATIENT_DETAILS = "SET_PATIENT_DETAILS";
export const SINGLE_PATIENT_FETCH_FAILED = "SINGLE_PATIENT_FETCH_FAILED";

// rest
export const ALLERGY_INTOLERANCE = "ALLERGY_INTOLERANCE";
export const CARE_PLAN = "CARE_PLAN";
export const CARE_TEAM = "CARE_TEAM";
export const CONDITION = "CONDITION";
export const OBSERVATION = "OBSERVATION";
export const DIAGNOSTIC_REPORT = "DIAGNOSTIC_REPORT";
export const ENCOUNTER = "ENCOUNTER";
export const GOAL = "GOAL";
export const IMMUNIZATION = "IMMUNIZATION";
export const MEDICATION_DISPENSE = "MEDICATION_DISPENSE";
export const MEDICATION_REQUEST = "MEDICATION_REQUEST";
export const PROCEDURE = "PROCEDURE";
export const PROCEDURE_REQUEST = "PROCEDURE_REQUEST";
export const FHIR_INIT = "FHIR_INIT";
export const FHIR_LOGIN = "FHIR_LOGIN";
export const FHIR_LOGIN_SUCCESS = "FHIR_LOGIN_SUCCESS";
export const FHIR_LOGIN_FAIL = "FHIR_LOGIN_FAIL";
export const FHIR_CLEAR_TOKEN = "FHIR_CLEAR_TOKEN";
export const FHIR_CLIENT = "FHIR_CLIENT";
export const FHIR_HSPC_AUTHORIZED = "FHIR_HSPC_AUTHORIZED";
export const FHIR_VERSION = "FHIR_VERSION";

// app
export const SET_APP_SCREEN = "SET_APP_SCREEN";
export const APP_RESET_STATE = "APP_RESET_STATE";
export const SET_APP = "SET_APP";
export const SET_TERMS_LOADING = "SET_TERMS_LOADING";
export const SET_TERMS = "SET_TERMS";

// apps
export const SET_SANDBOX_APPS = "SET_SANDBOX_APPS";
export const SET_SANDBOX_APPS_LOADING = "SET_SANDBOX_APPS_LOADING";
export const SET_SANDBOX_APP_LOADING = "SET_SANDBOX_APP_LOADING";
export const SET_SANDBOX_APPS_CREATING = "SET_SANDBOX_APPS_CREATING";
export const SET_SANDBOX_APPS_DELETING = "SET_SANDBOX_APPS_DELETING";
export const SET_CREATED_APP = "SET_CREATED_APP";

// launch scenarios
export const SET_LAUNCH_SCENARIOS_LOADING = "SET_LAUNCH_SCENARIOS_LOADING";
export const SET_LAUNCH_SCENARIOS = "SET_LAUNCH_SCENARIOS";
export const SET_LAUNCH_SCENARIOS_CREATING = "SET_LAUNCH_SCENARIOS_CREATING";
export const SET_LAUNCH_SCENARIOS_DELETING = "SET_LAUNCH_SCENARIOS_DELETING";
