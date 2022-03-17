#!/bin/bash

jq -n --arg gateway_endpoint "$GATEWAY_HOST" \
--arg auth_endpoint "$AUTH_HOST" \
--arg ehr_endpoint "$EHR_APP_HOST" \
--arg patient_data_manager_endpoint "$PATIENT_DATA_MANAGER_HOST" \
--arg kc_endpoint "$KEYCLOAK_HOST" \
--arg kc_realm "$KEYCLOAK_REALM" \
--arg sandbox_endpoint "$SANDBOX_HOST" \
--arg sandbox_api "$SANDBOX_API" \
--arg inferno_community "$INFERNO_COMMUNITY" \
-f ./xsettings_template.json > xsettings.json

