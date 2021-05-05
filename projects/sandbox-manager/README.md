# Logica Sandbox Manager

Welcome to the Logica Sandbox Manager!  

# Logica Sandbox

*Note:* If you are wanting to build and test SMART on FHIR Apps, it is recommended that you use the free cloud-hosted version of the HSPC Sandbox.

[Logica Sandbox](https://sandbox.interop.community)

### How do I get set up? ###

#### Build and Deploy ####
    ./run-local.sh

#### Build and Deploy Using Docker ####
    ./run-local-docker.sh

#### Verify

* http://localhost:8080/

#### Configuration ####

Various property files configure the sandbox manager:

 * package.json

#### System Dependencies ####
When run locally, the sandbox manager has dependencies on the following systems/projects.  Each of these projects contains a "run-local" script in the root folder.

 * [Logica Reference Auth](https://bitbucket.org/hspconsortium/reference-auth)
 * [Logica Reference API](https://bitbucket.org/hspconsortium/reference-api) in DSTU2 or STU3 mode
 * [Logica Reference Messaging](https://bitbucket.org/hspconsortium/reference-messaging)
 * [Logica Account](https://bitbucket.org/hspconsortium/account)
 * [Logica Patient Data Manager](https://bitbucket.org/hspconsortium/patient-data-manager)
 * [Logica Sandbox Manager API](https://bitbucket.org/hspconsortium/sandbox-manager-api)

### Where to go from here ###
https://healthservices.atlassian.net/wiki/display/HSPC/Healthcare+Services+Platform+Consortium
