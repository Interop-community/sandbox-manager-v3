import React, { Component } from 'react';
import { Tabs, Tab, Toggle } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError, loadProfileResources, loadResource
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from "material-ui/styles/muiThemeable";
import Manage from './Manage';
import Validation from './Validation';

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

        return <div className='profiles-wrapper page-content-wrapper'>
            <Tabs className='profiles-tabs' contentContainerClassName='profiles-tabs-container' inkBarStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}>
                <Tab label="Profiles" className={'profiles tab' + (this.state.activeTab === 'profiles' ? ' active' : '')} onActive={() => this.setActiveTab('profiles')}>
                    <Manage palette={palette} {...this.props} />
                </Tab>
                <Tab label="Validation" className={'validation tab' + (this.state.activeTab === 'validation' ? ' active' : '')} onActive={() => this.setActiveTab('validation')}>
                    <Validation palette={palette} {...this.props} />
                </Tab>
            </Tabs>
        </div>
    }

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab });
    };
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
