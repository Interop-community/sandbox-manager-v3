export default {
    loading: false,
    selectedSandbox : '',
    sandboxes : [],
    invitations : [],
    launchScenarios : undefined,
    userInvites : [],
    invitesLoading: false,
    modifyingCustomContext: false,
    userInvitesLoading: false,
    fetchingLoginInfo: false,
    fetchingUserLoginInfo: false,
    loginInfo: [],
    userLoginInfo: [],
    creatingSandbox: false,
    updatingUser: false,
    selecting: false,
    deleting: false,

    fetchingSingleEncounter: false,
    singleEncounter: false,
    singleEncounterLoadingError: false,

    fetchingSingleLocation: false,
    singleLocation: false,
    singleLocationLoadingError: false,

    fetchingSingleIntent: false,
    singleIntent: false,
    singleIntentLoadingError: false,

    fetchingSingleResource: false,
    singleResource: false,
    singleResourceLoadingError: false,

    exportStatus: {
        loading: false,
        error: false,
        resourceList: [],
        details: undefined,
        content: undefined
    },

    notifications: [],
    inviting: false,
    copying: false,
    resetting: false,
    createSandboxError: '',
    lookingForSandbox: false,
    launchScenariosLoading: false,
    launchScenarioCreating: false,
    launchScenarioDeleting: false,
    dataImporting: false,
    lookingForSandboxError: '',
    defaultUser: undefined,
    importResults: undefined,
    lookupSandbox: '',
    sandboxApiEndpointIndexes : [
        {index: "5", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: true, supportsDataSets: true},
        {index: "6", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: true, supportsDataSets: true},
        {index: "7", name: "FHIR R4 (v3.4.0)", fhirVersion: "3.4.0", fhirTag: "3_4_0", altName: "FHIR v3.4.0", canCreate: false, supportsDataSets: true},
        {index: "8", name: "FHIR DSTU 2 (v1.0.2)", fhirVersion: "1.0.2", fhirTag: "1_0_2", altName: "FHIR v1.0.2", canCreate: true, supportsDataSets: true},
        {index: "9", name: "FHIR STU 3 (v3.0.1)", fhirVersion: "3.0.1", fhirTag: "3_0_1", altName: "FHIR v3.0.1", canCreate: true, supportsDataSets: true},
        {index: "10", name: "FHIR R4 (v4.0.0)", fhirVersion: "4.0.0", fhirTag: "4_0_0", altName: "FHIR v4.0.0", canCreate: false, supportsDataSets: true}
    ],
    sandboxApiEndpointIndex: null
}
