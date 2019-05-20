import React, { Component } from 'react';
import { Tabs, Tab, Toggle } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError
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
            query: '',
            project: '',
            profileName: '',
            profileId: '',
            simplifireProjectName: '',
            activeTab: 'browse',
            canFit: 2,
            resultsView: true,
            selectedPersona: undefined,
            showZipWarning: false,
            menuActive: false,
            simplifierInputVisible: false,
            profileInputModalVisible: false
        };
    }

    componentDidMount () {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.loadProfiles();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let tab = this.state.activeTab;


        let typeButton = <Toggle className='view-toggle' label='Show as table' labelPosition='right' toggled={this.state.resultsView} thumbStyle={{ backgroundColor: palette.primary5Color }}
                                 trackStyle={{ backgroundColor: palette.primary7Color }} thumbSwitchedStyle={{ backgroundColor: palette.primary2Color }}
                                 trackSwitchedStyle={{ backgroundColor: palette.primary2Color }} onToggle={() => this.setState({ resultsView: !this.state.resultsView })}/>;

        let profile = this.state.selectedProfile && this.props.profiles.find(i => i.profileId === this.state.selectedProfile) || {};

        let managerProps = {
            palette,
            profiles: this.props.profiles,
            loadProject: this.props.loadProject,
            loadProfiles: this.props.loadProfiles,
            fetchingFile: this.props.fetchingFile,
            uploadProfile: this.props.uploadProfile,
            loadProfileSDs: this.props.loadProfileSDs,
            profilesLoading: this.props.profilesLoading,
            deleteDefinition: this.props.deleteDefinition,
            profilesUploading: this.props.profilesUploading,
            cleanValidationResults: this.props.cleanValidationResults,
            profilesUploadingStatus: this.props.profilesUploadingStatus
        };
        let validationProps = {
            palette,
            cleanValidationResults: this.props.cleanValidationResults
        };

        return <div className='profiles-wrapper page-content-wrapper'>
            <Tabs className='profiles-tabs' contentContainerClassName='profiles-tabs-container' inkBarStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}>
                <Tab label="Profiles" className={'profiles tab' + (this.state.activeTab === 'profiles' ? ' active' : '')} onActive={() => this.setActiveTab('profiles')}>
                    <Manage {...managerProps} />
                </Tab>
                <Tab label="Validation" className={'validation tab' + (this.state.activeTab === 'validation' ? ' active' : '')} onActive={() => this.setActiveTab('validation')}>
                    <Validation {...validationProps} />
                </Tab>
            </Tabs>
        </div>
    }

    toggleTree = (query) => {
        query = this.state.query !== query ? query : '';
        this.setState({ query, manualJson: '', file: '', fileJson: '' });
    };

    selectPatient = (selectedPersona) => {
        this.setState({ selectedPersona });
    };

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({ query: '', manualJson: '', fileJson, file: file.name });
        };

        fr.readAsText(file);
    };

    validate = () => {
        let manualJSON = this.state.fileJson || this.state.manualJson;
        manualJSON && (manualJSON = this.prepareJSON(JSON.parse(manualJSON)));
        manualJSON && this.props.validate(manualJSON);
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, this.state.selectedProfile);
        this.state.activeTab === 'browse' && this.setState({ query: '' });
    };

    prepareJSON = (json) => {
        if (!json.resourceType) {
            this.props.setGlobalError('No "resourceType" found in the provided object!');
            return;
        }

        if (this.state.selectedProfile) {
            let type = json.resourceType;
            let SD = this.props.sds.find(i => i.profileType === type);

            if (!SD) {
                this.props.setGlobalError(`Unable to validate resource "${type}" against this profile.`);
                return;
            }

            !json.meta && (json.meta = {});
            json.meta.profile = [SD.fullUrl];
        }
        return json;
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab, query: '', manualJson: '', fileJson: '', file: '', selectedPersona: undefined });
    };
}

const mapStateToProps = state => {
    return {
        sds: state.fhir.sds,
        results: state.fhir.customSearchResults,
        validationResults: state.fhir.validationResults,
        gettingNextPage: state.fhir.gettingNextPage,
        exportResults: state.fhir.customExportResults,
        importResults: state.sandbox.importResults,
        dataImporting: state.sandbox.dataImporting,
        exportStatus: state.sandbox.exportStatus,
        profiles: state.fhir.profiles,
        profilePagination: state.fhir.profilePagination,
        profilesLoading: state.fhir.profilesLoading,
        profilesUploading: state.fhir.profilesUploading,
        validationExecuting: state.fhir.validationExecuting,
        profilesUploadingStatus: state.fhir.profilesUploadingStatus,
        fetchingFile: state.fhir.fetchingFile
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, customSearch, fhir_setCustomSearchResults, importData, clearResults, loadExportResources, getDefaultUserForSandbox, customSearchNextPage, cancelDownload, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition, loadProfileSDs, setGlobalError
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Profiles)));
