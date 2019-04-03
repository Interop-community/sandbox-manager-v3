import React, { Component } from 'react';
import { Tabs, Tab, Card, CardTitle, RaisedButton, List, ListItem, TextField, CircularProgress, Dialog, Toggle, IconButton, Paper, Menu, MenuItem, Popover, Chip } from 'material-ui';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    importData, app_setScreen, customSearch, fhir_setCustomSearchResults, clearResults, loadExportResources, getDefaultUserForSandbox, cancelDownload, customSearchNextPage, validate, validateExisting,
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from "material-ui/styles/muiThemeable";
import Page from 'sandbox-manager-lib/components/Page';
import ListIcon from 'material-ui/svg-icons/action/list';
import DownIcon from "material-ui/svg-icons/navigation/arrow-drop-down";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import ReactJson from 'react-json-view';

import './styles.less';
import HelpButton from '../../UI/HelpButton';
import TreeBrowser from './TreeBrowser';
import ResultsTable from './ResultsTable';

const PROFILES = [
    {
        title: 'US-Core',
        id: 'US-Core',
        url: 'https://simplifier.net/US-Core'
    },
    {
        title: 'QiCore',
        id: 'QiCore',
        url: 'https://simplifier.net/QiCore'
    },
    {
        title: 'DQM',
        id: 'DQM',
        url: 'https://simplifier.net/DQM'
    },
    {
        title: 'fpar',
        id: 'fpar',
        url: 'https://simplifier.net/fpar'
    },
    {
        title: 'HEDIS',
        id: 'HEDIS',
        url: 'https://simplifier.net/HEDIS'
    },
    {
        title: 'Simplifier.Core.STU3.Extensions',
        id: 'Simplifier.Core.STU3.Extensions',
        url: 'https://simplifier.net/Simplifier.Core.STU3.Extensions'
    },
    {
        title: 'Manual',
        id: 'manual',
        url: 'Manual'
    }
];

class Profiles extends Component {
    timer = null;

    constructor (props) {
        super(props);

        this.state = {
            query: '',
            project: '',
            simplifireProjectName: '',
            activeTab: 'browse',
            canFit: 2,
            resultsView: true,
            selectedPersona: undefined,
            showZipWarning: false,
            menuActive: false,
            simplifierInputVisible: false
        };
    }

    componentDidMount () {
        this.props.app_setScreen('profiles');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);

        let canFit = this.calcCanFit();

        this.setState({ canFit });
        this.props.loadProfiles(canFit);

        let element = document.getElementsByClassName('profiles-list')[0];
        element.addEventListener('scroll', this.scroll);
    }

    componentWillUnmount () {
        let element = document.getElementsByClassName('profiles-list')[0];
        element && element.removeEventListener('scroll', this.scroll);
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let tab = this.state.activeTab;
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let styleProps = { underlineFocusStyle, floatingLabelFocusStyle };
        let validateDisabled = (this.state.activeTab === 'browse' && this.state.query.length <= 5)
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);
        let typeButton = <Toggle className='view-toggle' label='Show as table' labelPosition='right' toggled={this.state.resultsView} thumbStyle={{ backgroundColor: palette.primary5Color }}
                                 trackStyle={{ backgroundColor: palette.primary7Color }} thumbSwitchedStyle={{ backgroundColor: palette.primary2Color }}
                                 trackSwitchedStyle={{ backgroundColor: palette.primary2Color }} onToggle={() => this.setState({ resultsView: !this.state.resultsView })}/>;
        let actions = [
            <div className='warning-modal-action'>
                <RaisedButton label='OK' primary onClick={this.toggleWarningModal}/>
            </div>
        ];
        let inputModalActions = [
            <div key={1} className='input-modal-action'>
                <RaisedButton label='Load' primary onClick={this.loadRemoteFile} disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifireProjectName.length < 2)}/>
            </div>,
            <div key={2} className='input-modal-action'>
                <RaisedButton label='Cancel' onClick={this.toggleInputModal}/>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();

        let titleStyle = {
            backgroundColor: palette.primary2Color,
            color: palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let profile = this.props.validationResults && this.props.validationResults.validatedProfile && this.props.profiles.find(i => i.url === this.props.validationResults.validatedProfile) || {};

        return <Page title={<span>Profiles <span style={{ fontSize: '14px', verticalAlign: 'middle' }}>[BETA]</span></span>}
                     helpIcon={<HelpButton style={{ marginLeft: '10px' }} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
            {this.state.showZipWarning && <Dialog open={this.state.showZipWarning} modal={false} onRequestClose={this.toggleWarningModal} actions={actions} contentStyle={{ width: '350px' }}>
                <div className='sandbox-edit-modal'>
                    <div className='screen-title' style={titleStyle}>
                        <IconButton className="close-button" onClick={this.toggleWarningModal}>
                            <i className="material-icons">close</i>
                        </IconButton>
                        <h1 style={titleStyle}>Incorrect file type</h1>
                    </div>
                    <div>
                        <p>
                            Only zip files are allowed!
                        </p>
                    </div>
                </div>
            </Dialog>}
            {this.state.inputModalVisible && <Dialog open={this.state.inputModalVisible} modal={false} onRequestClose={this.toggleInputModal} actions={inputModalActions} contentStyle={{ width: '412px' }}
                                                     bodyClassName='project-input-modal'>
                <Paper className='paper-card'>
                    <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.toggleInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h3>{this.state.simplifierInputVisible ? 'Import "simplifier" project' : 'Import profile'}</h3>
                    <div className="client-details">
                        {!this.state.simplifierInputVisible &&
                        <div className='buttons-wrapper'>
                            <RaisedButton label='"simplifier" project' primary onClick={() => this.setState({ simplifierInputVisible: true })}/>
                            <RaisedButton label='archive' primary onClick={() => this.refs.fileZip.click() || this.toggleInputModal()}/>
                        </div>}
                        {this.state.simplifierInputVisible &&
                        <div style={{ padding: '20px' }}>
                            <Chip className={'chip' + (this.state.menuActive ? ' active' : '')} onClick={() => this.setState({ menuActive: true })}
                                  backgroundColor={this.state.menuActive ? palette.primary2Color : undefined} labelColor={this.state.menuActive ? palette.alternateTextColor : undefined}>
                                <span ref='project-menu'/>
                                <span className='title'>{this.state.project ? this.state.project : 'Select a project to import'}</span>
                                <span className='icon-wrapper'>
                                   <DownIcon style={{ position: 'relative', top: '5px' }} color={!this.state.menuActive ? palette.primary3Color : 'white'}/>
                                </span>
                            </Chip>
                            {this.state.project !== 'manual' && this.state.project !== '' && <a href={PROFILES.find(i => i.id === this.state.project).url} target='_blank'>Visit project</a>}
                            {this.state.project === 'manual' && <TextField value={this.state.simplifireProjectName} onChange={(_, simplifireProjectName) => this.setState({ simplifireProjectName })}
                                                                           id='simplifireProjectName' floatingLabelText='Project id' className='project-name'/>}
                            <Popover open={this.state.menuActive} anchorEl={this.refs['project-menu']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} className='left-margin' onRequestClose={() => this.setState({ menuActive: false })}>
                                <Menu className='type-filter-menu' width='200px' desktop autoWidth={false}>
                                    {PROFILES.map(profile =>
                                        <MenuItem className='type-filter-menu-item' primaryText={profile.title} onClick={() => this.setState({ menuActive: false, project: profile.id })}/>
                                    )}
                                </Menu>
                            </Popover>
                        </div>}
                    </div>
                </Paper>
            </Dialog>}
            <div className='profiles-wrapper'>
                <Card className='card profile-list-wrapper'>
                    <CardTitle className='card-title'>
                        <span>Profiles</span>
                    </CardTitle>
                    <div className='card-content import-button left-padding'>
                        <div className='file-load-wrapper'>
                            <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip} accept='application/zip'/>
                            <RaisedButton label='Add profile(s)' primary onClick={this.toggleInputModal}/>
                        </div>
                        <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                            {this.getList(palette)}
                        </div>
                        <div className='white-shadow'/>
                    </div>
                </Card>
                <Card className='card validate-card'>
                    <CardTitle className='card-title'>
                        <span>Validation</span>
                    </CardTitle>
                    <div className='validate-wrapper'>
                        <Tabs className='validate-tabs' contentContainerClassName={`validate-tabs-container ${this.state.activeTab === 'browse' ? 'no-padding' : ''}`}
                              inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }} value={this.state.activeTab}>
                            <Tab label={<span><ListIcon style={{ color: tab === 'browse' ? palette.primary5Color : palette.primary3Color }}/> Browse</span>}
                                 className={'manual-input tab' + (tab === 'browse' ? ' active' : '')} onActive={() => this.setActiveTab('browse')} value='browse'>
                                <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)}
                                             selectPatient={this.selectPatient}/>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'existing' ? palette.primary5Color : palette.primary3Color }}/> URI</span>}
                                 className={'manual-input tab' + (tab === 'existing' ? ' active' : '')} onActive={() => this.setActiveTab('existing')} value='existing'>
                                <div>
                                    <div className='tab-title'>Existing resource uri</div>
                                    <TextField fullWidth id='query' {...styleProps} onChange={(_, query) => this.setState({ query, manualJson: '', file: '', fileJson: '' })}
                                               hintText='Patient/smart-613876' value={this.state.query}/>
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'file' ? palette.primary5Color : palette.primary3Color }}/> File</span>}
                                 className={'manual-input tab' + (tab === 'file' ? ' active' : '')} onActive={() => this.setActiveTab('file')} value='file'>
                                <div>
                                    <input value='' type='file' id='file' ref='file' style={{ display: 'none' }} onChange={this.readFile} accept='application/json'/>
                                    <div className='tab-title'>Validate resource from file</div>
                                    <RaisedButton label='Select file' primary onClick={() => this.refs.file.click()}/>
                                    {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                                </div>
                            </Tab>
                            <Tab label={<span><ListIcon style={{ color: tab === 'json-input' ? palette.primary5Color : palette.primary3Color }}/> JSON</span>}
                                 className={'manual-input tab' + (tab === 'json-input' ? ' active' : '')} onActive={() => this.setActiveTab('json-input')} value='json-input'>
                                <div>
                                    <span className='tab-title'>JSON</span>
                                    <RaisedButton className='clear-json-button' disabled={!this.state.manualJson} label='CLEAR' primary onClick={() => this.setState({ manualJson: '' })}/>
                                    <TextField className='manual-input' hintText='Paste fhir resource json here' {...styleProps} multiLine fullWidth value={this.state.manualJson}
                                               onChange={(_, manualJson) => this.setState({ query: '', file: '', fileJson: '', manualJson })}/>
                                </div>
                            </Tab>
                        </Tabs>
                        <RaisedButton className='validate-button' label='Validate' primary onClick={this.validate} disabled={validateDisabled}/>
                    </div>
                </Card>
                <Card className='card result-card'>
                    <CardTitle className='card-title'>
                        <span>Validation result {this.props.validationResults && typeButton}</span>
                        <span className='validate-by-title'>
                            {this.props.validationResults && <span>Validated <strong>{this.props.validationResults.validatedObject}</strong> </span>}
                            {this.props.validationResults && this.props.validationResults.validatedProfile
                                ? <span>against <strong>{profile.name}</strong></span>
                                : ''}
                        </span>
                    </CardTitle>
                    <div className='validate-result-wrapper'>
                        {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                        {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                        {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
                    </div>
                </Card>
            </div>
        </Page>
    }

    toggleInputModal = () => {
        this.setState({ inputModalVisible: !this.state.inputModalVisible, simplifierInputVisible: false });
    };

    loadRemoteFile = () => {
        let project = this.state.project !== 'manual' ? this.state.project : this.state.simplifireProjectName;
        this.props.loadProject(project, this.state.canFit);
        this.toggleInputModal();
    };

    calcCanFit = () => {
        let containerHeight = document.getElementsByClassName('profiles-list')[0].clientHeight;
        // we calculate how much patients we can show on the screen and get just that much plus two so that we have content below the fold
        return Math.ceil(containerHeight / 55) + 2;
    };

    scroll = () => {
        let stage = document.getElementsByClassName('profiles-list')[0];
        let dif = stage.scrollHeight - stage.scrollTop - stage.offsetHeight;

        let next = this.props.profilePagination && this.props.profilePagination.link && this.props.profilePagination.link.find(i => i.relation === 'next');
        let shouldFetch = dif <= 50 && next && !this.props.profilesLoading;
        shouldFetch && this.props.getProfilesPagination(next);
    };

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
        this.state.fileJson
            ? this.props.validate(this.prepareJSON(JSON.parse(this.state.fileJson)))
            : this.state.manualJson
            ? this.props.validate(this.prepareJSON(JSON.parse(this.state.manualJson)))
            : this.props.validateExisting(this.state.query, this.state.selectedProfile);
        this.state.activeTab === 'browse' && this.setState({ query: '' });
    };

    prepareJSON = (json) => {
        if (this.state.selectedProfile) {
            !json.meta && (json.meta = {});
            json.meta.profile = [this.state.selectedProfile];
        }
        return json;
    };

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab, query: '', manualJson: '', fileJson: '', file: '', selectedPersona: undefined });
    };

    getList = (palette) => {
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div>
            <TextField id='profile-filter' hintText='Filter profiles by name' onChange={(_, value) => this.delayFiltering(value)}
                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            <List className='profiles-list'>
                {(this.props.fetchingFile || this.props.profilesUploading) && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                    <CircularProgress size={40} thickness={5}/>
                    {!!this.props.profilesUploadingStatus.resourceSavedCount && <div>
                        {this.props.profilesUploadingStatus.resourceSavedCount} resources processed
                    </div>}
                    {this.props.fetchingFile && <div>
                        Fetching project
                    </div>}
                </div>}
                {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                    if (this.state.filter && profile.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1) {
                        return;
                    }
                    let classes = 'profile-list-item' + (this.state.selectedProfile === profile.url ? ' active' : '');
                    return <ListItem key={key} className={classes} primaryText={profile.name} hoverColor='transparent' onClick={() => this.toggleProfile(profile.url)}
                                     rightIconButton={<IconButton tooltip='DELETE' onClick={() => this.props.deleteDefinition(profile, this.state.canFit)}>
                                         <DeleteIcon color={palette.primary4Color}/>
                                     </IconButton>}/>;
                })}
                {this.props.profilesLoading && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                    <CircularProgress size={40} thickness={5}/>
                </div>}
            </List>
        </div>
    };

    delayFiltering = (value) => {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.filter(value);
            this.timer = null;
        }, 500);
    };

    filter = (value) => {
        this.props.loadProfiles(this.state.canFit, value);
    };

    toggleProfile = (url) => {
        let selectedProfile = this.state.selectedProfile === url ? undefined : url;
        this.setState({ selectedProfile });
    };

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.props.uploadProfile(this.refs.fileZip.files[0], this.state.canFit);
        } else {
            this.toggleWarningModal();
        }
    };

    toggleWarningModal = () => {
        this.setState({ showZipWarning: !this.state.showZipWarning });
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

const mapStateToProps = state => {
    return {
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
    cleanValidationResults, uploadProfile, loadProfiles, getProfilesPagination, loadProject, deleteDefinition
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Profiles)));
