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

export function fhir_setLoadingResources (loading) {
    return {
        type: types.FHIR_SET_RESOURCES_LOADING,
        payload: { loading }
    };
}

export function fhir_setMetadata (data) {
    return {
        type: types.FHIR_SET_METADATA,
        payload: { data }
    };
}

export function fhir_setResources (data) {
    return {
        type: types.FHIR_SET_RESOURCES,
        payload: { data }
    };
}

export function fhir_setResourcesCount (data) {
    return {
        type: types.FHIR_SET_RESOURCES_COUNT,
        payload: { data }
    };
}

export function fhir_setValidationResults (results) {
    return {
        type: types.FHIR_SET_VALIDATION_RESULTS,
        payload: { results }
    };
}

export function fhir_setValidationExecuting (executing) {
    return {
        type: types.FHIR_SET_VALIDATION_EXECUTING,
        payload: { executing }
    };
}

export function fhir_setCustomSearchGettingNextPage (executing) {
    return {
        type: types.FHIR_SET_CUSTOM_SEARCH_GETTING_NEXT_PAGE,
        payload: { executing }
    };
}

export function cleanValidationResults () {
    return {
        type: types.FHIR_CLEAN_VALIDATION_RESULTS
    };
}

export function fhir_setProfilesLoading (loading) {
    return {
        type: types.FHIR_SET_PROFDILES_LOADING,
        payload: { loading }
    };
}

export function fhir_setProfiles (profiles) {
    return {
        type: types.FHIR_SET_PROFDILES,
        payload: { profiles }
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

export function loadProfiles () {
    return dispatch => {
        dispatch(fhir_setProfilesLoading(true));

        let endpoint = window.fhirClient.server.serviceUrl;
        API.get(`${endpoint}/StructureDefinition`, dispatch)
            .then(data => {
                dispatch(fhir_setProfiles({
                    "http://hl7.org/fhir/us/core/": [
                        {
                            "date": "2016-08-01T00:00:00+10:00",
                            "jurisdiction": [
                                {
                                    "coding": [
                                        {
                                            "system": "urn:iso:std:iso:3166",
                                            "code": "US",
                                            "display": "United States of America"
                                        }
                                    ]
                                }
                            ],
                            "description": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc). This extension aligns with the C-CDA Birth Sex Observation (LOINC 76689-9).",
                            "title": "US Core Birth Sex Extension",
                            "type": "Extension",
                            "differential": {
                                "element": [
                                    {
                                        "path": "Extension",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "player[classCode=PSN|ANM and determinerCode=INSTANCE]/administrativeGender"
                                            },
                                            {
                                                "identity": "iso11179",
                                                "map": ".patient.administrativeGenderCode"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "isModifier": false,
                                        "definition": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).",
                                        "comment": "The codes required are intended to present birth sex (i.e., the sex recorded on the patient’s birth certificate) and not gender identity or reassigned sex.",
                                        "id": "Extension"
                                    },
                                    {
                                        "path": "Extension.url",
                                        "fixedUri": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                                        "id": "Extension.url"
                                    },
                                    {
                                        "path": "Extension.valueCode",
                                        "min": 0,
                                        "max": "1",
                                        "binding": {
                                            "valueSetReference": {
                                                "reference": "http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex"
                                            },
                                            "strength": "required",
                                            "description": "Code for sex assigned at birth"
                                        },
                                        "id": "Extension.valueCode",
                                        "type": [
                                            {
                                                "code": "code"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://www.healthit.gov"
                                        }
                                    ]
                                }
                            ],
                            "fhirVersion": "3.0.1",
                            "contextType": "resource",
                            "context": [
                                "Patient"
                            ],
                            "id": "us-core-birthsex",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border: 0px #F0F0F0 solid; font-size: 11px; font-family: verdana; vertical-align: top;\"><tr style=\"border: 1px #F0F0F0 solid; font-size: 11px; font-family: verdana; vertical-align: top;\"><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"The logical name of the element\">Name</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Information about the use of the element\">Flags</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Minimum and Maximum # of times the the element can appear in the instance\">Card.</a></th><th style=\"width: 100px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Reference to the type of the element\">Type</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Additional information about the element\">Description &amp; Constraints</a><span style=\"float: right\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Legend for this format\"><img src=\"http://hl7.org/fhir/STU3/help16.png\" alt=\"doco\" style=\"background-color: inherit\"/></a></span></th></tr><tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck1.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_element.gif\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Element\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension\" title=\"A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).\">Extension</a><a name=\"Extension\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\">0..1</td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td></tr>\r\n<tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck10.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"tbl_vjoin.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_element.gif\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Element\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension.url\" title=\"null\">url</a><a name=\"Extension.url\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><span style=\"color: darkgreen\">\"http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex\"</span></td></tr>\r\n<tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck00.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"tbl_vjoin_end.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_primitive.png\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Primitive Data Type\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension.valueCode\" title=\"null\">valueCode</a><a name=\"Extension.valueCode\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\">0..1</td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/datatypes.html#code\">code</a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><span style=\"font-weight:bold\">Binding: </span><a href=\"ValueSet-us-core-birthsex.html\">US Core Birth Sex Value Set</a> (<a href=\"http://hl7.org/fhir/STU3/terminologies.html#required\" title=\"To be conformant, the concept in this element SHALL be from the specified value set.\">required</a>)</td></tr>\r\n<tr><td colspan=\"5\" class=\"hierarchy\"><br/><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Legend for this format\"><img src=\"http://hl7.org/fhir/STU3/help16.png\" alt=\"doco\" style=\"background-color: inherit\"/> Documentation for this format</a></td></tr></table></div>",
                                "status": "generated"
                            },
                            "mapping": [
                                {
                                    "identity": "rim",
                                    "name": "RIM Mapping",
                                    "uri": "http://hl7.org/v3"
                                }
                            ],
                            "kind": "complex-type",
                            "abstract": false,
                            "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Extension",
                            "version": "2.0.0",
                            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:40.000-07:00",
                                "versionId": "1"
                            },
                            "name": "US Core Birth Sex Extension",
                            "publisher": "HL7 US Realm Steering Committee",
                            "derivation": "constraint",
                            "snapshot": {
                                "element": [
                                    {
                                        "path": "Extension",
                                        "condition": [
                                            "ele-1"
                                        ],
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "player[classCode=PSN|ANM and determinerCode=INSTANCE]/administrativeGender"
                                            },
                                            {
                                                "identity": "iso11179",
                                                "map": ".patient.administrativeGenderCode"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "isModifier": false,
                                        "short": "Extension",
                                        "definition": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).",
                                        "comment": "The codes required are intended to present birth sex (i.e., the sex recorded on the patient’s birth certificate) and not gender identity or reassigned sex.",
                                        "constraint": [
                                            {
                                                "severity": "error",
                                                "xpath": "@value|f:*|h:div",
                                                "expression": "children().count() > id.count()",
                                                "source": "Element",
                                                "human": "All FHIR elements must have a @value or children",
                                                "key": "ele-1"
                                            },
                                            {
                                                "severity": "error",
                                                "xpath": "exists(f:extension)!=exists(f:*[starts-with(local-name(.), 'value')])",
                                                "expression": "extension.exists() != value.exists()",
                                                "source": "Extension",
                                                "human": "Must have either extensions or value[x], not both",
                                                "key": "ext-1"
                                            }
                                        ],
                                        "id": "Extension",
                                        "base": {
                                            "path": "Extension",
                                            "min": 0,
                                            "max": "*"
                                        }
                                    },
                                    {
                                        "path": "Extension.id",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "n/a"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "short": "xml:id (or equivalent in JSON)",
                                        "definition": "unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces.",
                                        "id": "Extension.id",
                                        "type": [
                                            {
                                                "code": "string"
                                            }
                                        ],
                                        "representation": [
                                            "xmlAttr"
                                        ],
                                        "base": {
                                            "path": "Element.id",
                                            "min": 0,
                                            "max": "1"
                                        }
                                    },
                                    {
                                        "path": "Extension.extension",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "n/a"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "*",
                                        "short": "Additional Content defined by implementations",
                                        "alias": [
                                            "extensions",
                                            "user content"
                                        ],
                                        "definition": "May be used to represent additional information that is not part of the basic definition of the element. In order to make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension.",
                                        "comment": "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
                                        "id": "Extension.extension",
                                        "type": [
                                            {
                                                "code": "Extension"
                                            }
                                        ],
                                        "base": {
                                            "path": "Element.extension",
                                            "min": 0,
                                            "max": "*"
                                        }
                                    },
                                    {
                                        "path": "Extension.url",
                                        "fixedUri": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "N/A"
                                            }
                                        ],
                                        "min": 1,
                                        "max": "1",
                                        "short": "identifies the meaning of the extension",
                                        "definition": "Source of the definition for the extension code - a logical name or a URL.",
                                        "comment": "The definition may point directly to a computable or human-readable definition of the extensibility codes, or it may be a logical URI as declared in some other specification. The definition SHALL be a URI for the Structure Definition defining the extension.",
                                        "id": "Extension.url",
                                        "type": [
                                            {
                                                "code": "uri"
                                            }
                                        ],
                                        "representation": [
                                            "xmlAttr"
                                        ],
                                        "base": {
                                            "path": "Extension.url",
                                            "min": 1,
                                            "max": "1"
                                        }
                                    },
                                    {
                                        "path": "Extension.valueCode",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "N/A"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "short": "Value of extension",
                                        "binding": {
                                            "valueSetReference": {
                                                "reference": "http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex"
                                            },
                                            "strength": "required",
                                            "description": "Code for sex assigned at birth"
                                        },
                                        "definition": "Value of extension - may be a resource or one of a constrained set of the data types (see Extensibility in the spec for list).",
                                        "id": "Extension.valueCode",
                                        "type": [
                                            {
                                                "code": "code"
                                            }
                                        ],
                                        "base": {
                                            "path": "Extension.value[x]",
                                            "min": 0,
                                            "max": "1"
                                        }
                                    }
                                ]
                            },
                            "resourceType": "StructureDefinition",
                            "status": "draft"
                        },
                        {
                            "date": "2018-08-22T00:00:00+00:00",
                            "valueSet": "http://hl7.org/fhir/us/qicore/ValueSet/qicore-appropriateness-score",
                            "caseSensitive": true,
                            "concept": [
                                {
                                    "code": "extremely-inappropriate",
                                    "display": "Extremely Inappropriate",
                                    "definition": "The procedure is extremely inappropriate"
                                },
                                {
                                    "code": "inappropriate",
                                    "display": "Inappropriate",
                                    "definition": "The procedure is inappropriate"
                                },
                                {
                                    "code": "probably-inappropriate",
                                    "display": "Probably Inappropriate",
                                    "definition": "The procedure is probably inappropriate"
                                },
                                {
                                    "code": "uncertain-inappropriate",
                                    "display": "Uncertain Inappropriate",
                                    "definition": "The appropriateness of the procedure is uncertain, leaning towards inappropriate"
                                },
                                {
                                    "code": "uncertain",
                                    "display": "Uncertain",
                                    "definition": "The appropriateness of the procedure is uncertain"
                                },
                                {
                                    "code": "uncertain-appropriate",
                                    "display": "Uncertain Appropriate",
                                    "definition": "The appropriateness of the procedure is uncertain, leaning towards appropriate"
                                },
                                {
                                    "code": "probably-appropriate",
                                    "display": "Probably Appropriate",
                                    "definition": "The procedure is probably appropriate"
                                },
                                {
                                    "code": "appropriate",
                                    "display": "Appropriate",
                                    "definition": "The procedure is appropriate"
                                },
                                {
                                    "code": "extremely-appropriate",
                                    "display": "Extremely Appropriate",
                                    "definition": "The procedure is extremely appropriate"
                                }
                            ],
                            "description": "The RAND scoring for appropriateness of the procedure.",
                            "experimental": false,
                            "title": "RAND Appropriateness Scores",
                            "version": "3.2.0",
                            "url": "http://hl7.org/fhir/us/uscore/CodeSystem/appropriateness-score",
                            "content": "complete",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:39.000-07:00",
                                "versionId": "1",
                                "profile": [
                                    "http://hl7.org/fhir/StructureDefinition/shareablecodesystem"
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://hl7.org/special/committees/CQI"
                                        }
                                    ]
                                }
                            ],
                            "name": "AppropriatenessScore",
                            "publisher": "Health Level Seven, Inc. - CQI WG",
                            "id": "appropriateness-score",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><h2>RAND Appropriateness Scores</h2><div><p>The RAND scoring for appropriateness of the procedure.</p>\n</div><p>This code system http://hl7.org/fhir/us/qicore/CodeSystem/appropriateness-score defines the following codes:</p><table class=\"codes\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td><td><b>Definition</b></td></tr><tr><td style=\"white-space:nowrap\">extremely-inappropriate<a name=\"appropriateness-score-extremely-inappropriate\"> </a></td><td>Extremely Inappropriate</td><td>The procedure is extremely inappropriate</td></tr><tr><td style=\"white-space:nowrap\">inappropriate<a name=\"appropriateness-score-inappropriate\"> </a></td><td>Inappropriate</td><td>The procedure is inappropriate</td></tr><tr><td style=\"white-space:nowrap\">probably-inappropriate<a name=\"appropriateness-score-probably-inappropriate\"> </a></td><td>Probably Inappropriate</td><td>The procedure is probably inappropriate</td></tr><tr><td style=\"white-space:nowrap\">uncertain-inappropriate<a name=\"appropriateness-score-uncertain-inappropriate\"> </a></td><td>Uncertain Inappropriate</td><td>The appropriateness of the procedure is uncertain, leaning towards inappropriate</td></tr><tr><td style=\"white-space:nowrap\">uncertain<a name=\"appropriateness-score-uncertain\"> </a></td><td>Uncertain</td><td>The appropriateness of the procedure is uncertain</td></tr><tr><td style=\"white-space:nowrap\">uncertain-appropriate<a name=\"appropriateness-score-uncertain-appropriate\"> </a></td><td>Uncertain Appropriate</td><td>The appropriateness of the procedure is uncertain, leaning towards appropriate</td></tr><tr><td style=\"white-space:nowrap\">probably-appropriate<a name=\"appropriateness-score-probably-appropriate\"> </a></td><td>Probably Appropriate</td><td>The procedure is probably appropriate</td></tr><tr><td style=\"white-space:nowrap\">appropriate<a name=\"appropriateness-score-appropriate\"> </a></td><td>Appropriate</td><td>The procedure is appropriate</td></tr><tr><td style=\"white-space:nowrap\">extremely-appropriate<a name=\"appropriateness-score-extremely-appropriate\"> </a></td><td>Extremely Appropriate</td><td>The procedure is extremely appropriate</td></tr></table></div>",
                                "status": "generated"
                            },
                            "resourceType": "CodeSystem",
                            "status": "draft"
                        },
                        {
                            "date": "2018-08-22T00:00:00+00:00",
                            "caseSensitive": true,
                            "concept": [
                                {
                                    "code": "unspecified",
                                    "display": "Not Specified",
                                    "definition": "The criticality of the condition is not specified"
                                },
                                {
                                    "code": "self-resolving",
                                    "display": "Expected to Self-Resolve",
                                    "definition": "The condition is expected to resolve on its own"
                                },
                                {
                                    "code": "controllable",
                                    "display": "Controllable",
                                    "definition": "The condition is considered to be controllable"
                                },
                                {
                                    "code": "functional-loss",
                                    "display": "Potential loss of function or capacity",
                                    "definition": "The condition may result in partial or full loss of function or capacity"
                                },
                                {
                                    "code": "life-threatening",
                                    "display": "Life Threatening",
                                    "definition": "The condition is considered to be life-threatening"
                                },
                                {
                                    "code": "requires-hospitalization",
                                    "display": "Requires Hospitalization",
                                    "definition": "The condition requires hospitalization"
                                }
                            ],
                            "description": "Value Set for QICore Condition Criticality (Example)",
                            "experimental": false,
                            "title": "QICore Condition Criticality Codes",
                            "version": "3.2.0",
                            "url": "http://hl7.org/fhir/us/uscore/CodeSystem/condition-criticality",
                            "content": "complete",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:40.000-07:00",
                                "versionId": "1",
                                "profile": [
                                    "http://hl7.org/fhir/StructureDefinition/shareablecodesystem"
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://hl7.org/special/committees/CQI"
                                        }
                                    ]
                                }
                            ],
                            "name": "ConditionCriticality",
                            "publisher": "Health Level Seven, Inc. - CQI WG",
                            "id": "condition-criticality",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><h2>QICore Condition Criticality Codes</h2><div><p>Value Set for QICore Condition Criticality (Example)</p>\n</div><p>This code system http://hl7.org/fhir/us/qicore/CodeSystem/condition-criticality defines the following codes:</p><table class=\"codes\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td><td><b>Definition</b></td></tr><tr><td style=\"white-space:nowrap\">unspecified<a name=\"condition-criticality-unspecified\"> </a></td><td>Not Specified</td><td>The criticality of the condition is not specified</td></tr><tr><td style=\"white-space:nowrap\">self-resolving<a name=\"condition-criticality-self-resolving\"> </a></td><td>Expected to Self-Resolve</td><td>The condition is expected to resolve on its own</td></tr><tr><td style=\"white-space:nowrap\">controllable<a name=\"condition-criticality-controllable\"> </a></td><td>Controllable</td><td>The condition is considered to be controllable</td></tr><tr><td style=\"white-space:nowrap\">functional-loss<a name=\"condition-criticality-functional-loss\"> </a></td><td>Potential loss of function or capacity</td><td>The condition may result in partial or full loss of function or capacity</td></tr><tr><td style=\"white-space:nowrap\">life-threatening<a name=\"condition-criticality-life-threatening\"> </a></td><td>Life Threatening</td><td>The condition is considered to be life-threatening</td></tr><tr><td style=\"white-space:nowrap\">requires-hospitalization<a name=\"condition-criticality-requires-hospitalization\"> </a></td><td>Requires Hospitalization</td><td>The condition requires hospitalization</td></tr></table></div>",
                                "status": "generated"
                            },
                            "resourceType": "CodeSystem",
                            "status": "draft"
                        }
                    ],
                    "http://hl7.org/fhir/us/uscore/": [
                        {
                            "date": "2016-08-01T00:00:00+10:00",
                            "jurisdiction": [
                                {
                                    "coding": [
                                        {
                                            "system": "urn:iso:std:iso:3166",
                                            "code": "US",
                                            "display": "United States of America"
                                        }
                                    ]
                                }
                            ],
                            "description": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc). This extension aligns with the C-CDA Birth Sex Observation (LOINC 76689-9).",
                            "title": "US Core Birth Sex Extension",
                            "type": "Extension",
                            "differential": {
                                "element": [
                                    {
                                        "path": "Extension",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "player[classCode=PSN|ANM and determinerCode=INSTANCE]/administrativeGender"
                                            },
                                            {
                                                "identity": "iso11179",
                                                "map": ".patient.administrativeGenderCode"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "isModifier": false,
                                        "definition": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).",
                                        "comment": "The codes required are intended to present birth sex (i.e., the sex recorded on the patient’s birth certificate) and not gender identity or reassigned sex.",
                                        "id": "Extension"
                                    },
                                    {
                                        "path": "Extension.url",
                                        "fixedUri": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                                        "id": "Extension.url"
                                    },
                                    {
                                        "path": "Extension.valueCode",
                                        "min": 0,
                                        "max": "1",
                                        "binding": {
                                            "valueSetReference": {
                                                "reference": "http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex"
                                            },
                                            "strength": "required",
                                            "description": "Code for sex assigned at birth"
                                        },
                                        "id": "Extension.valueCode",
                                        "type": [
                                            {
                                                "code": "code"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://www.healthit.gov"
                                        }
                                    ]
                                }
                            ],
                            "fhirVersion": "3.0.1",
                            "contextType": "resource",
                            "context": [
                                "Patient"
                            ],
                            "id": "us-core-birthsex",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border: 0px #F0F0F0 solid; font-size: 11px; font-family: verdana; vertical-align: top;\"><tr style=\"border: 1px #F0F0F0 solid; font-size: 11px; font-family: verdana; vertical-align: top;\"><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"The logical name of the element\">Name</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Information about the use of the element\">Flags</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Minimum and Maximum # of times the the element can appear in the instance\">Card.</a></th><th style=\"width: 100px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Reference to the type of the element\">Type</a></th><th style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Additional information about the element\">Description &amp; Constraints</a><span style=\"float: right\"><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Legend for this format\"><img src=\"http://hl7.org/fhir/STU3/help16.png\" alt=\"doco\" style=\"background-color: inherit\"/></a></span></th></tr><tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck1.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_element.gif\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Element\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension\" title=\"A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).\">Extension</a><a name=\"Extension\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\">0..1</td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td></tr>\r\n<tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck10.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"tbl_vjoin.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_element.gif\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Element\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension.url\" title=\"null\">url</a><a name=\"Extension.url\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><span style=\"color: darkgreen\">\"http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex\"</span></td></tr>\r\n<tr style=\"border: 0px #F0F0F0 solid; padding:0px; vertical-align: top; background-color: white;\"><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px; white-space: nowrap; background-image: url(tbl_bck00.png)\" class=\"hierarchy\"><img src=\"tbl_spacer.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"tbl_vjoin_end.png\" alt=\".\" style=\"background-color: inherit\" class=\"hierarchy\"/><img src=\"icon_primitive.png\" alt=\".\" style=\"background-color: white; background-color: inherit\" title=\"Primitive Data Type\" class=\"hierarchy\"/> <a href=\"StructureDefinition-us-core-birthsex-definitions.html#Extension.valueCode\" title=\"null\">valueCode</a><a name=\"Extension.valueCode\"> </a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\">0..1</td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><a href=\"http://hl7.org/fhir/STU3/datatypes.html#code\">code</a></td><td style=\"vertical-align: top; text-align : left; background-color: white; border: 0px #F0F0F0 solid; padding:0px 4px 0px 4px\" class=\"hierarchy\"><span style=\"font-weight:bold\">Binding: </span><a href=\"ValueSet-us-core-birthsex.html\">US Core Birth Sex Value Set</a> (<a href=\"http://hl7.org/fhir/STU3/terminologies.html#required\" title=\"To be conformant, the concept in this element SHALL be from the specified value set.\">required</a>)</td></tr>\r\n<tr><td colspan=\"5\" class=\"hierarchy\"><br/><a href=\"http://hl7.org/fhir/STU3/formats.html#table\" title=\"Legend for this format\"><img src=\"http://hl7.org/fhir/STU3/help16.png\" alt=\"doco\" style=\"background-color: inherit\"/> Documentation for this format</a></td></tr></table></div>",
                                "status": "generated"
                            },
                            "mapping": [
                                {
                                    "identity": "rim",
                                    "name": "RIM Mapping",
                                    "uri": "http://hl7.org/v3"
                                }
                            ],
                            "kind": "complex-type",
                            "abstract": false,
                            "baseDefinition": "http://hl7.org/fhir/StructureDefinition/Extension",
                            "version": "2.0.0",
                            "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:40.000-07:00",
                                "versionId": "1"
                            },
                            "name": "US Core Birth Sex Extension",
                            "publisher": "HL7 US Realm Steering Committee",
                            "derivation": "constraint",
                            "snapshot": {
                                "element": [
                                    {
                                        "path": "Extension",
                                        "condition": [
                                            "ele-1"
                                        ],
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "player[classCode=PSN|ANM and determinerCode=INSTANCE]/administrativeGender"
                                            },
                                            {
                                                "identity": "iso11179",
                                                "map": ".patient.administrativeGenderCode"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "isModifier": false,
                                        "short": "Extension",
                                        "definition": "A code classifying the person's sex assigned at birth  as specified by the [Office of the National Coordinator for Health IT (ONC)](https://www.healthit.gov/newsroom/about-onc).",
                                        "comment": "The codes required are intended to present birth sex (i.e., the sex recorded on the patient’s birth certificate) and not gender identity or reassigned sex.",
                                        "constraint": [
                                            {
                                                "severity": "error",
                                                "xpath": "@value|f:*|h:div",
                                                "expression": "children().count() > id.count()",
                                                "source": "Element",
                                                "human": "All FHIR elements must have a @value or children",
                                                "key": "ele-1"
                                            },
                                            {
                                                "severity": "error",
                                                "xpath": "exists(f:extension)!=exists(f:*[starts-with(local-name(.), 'value')])",
                                                "expression": "extension.exists() != value.exists()",
                                                "source": "Extension",
                                                "human": "Must have either extensions or value[x], not both",
                                                "key": "ext-1"
                                            }
                                        ],
                                        "id": "Extension",
                                        "base": {
                                            "path": "Extension",
                                            "min": 0,
                                            "max": "*"
                                        }
                                    },
                                    {
                                        "path": "Extension.id",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "n/a"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "short": "xml:id (or equivalent in JSON)",
                                        "definition": "unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces.",
                                        "id": "Extension.id",
                                        "type": [
                                            {
                                                "code": "string"
                                            }
                                        ],
                                        "representation": [
                                            "xmlAttr"
                                        ],
                                        "base": {
                                            "path": "Element.id",
                                            "min": 0,
                                            "max": "1"
                                        }
                                    },
                                    {
                                        "path": "Extension.extension",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "n/a"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "*",
                                        "short": "Additional Content defined by implementations",
                                        "alias": [
                                            "extensions",
                                            "user content"
                                        ],
                                        "definition": "May be used to represent additional information that is not part of the basic definition of the element. In order to make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension.",
                                        "comment": "There can be no stigma associated with the use of extensions by any application, project, or standard - regardless of the institution or jurisdiction that uses or defines the extensions.  The use of extensions is what allows the FHIR specification to retain a core level of simplicity for everyone.",
                                        "id": "Extension.extension",
                                        "type": [
                                            {
                                                "code": "Extension"
                                            }
                                        ],
                                        "base": {
                                            "path": "Element.extension",
                                            "min": 0,
                                            "max": "*"
                                        }
                                    },
                                    {
                                        "path": "Extension.url",
                                        "fixedUri": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "N/A"
                                            }
                                        ],
                                        "min": 1,
                                        "max": "1",
                                        "short": "identifies the meaning of the extension",
                                        "definition": "Source of the definition for the extension code - a logical name or a URL.",
                                        "comment": "The definition may point directly to a computable or human-readable definition of the extensibility codes, or it may be a logical URI as declared in some other specification. The definition SHALL be a URI for the Structure Definition defining the extension.",
                                        "id": "Extension.url",
                                        "type": [
                                            {
                                                "code": "uri"
                                            }
                                        ],
                                        "representation": [
                                            "xmlAttr"
                                        ],
                                        "base": {
                                            "path": "Extension.url",
                                            "min": 1,
                                            "max": "1"
                                        }
                                    },
                                    {
                                        "path": "Extension.valueCode",
                                        "mapping": [
                                            {
                                                "identity": "rim",
                                                "map": "N/A"
                                            }
                                        ],
                                        "min": 0,
                                        "max": "1",
                                        "short": "Value of extension",
                                        "binding": {
                                            "valueSetReference": {
                                                "reference": "http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex"
                                            },
                                            "strength": "required",
                                            "description": "Code for sex assigned at birth"
                                        },
                                        "definition": "Value of extension - may be a resource or one of a constrained set of the data types (see Extensibility in the spec for list).",
                                        "id": "Extension.valueCode",
                                        "type": [
                                            {
                                                "code": "code"
                                            }
                                        ],
                                        "base": {
                                            "path": "Extension.value[x]",
                                            "min": 0,
                                            "max": "1"
                                        }
                                    }
                                ]
                            },
                            "resourceType": "StructureDefinition",
                            "status": "draft"
                        },
                        {
                            "date": "2018-08-22T00:00:00+00:00",
                            "valueSet": "http://hl7.org/fhir/us/qicore/ValueSet/qicore-appropriateness-score",
                            "caseSensitive": true,
                            "concept": [
                                {
                                    "code": "extremely-inappropriate",
                                    "display": "Extremely Inappropriate",
                                    "definition": "The procedure is extremely inappropriate"
                                },
                                {
                                    "code": "inappropriate",
                                    "display": "Inappropriate",
                                    "definition": "The procedure is inappropriate"
                                },
                                {
                                    "code": "probably-inappropriate",
                                    "display": "Probably Inappropriate",
                                    "definition": "The procedure is probably inappropriate"
                                },
                                {
                                    "code": "uncertain-inappropriate",
                                    "display": "Uncertain Inappropriate",
                                    "definition": "The appropriateness of the procedure is uncertain, leaning towards inappropriate"
                                },
                                {
                                    "code": "uncertain",
                                    "display": "Uncertain",
                                    "definition": "The appropriateness of the procedure is uncertain"
                                },
                                {
                                    "code": "uncertain-appropriate",
                                    "display": "Uncertain Appropriate",
                                    "definition": "The appropriateness of the procedure is uncertain, leaning towards appropriate"
                                },
                                {
                                    "code": "probably-appropriate",
                                    "display": "Probably Appropriate",
                                    "definition": "The procedure is probably appropriate"
                                },
                                {
                                    "code": "appropriate",
                                    "display": "Appropriate",
                                    "definition": "The procedure is appropriate"
                                },
                                {
                                    "code": "extremely-appropriate",
                                    "display": "Extremely Appropriate",
                                    "definition": "The procedure is extremely appropriate"
                                }
                            ],
                            "description": "The RAND scoring for appropriateness of the procedure.",
                            "experimental": false,
                            "title": "RAND Appropriateness Scores",
                            "version": "3.2.0",
                            "url": "http://hl7.org/fhir/us/uscore/CodeSystem/appropriateness-score",
                            "content": "complete",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:39.000-07:00",
                                "versionId": "1",
                                "profile": [
                                    "http://hl7.org/fhir/StructureDefinition/shareablecodesystem"
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://hl7.org/special/committees/CQI"
                                        }
                                    ]
                                }
                            ],
                            "name": "AppropriatenessScore",
                            "publisher": "Health Level Seven, Inc. - CQI WG",
                            "id": "appropriateness-score",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><h2>RAND Appropriateness Scores</h2><div><p>The RAND scoring for appropriateness of the procedure.</p>\n</div><p>This code system http://hl7.org/fhir/us/qicore/CodeSystem/appropriateness-score defines the following codes:</p><table class=\"codes\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td><td><b>Definition</b></td></tr><tr><td style=\"white-space:nowrap\">extremely-inappropriate<a name=\"appropriateness-score-extremely-inappropriate\"> </a></td><td>Extremely Inappropriate</td><td>The procedure is extremely inappropriate</td></tr><tr><td style=\"white-space:nowrap\">inappropriate<a name=\"appropriateness-score-inappropriate\"> </a></td><td>Inappropriate</td><td>The procedure is inappropriate</td></tr><tr><td style=\"white-space:nowrap\">probably-inappropriate<a name=\"appropriateness-score-probably-inappropriate\"> </a></td><td>Probably Inappropriate</td><td>The procedure is probably inappropriate</td></tr><tr><td style=\"white-space:nowrap\">uncertain-inappropriate<a name=\"appropriateness-score-uncertain-inappropriate\"> </a></td><td>Uncertain Inappropriate</td><td>The appropriateness of the procedure is uncertain, leaning towards inappropriate</td></tr><tr><td style=\"white-space:nowrap\">uncertain<a name=\"appropriateness-score-uncertain\"> </a></td><td>Uncertain</td><td>The appropriateness of the procedure is uncertain</td></tr><tr><td style=\"white-space:nowrap\">uncertain-appropriate<a name=\"appropriateness-score-uncertain-appropriate\"> </a></td><td>Uncertain Appropriate</td><td>The appropriateness of the procedure is uncertain, leaning towards appropriate</td></tr><tr><td style=\"white-space:nowrap\">probably-appropriate<a name=\"appropriateness-score-probably-appropriate\"> </a></td><td>Probably Appropriate</td><td>The procedure is probably appropriate</td></tr><tr><td style=\"white-space:nowrap\">appropriate<a name=\"appropriateness-score-appropriate\"> </a></td><td>Appropriate</td><td>The procedure is appropriate</td></tr><tr><td style=\"white-space:nowrap\">extremely-appropriate<a name=\"appropriateness-score-extremely-appropriate\"> </a></td><td>Extremely Appropriate</td><td>The procedure is extremely appropriate</td></tr></table></div>",
                                "status": "generated"
                            },
                            "resourceType": "CodeSystem",
                            "status": "draft"
                        },
                        {
                            "date": "2018-08-22T00:00:00+00:00",
                            "caseSensitive": true,
                            "concept": [
                                {
                                    "code": "unspecified",
                                    "display": "Not Specified",
                                    "definition": "The criticality of the condition is not specified"
                                },
                                {
                                    "code": "self-resolving",
                                    "display": "Expected to Self-Resolve",
                                    "definition": "The condition is expected to resolve on its own"
                                },
                                {
                                    "code": "controllable",
                                    "display": "Controllable",
                                    "definition": "The condition is considered to be controllable"
                                },
                                {
                                    "code": "functional-loss",
                                    "display": "Potential loss of function or capacity",
                                    "definition": "The condition may result in partial or full loss of function or capacity"
                                },
                                {
                                    "code": "life-threatening",
                                    "display": "Life Threatening",
                                    "definition": "The condition is considered to be life-threatening"
                                },
                                {
                                    "code": "requires-hospitalization",
                                    "display": "Requires Hospitalization",
                                    "definition": "The condition requires hospitalization"
                                }
                            ],
                            "description": "Value Set for QICore Condition Criticality (Example)",
                            "experimental": false,
                            "title": "QICore Condition Criticality Codes",
                            "version": "3.2.0",
                            "url": "http://hl7.org/fhir/us/uscore/CodeSystem/condition-criticality",
                            "content": "complete",
                            "meta": {
                                "lastUpdated": "2019-02-04T10:22:40.000-07:00",
                                "versionId": "1",
                                "profile": [
                                    "http://hl7.org/fhir/StructureDefinition/shareablecodesystem"
                                ]
                            },
                            "contact": [
                                {
                                    "telecom": [
                                        {
                                            "system": "url",
                                            "value": "http://hl7.org/special/committees/CQI"
                                        }
                                    ]
                                }
                            ],
                            "name": "ConditionCriticality",
                            "publisher": "Health Level Seven, Inc. - CQI WG",
                            "id": "condition-criticality",
                            "text": {
                                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><h2>QICore Condition Criticality Codes</h2><div><p>Value Set for QICore Condition Criticality (Example)</p>\n</div><p>This code system http://hl7.org/fhir/us/qicore/CodeSystem/condition-criticality defines the following codes:</p><table class=\"codes\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td><td><b>Definition</b></td></tr><tr><td style=\"white-space:nowrap\">unspecified<a name=\"condition-criticality-unspecified\"> </a></td><td>Not Specified</td><td>The criticality of the condition is not specified</td></tr><tr><td style=\"white-space:nowrap\">self-resolving<a name=\"condition-criticality-self-resolving\"> </a></td><td>Expected to Self-Resolve</td><td>The condition is expected to resolve on its own</td></tr><tr><td style=\"white-space:nowrap\">controllable<a name=\"condition-criticality-controllable\"> </a></td><td>Controllable</td><td>The condition is considered to be controllable</td></tr><tr><td style=\"white-space:nowrap\">functional-loss<a name=\"condition-criticality-functional-loss\"> </a></td><td>Potential loss of function or capacity</td><td>The condition may result in partial or full loss of function or capacity</td></tr><tr><td style=\"white-space:nowrap\">life-threatening<a name=\"condition-criticality-life-threatening\"> </a></td><td>Life Threatening</td><td>The condition is considered to be life-threatening</td></tr><tr><td style=\"white-space:nowrap\">requires-hospitalization<a name=\"condition-criticality-requires-hospitalization\"> </a></td><td>Requires Hospitalization</td><td>The condition requires hospitalization</td></tr></table></div>",
                                "status": "generated"
                            },
                            "resourceType": "CodeSystem",
                            "status": "draft"
                        }
                    ]
                }));
                dispatch(fhir_setProfilesLoading(false));
            })
            .catch(() => {
                dispatch(fhir_setProfilesLoading(false));
            });
    }
}

export function uploadProfile (file) {
    return (dispatch, getState) => {
        let state = getState();
        let config = state.config.xsettings.data.sandboxManager;
        let formData = new FormData();
        formData.append("file", file);

        let url = config.baseServiceUrl_1;
        if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "2") {
            url = config.baseServiceUrl_2;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "3") {
            url = config.baseServiceUrl_3;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "4") {
            url = config.baseServiceUrl_4;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "5") {
            url = config.baseServiceUrl_5;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "6") {
            url = config.baseServiceUrl_6;
        } else if (state.sandbox.sandboxApiEndpointIndex !== undefined && state.sandbox.sandboxApiEndpointIndex !== "" && state.sandbox.sandboxApiEndpointIndex === "7") {
            url = config.baseServiceUrl_7;
        }

        API.post(`${url}/system/uploadProfile?file=${file.name}&sandboxId=${sessionStorage.sandboxId}`, formData, dispatch, true)
            .then(data => {
                dispatch(fhir_setCustomSearchResults(data));
                dispatch(fhir_setCustomSearchExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setCustomSearchExecuting(false));
            });
    }
}

export function getMetadata (shouldGetResourcesCount = true) {
    return dispatch => {
        dispatch(fhir_setLoadingMetadata(true));
        API.get(`${window.fhirClient.server.serviceUrl}/metadata?_format=json&_pretty=true`, dispatch)
            .then(data => {
                dispatch(fhir_setMetadata(data));
                shouldGetResourcesCount && dispatch(getResourcesCount(data.rest[0].resource));
                dispatch(fhir_setLoadingMetadata(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingMetadata(false));
            });
    }
}

export function fetchResources (type, query = "") {
    return dispatch => {
        dispatch(fhir_setLoadingResources(true));
        API.get(`${window.fhirClient.server.serviceUrl}/${type}?_count=40${query}`, dispatch)
            .then(data => {
                dispatch(fhir_setResources(data));
                dispatch(fhir_setLoadingResources(false));
            })
            .catch(() => {
                dispatch(fhir_setLoadingResources(false));
            });
    }
}

export function validate (object) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        API.post(`${window.fhirClient.server.serviceUrl}/${object.resourceType}/$validate`, object, dispatch)
            .then(data => {
                dispatch(fhir_setValidationResults(data));
                dispatch(fhir_setValidationExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setValidationExecuting(false));
            });
    }
}

export function validateExisting (url) {
    return dispatch => {
        dispatch(fhir_setValidationResults(null));
        dispatch(fhir_setValidationExecuting(true));

        API.get(`${window.fhirClient.server.serviceUrl}/${url}/$validate`, dispatch)
            .then(data => {
                dispatch(fhir_setValidationResults(data));
                dispatch(fhir_setValidationExecuting(false));
            })
            .catch(() => {
                dispatch(fhir_setValidationExecuting(false));
            });
    }
}

export function getResourcesCount (data, query = "") {
    return dispatch => {
        let counts = {};
        let promises = [];
        data.map(res => {
            promises.push(new Promise(resolve => {
                API.get(`${window.fhirClient.server.serviceUrl}/${res.type}?_count=1${query}`, dispatch)
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
