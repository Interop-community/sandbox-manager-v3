FROM node:8.11.1

# python and relevant tools
RUN apt-get update && apt-get install -y \
    build-essential \
    python \
    python-dev \
    libxml2-dev \
    libxslt-dev \
    libssl-dev \
    zlib1g-dev \
    libyaml-dev \
    libffi-dev \
    python-pip \
    less \
    apt-utils

# General dev tools
RUN apt-get install -y git

# Latest versions of python tools via pip
# RUN pip install --upgrade pip \
#                           virtualenv \
#                           requests

COPY awsV2 /usr/local/aws-cli
RUN ln -s /usr/local/aws-cli/bin/aws /usr/local/bin/aws

RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"  --output /usr/local/bin/kubectl && chmod +x /usr/local/bin/kubectl 

COPY config /root/.aws/config
COPY session.sh /root/session.sh


CMD source /root/session.sh
