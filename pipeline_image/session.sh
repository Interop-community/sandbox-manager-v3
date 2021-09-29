#!/bin/bash

session="$(aws sts assume-role --role-arn "${AWS_ROLE_ARN}" --role-session-name BitBucket-Session)"
ACCESS_KEY="$(echo "${session}" | grep AccessKeyId | awk '{print $2}' | sed 's/\"//g' | sed 's/,//g')"
SECRET_ACCESS_KEY="$(echo "${session}" | grep SecretAccessKey | awk '{print $2}' | sed 's/\"//g' | sed 's/,//g')"
SESSION_TOKEN="$(echo "${session}" | grep SessionToken | awk '{print $2}' | sed 's/\"//g' | sed 's/,//g')"

aws configure set aws_access_key_id $ACCESS_KEY
aws configure set aws_secret_access_key $SECRET_ACCESS_KEY
aws configure set aws_session_token \"$SESSION_TOKEN\"


unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
