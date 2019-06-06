import React, { Component } from 'react';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError, loadProfileResources, loadResource
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from "material-ui/styles/muiThemeable";
import Manage from './Manage';
import Page from 'sandbox-manager-lib/components/Page';
import HelpButton from '../../UI/HelpButton';

import './styles.less';

class Profiles extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'profiles'
        };
    }

    componentDidMount () {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.loadProfiles();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let helpIcon = <HelpButton style={{ marginLeft: '10px' }} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/79364100/Sandbox+Persona'/>;

        return <div className='profiles-wrapper page-content-wrapper'>
            <Page title='Profiles' helpIcon={helpIcon}>
                <Manage palette={palette} {...this.props} />
            </Page>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        sds: state.fhir.sds,
        profileSDsLoading: state.fhir.profileSDsLoading,
        profileResources: state.fhir.profileResources,
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        profileResource: state.fhir.resource,
        profilesLoading: state.fhir.profilesLoading,
        profilesUploading: state.fhir.profilesUploading,
        profilePagination: state.fhir.profilePagination,
        validationExecuting: state.fhir.validationExecuting,
        fetchingProfileResource: state.fhir.fetchingResource,
        profilesUploadingStatus: state.fhir.profilesUploadingStatus,
        fetchingFile: state.fhir.fetchingFile
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError, loadProfileResources, loadResource
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Profiles)));
