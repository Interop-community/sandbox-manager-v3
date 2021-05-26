# HSPC Sandbox Manager

Welcome to the Interop Community Sandbox Manager!  

# Interop Community Sandbox

*Note:* If you are wanting to build and test SMART on FHIR Apps, it is recommended that you use the free cloud-hosted version of the HSPC Sandbox.

[Interop Community Sandbox](https://sandbox.interop.community)

### How do I set up? ###


#### Step 1: Build and Deploy ####

You can build and deploy Locally or on Docker

###### For Local Deployment
    ./run-local.sh

###### For Docker Deployment ####

    ./run-local-docker.sh

The set up process is complete and your project is running now.  The service is available at:
* http://localhost:3001/

#### Configuration ####

Various property files configure the sandbox manager:

 * package.json

#### System Dependencies ####
When run locally, the sandbox manager has dependencies on the following systems/projects.  Each of these projects contains a "run-local" script in the root folder.

 * [HSPC Reference Auth](https://bitbucket.org/hspconsortium/reference-auth)
 * [HSPC Reference API](https://bitbucket.org/hspconsortium/reference-api) in DSTU2 or STU3 mode
 * [HSPC Reference Messaging](https://bitbucket.org/hspconsortium/reference-messaging)
 * [HSPC Account](https://bitbucket.org/hspconsortium/account)
 * [HSPC Patient Data Manager](https://bitbucket.org/hspconsortium/patient-data-manager)
 * [HSPC Sandbox Manager API](https://bitbucket.org/hspconsortium/sandbox-manager-api)

### Where to go from here ###
https://healthservices.atlassian.net/wiki/display/HSPC/Healthcare+Services+Platform+Consortium
