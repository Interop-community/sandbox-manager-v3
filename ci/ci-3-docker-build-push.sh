#!/usr/bin/env bash

docker build -t 745222113226.dkr.ecr.us-east-1.amazonaws.com/interop/sandbox-manager-prototype:discovery ..
aws ecr get-login-password | docker login --username AWS --password-stdin 745222113226.dkr.ecr.us-east-1.amazonaws.com
docker push 745222113226.dkr.ecr.us-east-1.amazonaws.com/interop/sandbox-manager-prototype:discovery

