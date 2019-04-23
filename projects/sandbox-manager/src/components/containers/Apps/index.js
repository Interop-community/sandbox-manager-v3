import React, { Component, Fragment } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton, RaisedButton, IconButton, FloatingActionButton, RadioButton, Paper, Snackbar, TextField } from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ContentAdd from 'material-ui/svg-icons/content/add';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import Publish from 'material-ui/svg-icons/editor/publish';
import LaunchIcon from 'material-ui/svg-icons/av/play-circle-outline';
import UpdateIcon from 'material-ui/svg-icons/navigation/refresh';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Page from 'sandbox-manager-lib/components/Page';
import ConfirmModal from 'sandbox-manager-lib/components/ConfirmModal';
import API from '../../../lib/api';
import {
    lookupPersonasStart, app_setScreen, doLaunch, fetchPersonas, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, getPersonasPage, resetPersonas, copyToClipboard, launchHook,
    createService, loadServices, updateHook
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import HooksIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/hooks-logo-mono.svg";
import PatientIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/patient.svg";
import PillIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/pill_icon_2.svg";

import AppDialog from './AppDialog';
import HookDialog from './HookDialog';
import PersonaList from "../Persona/List";
import DohMessage from "sandbox-manager-lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";
import { isUrlValid } from '../../../lib/misc';
import HelpButton from '../../UI/HelpButton';

const POSTFIX = '/.well-known/smart/manifest.json';
const NEEDED_PROPS = ['software_id', 'client_name', 'client_uri', 'logo_uri', 'launch_url', 'redirect_uris', 'scope', 'token_endpoint_auth_method', 'grant_types', 'fhir_versions'];

class Apps extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            hookToLaunch: undefined,
            manifest: undefined,
            registerDialogVisible: false,
            selectCreationType: false,
            loadingManifest: false,
            loadDialogVisible: false,
            showConfirmModal: false,
            createApp: undefined,
            appIsLoading: false,
            manifestURL: '',
            serviceName: '',
            textSelected: undefined
        };
    }

    componentDidMount () {
        if (!this.props.hooks) {
            this.props.app_setScreen('apps');
            this.props.loadSandboxApps();
        } else {
            this.props.app_setScreen('hooks');
            this.props.loadServices();
        }
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps (nextProps) {
        this.state.selectedApp && !nextProps.appLoading && !nextProps.appDeleting && this.setState({ appIsLoading: false });
        this.props.appCreating && !nextProps.appCreating && this.setState({ createdApp: nextProps.createdApp });
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let apps = !this.props.hooks && this.getApps();
        let hooks = this.props.hooks && this.getHooks();
        let dialog = this.getDialog();
        let actionClick = this.props.hooks
            ? () => this.setState({ loadDialogVisible: true, serviceName: '', manifestURL: '' })
            : () => this.setState({ selectCreationType: true });
        let url = this.props.hooks
            ? 'https://cds-hooks.org/specification/1.0/'
            : 'https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60915727/Sandbox+Registered+Apps';

        return <Page noTitle={this.props.modal} title={this.props.title ? this.props.title : 'Registered Apps'}
                     helpIcon={<HelpButton style={{ marginLeft: '10px' }} url={url}/>}>
            <div className='apps-page-wrapper'>
                {!this.props.modal && <div className='filter-wrapper'>
                    <div className='actions'>
                        <span className='dummy-expander'/>
                        <FloatingActionButton onClick={actionClick}>
                            <ContentAdd/>
                        </FloatingActionButton>
                    </div>
                </div>}
                <div className={'apps-screen-wrapper' + (this.props.modal ? ' modal' : '')}>
                    {dialog}
                    <div className='screen-content'>
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps}
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && hooks}
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps.length === 0 && this.props.apps &&
                        <DohMessage message='There are no apps in this sandbox platform yet.'/>}
                        {(this.props.appDeleting || this.props.appCreating || this.props.appLoading || this.props.servicesLoading) &&
                        <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                    </div>
                </div>
            </div>
            {this.state.showConfirmModal && <ConfirmModal red open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.delete} onCancel={this.toggleConfirmation} title='Confirm'>
                <p>
                    Are you sure you want to delete app "{this.state.selectedApp ? this.state.selectedApp.clientName : ''}"?<br/>
                    Deleting this app will result in the deletion of all the launch scenarios connected to it.
                </p>
            </ConfirmModal>}
            <Snackbar open={!!this.props.copying} message='Text Copied to Clipboard' autoHideDuration={30000}
                      bodyStyle={{ margin: '0 auto', backgroundColor: palette.primary2Color, textAlign: 'center' }}/>
        </Page>
    }

    getHooks = () => {
        let hooks = [];
        this.props.hooksList.map(service => {
            hooks.push(<div className='service-title-wrapper' key={service.url + '_div'}>
                <h2>{service.title}</h2>
                <span>{service.url}</span>
                {!this.props.modal && <RaisedButton label='Refresh' backgroundColor="#0E5676" labelColor='#FFF' icon={<UpdateIcon/>} className='service-update-button'
                                                    onClick={() => this.props.createService(service.url, service.title)}/>}
                {!this.props.modal && <span className='service-last-updated'>Last updated: {moment(service.lastUpdated).format('YYYY/MM/DD')}</span>}
            </div>);
            return service.cdsHooks.map((hook, index) => {
                hook.title = hook.title ? hook.title : '';
                hook.url = service.url;
                // hook.id = index;
                let titleStyle = { backgroundColor: 'rgba(0,87,120, 0.75)' };
                if (!this.props.modal && !hook.description) {
                    titleStyle.height = '39%';
                    titleStyle.bottom = '-18%';
                }
                hooks.push(<Card title={hook.title} className={`app-card ${this.props.modal ? 'small' : ''} ${this.state.toggledHook === hook.id ? 'active' : ''}`} key={service.url + index}
                                 onTouchStart={() => this.hookCardClick(index)} onClick={() => this.props.onCardClick && this.props.onCardClick(hook, service)}>
                    <div className={`hook-icon-wrapper ${hook.hook}`}>
                        {this.getHookIcon(hook.hook)}
                    </div>
                    <CardMedia className='media-wrapper'>
                        {hook.logoUri && <img style={{ height: '100%' }} src={hook.logoUri} alt='HSPC Logo'/>}
                        {!hook.logoUri && <HooksIcon className='default-hook-icon'/>}
                    </CardMedia>
                    <CardTitle className='card-title' style={titleStyle}>
                        <h3 className='app-name'>{hook.title}</h3>
                        <h3 className='app-name long'>{hook.title.substring(0, 50)}</h3>
                        {this.props.modal && <RadioButton className='app-radio' value="selected"
                                                          checked={this.props.selectedApp ? hook.url === this.props.selectedApp.url && hook.id === this.props.selectedApp.id : false}/>}
                        <div className='app-description'>{hook.description}</div>
                    </CardTitle>
                    {!this.props.modal && <CardActions className='card-actions-wrapper'>
                        <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleLaunch(e, hook)}
                                    icon={<LaunchIcon style={{ width: '24px', height: '24px' }}/>} label='Launch'/>
                        <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleHookSelect(e, hook, service)}
                                    icon={<InfoIcon style={{ width: '24px', height: '24px' }}/>} label='Info'/>
                    </CardActions>}
                </Card>);
            });
        });
        return hooks;
    };

    getHookIcon = (hookType) => {
        switch (hookType) {
            case 'patient-view':
                return <PatientIcon/>;
            case 'medication-prescribe':
                return <PillIcon className='additional-rotation'/>;
        }
        return null;
    };

    handleHookSelect = (e, hook, service) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ selectedHook: hook, service, registerDialogVisible: false, appIsLoading: true });
    };

    getDialog = () => {
        let palette = this.props.muiTheme.palette;
        let props = {
            type: 'Patient', click: this.doLaunch, personaList: this.props.personas, modal: true, theme: this.props.muiTheme.palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.search, loading: this.props.personaLoading, close: this.handleLaunch, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };
        let app = this.state.selectedApp ? this.props.apps.find(i => i.id === this.state.selectedApp.id) : undefined;
        let createAppClientJSON = this.state.createdApp && this.state.createdApp.clientJSON ? JSON.parse(this.state.createdApp.clientJSON) : {};

        return (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.clientId || 1} onSubmit={this.appSubmit} onDelete={this.toggleConfirmation} manifest={this.state.manifest}
                         muiTheme={this.props.muiTheme} app={app} open={(!!this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible}
                         onClose={this.closeAll} doLaunch={this.doLaunch} copyToClipboard={this.props.copyToClipboard}/>
            : this.state.appToLaunch || this.state.hookToLaunch
                ? <Dialog modal={false} open={!!this.state.appToLaunch || !!this.state.hookToLaunch} onRequestClose={this.handleLaunch} className='launch-app-dialog' autoScrollBodyContent>
                    {!this.state.hookToLaunch && this.props.defaultUser && <div className='no-patient-button'>
                        <RaisedButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} primary onClick={() => this.doLaunch()} label='Launch without a patient'/>
                    </div>}
                    {this.props.defaultUser && <PersonaList {...props} idRestrictions={!this.state.hookToLaunch ? this.state.appToLaunch.samplePatients : undefined} titleLeft/>}
                    {!this.props.defaultUser && <DohMessage message='Please create at least one user persona.'/>}
                </Dialog>
                : this.state.createdApp
                    ? <Dialog modal={false} open={!!this.state.createdApp} onRequestClose={this.closeAll} bodyClassName='created-app-dialog' autoScrollBodyContent>
                        <Paper className='paper-card'>
                            <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.closeAll}>
                                <i className="material-icons">close</i>
                            </IconButton>
                            <h3>Registered App Details</h3>
                            <div className="client-details">
                                <div className="label-value">
                                    <span>Client Id:</span> <span className='client-id'>{this.state.createdApp.clientId}</span>
                                    <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(this.state.createdApp.clientId)}/>
                                </div>
                                {createAppClientJSON.clientSecret && <div>
                                    <div className="label-value">
                                        <span>Client Secret:</span>
                                        <span className='client-id'>{createAppClientJSON.clientSecret}</span>
                                        <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(createAppClientJSON.clientSecret)}/>
                                    </div>
                                </div>}
                            </div>
                        </Paper>
                    </Dialog>
                    : this.state.loadDialogVisible
                        ? <Dialog modal={false} open={!!this.state.loadDialogVisible} onRequestClose={this.closeAll} bodyClassName='created-app-dialog' autoScrollBodyContent>
                            <Paper className='paper-card'>
                                <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.closeAll}>
                                    <i className="material-icons">close</i>
                                </IconButton>
                                <h3>{this.props.hooks ? 'Register through service' : 'Register with manifest'}</h3>
                                <div className={`manifest-load${this.props.hooks ? ' small' : ''}`}>
                                    {this.props.hooks && <TextField value={this.state.serviceName} onChange={(_, serviceName) => this.setState({ serviceName })} fullWidth floatingLabelText={'Service name'}/>}
                                    <div style={{ width: '100%', verticalAlign: 'middle' }}>
                                        <TextField disabled={this.state.loadingManifest} value={this.state.manifestURL} fullWidth onChange={(_, a) => this.setState({ manifestURL: a.trim() })}
                                                   floatingLabelText={this.props.hooks ? 'Service url' : 'Manifest URL'} className={!this.props.hooks ? 'manifest-url' : ''}/>
                                        <RaisedButton primary label='Load' onClick={this.loadFromUrl} disabled={!isUrlValid(this.state.manifestURL) || this.state.loadingManifest}/>
                                        {!this.props.hooks && <span className='sub'>Example: https://bilirubin-risk-chart.hspconsortium.org(/.well-known/smart/manifest.json)</span>}
                                        {this.props.hooks && <span className='sub'>Example: https://bilirubin-cdshooks.hspconsortium.org(/cds-services)</span>}
                                    </div>
                                    {!this.props.hooks && <Fragment>
                                        <div className='separator'>
                                            <span>or</span>
                                        </div>
                                        <div style={{ width: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
                                            <RaisedButton label='Load from file' onClick={() => this.refs.file.click()} disabled={this.state.loadingManifest}/>
                                            <input ref='file' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                                        </div>
                                    </Fragment>}
                                </div>
                            </Paper>
                        </Dialog>
                        : !!this.state.selectedHook
                            ? <HookDialog muiTheme={this.props.muiTheme} open={!!this.state.selectedHook} onClose={this.closeAll} hook={this.state.selectedHook} service={this.state.service}
                                          onSubmit={(hookId, file) => {
                                              this.props.updateHook(hookId, file);
                                              this.closeAll();
                                          }}/>
                            : this.state.selectCreationType
                                ? <Dialog modal={false} open={!!this.state.selectCreationType} onRequestClose={this.closeAll} bodyClassName='created-app-dialog' autoScrollBodyContent>
                                    <Paper className='paper-card'>
                                        <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.closeAll}>
                                            <i className="material-icons">close</i>
                                        </IconButton>
                                        <h3>App creation</h3>
                                        <div className='app-creation-type-selection-wrapper apps-screen-wrapper modal'>
                                            <div className='modal-screen-title' style={{ color: palette.primary3Color }}>How would you like to create the app</div>
                                            <Card title='App launch' className={`app-card small`} onClick={() => this.setState({ selectCreationType: false, registerDialogVisible: true })}>
                                                <CardMedia className='media-wrapper'>
                                                    <img style={{ height: '100%' }} src='https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png' alt='HSPC Logo'/>
                                                </CardMedia>
                                                <CardTitle className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                                                    <h3 className='app-name'>Manually</h3>
                                                </CardTitle>
                                            </Card>
                                            <Card title='Hook launch' className={`app-card small`} onClick={() => this.setState({ selectCreationType: false, loadDialogVisible: true })}>
                                                <CardMedia className='media-wrapper'>
                                                    <Publish className='default-hook-icon'/>
                                                </CardMedia>
                                                <CardTitle className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                                                    <h3 className='app-name'>Through a manifest</h3>
                                                </CardTitle>
                                            </Card>
                                        </div>
                                    </Paper>
                                </Dialog>
                                : null;
    };

    getApps = () => {
        let appsList = this.props.apps ? this.props.apps.slice() : [];
        appsList.sort((a, b) => a.clientName.localeCompare(b.clientName));

        return appsList.map((app, index) => {
            let titleStyle = { backgroundColor: 'rgba(0,87,120, 0.75)' };
            if (!this.props.modal && !app.briefDescription) {
                titleStyle.height = '39%';
                titleStyle.bottom = '-18%';
            }
            return <Card title={app.clientName} className={`app-card ${this.props.modal ? 'small' : ''} ${this.state.toggledApp === app.id ? 'active' : ''}`} key={index}
                         onTouchStart={() => this.appCardClick(app)} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                <CardMedia className='media-wrapper'>
                    <img style={{ height: '100%' }} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                </CardMedia>
                <CardTitle className='card-title' style={titleStyle}>
                    <h3 className='app-name'>{app.clientName}</h3>
                    <h3 className='app-name long'>{app.clientName.substring(0, 50)}</h3>
                    {this.props.modal && <RadioButton className='app-radio' value="selected" checked={this.props.selectedApp ? app.id === this.props.selectedApp.id : false}/>}
                    <div className='app-description'>{app.briefDescription}</div>
                </CardTitle>
                {!this.props.modal && <CardActions className='card-actions-wrapper'>
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleLaunch(e, app)}
                                icon={<LaunchIcon style={{ width: '24px', height: '24px' }}/>} label='Launch'/>
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleAppSelect(e, app)}
                                icon={<SettingsIcon style={{ width: '24px', height: '24px' }}/>} label='Settings'/>
                </CardActions>}
            </Card>
        });
    };

    loadFromUrl = () => {
        !this.props.hooks && this.loadManifest();
        this.props.hooks && this.createService();
    };

    createService = () => {
        this.props.createService(this.state.manifestURL, this.state.serviceName);
        this.closeAll();
    };

    loadManifest = () => {
        //Prepare the url
        let url = this.state.manifestURL;

        // remove trailing slash if present
        url[url.length - 1] === '/' && (url = url.substr(0, url.length - 1));

        // add the final part of the path if not there
        url.indexOf(POSTFIX) === -1 && (url += POSTFIX);

        this.setState({ loadingManifest: true });
        API.getNoAuth(url)
            .then(manifest => {
                let keys = Object.keys(manifest);
                if (NEEDED_PROPS.every(p => keys.indexOf(p) !== -1)) {
                    this.setState({ registerDialogVisible: true, loadDialogVisible: false, loadingManifest: false, manifest });
                } else {
                    this.setState({ loadingManifest: false });
                }
            })
            .catch(_ => {
                this.setState({ loadingManifest: false });
            });
    };

    onFileInput = () => {
        let input = this.refs.file;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let manifest = JSON.parse(atob(e.target.result.split(',')[1]));
                    this.setState({ registerDialogVisible: true, loadDialogVisible: false, loadingManifest: false, manifest });
                } catch (e) {
                    console.log(e);
                }
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    search = (type, crit) => {
        this.state.appToLaunch && this.state.appToLaunch.samplePatients
            ? this.props.fetchPersonas(type, this.state.appToLaunch.samplePatients.split('?')[1] + '&' + crit, 15)
            : this.props.fetchPersonas(type, crit, 15);
    };

    toggleConfirmation = () => {
        this.setState({ showConfirmModal: !this.state.showConfirmModal });
    };

    appCardClick = (app) => {
        let toggledApp = this.state.toggledApp && this.state.toggledApp === app.id ? undefined : app.id;
        this.setState({ toggledApp });
    };

    hookCardClick = (hook) => {
        let toggledHook = this.state.toggledHook && this.state.toggledHook === hook ? undefined : hook;
        this.setState({ toggledHook });
    };

    delete = () => {
        this.props.deleteApp(this.state.selectedApp);
        this.closeAll();
    };

    appSubmit = (app, changes, clone) => {
        (this.state.selectedApp && !clone) ? this.props.updateApp(app, this.state.selectedApp, changes) : this.props.createApp(app);
        this.closeAll();
    };

    register = () => {
        this.closeAll();
    };

    doLaunch = (persona = {}) => {
        this.state.appToLaunch && this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, persona.id);
        this.state.hookToLaunch && this.props.launchHook(this.state.hookToLaunch, { patientId: persona.id });
        this.closeAll();
    };

    closeAll = () => {
        !this.state.loadingManifest &&
        this.setState({
            selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false, showConfirmModal: false, createdApp: undefined, loadDialogVisible: false, loadingManifest: false,
            hookToLaunch: undefined, selectedHook: undefined, selectCreationType: false
        });
    };

    handleAppSelect = (event, app) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.loadApp(app);
        this.setState({ selectedApp: app, registerDialogVisible: false, appIsLoading: true });
    };

    handleLaunch = (event, app) => {
        event && event.preventDefault();
        event && event.stopPropagation();

        if (!this.props.hooks && !!app) {
            let clientJSON = JSON.parse(app.clientJSON);
            let isPatientScoped = clientJSON.scope.find(i => i.toLowerCase().indexOf('patient/') >= 0);
            if (isPatientScoped) {
                app && app.samplePatients && this.props.fetchPersonas(PersonaList.TYPES.patient, app.samplePatients.split('?')[1], 15);
                (!app || !app.samplePatients) && this.props.fetchPersonas(PersonaList.TYPES.patient, null, 15);
                this.setState({ appToLaunch: app, registerDialogVisible: false });
                this.props.resetPersonas();
            } else {
                this.setState({ appToLaunch: app, registerDialogVisible: false }, this.doLaunch);
            }
        } else if (this.props.hooks && !!app) {
            //TODO add patient restriction to the HOOKS
            this.props.fetchPersonas(PersonaList.TYPES.patient, null, 15);
            this.setState({ hookToLaunch: app, registerDialogVisible: false });
            this.props.resetPersonas();
        } else {
            this.setState({ appToLaunch: undefined, hookToLaunch: undefined, registerDialogVisible: false });
        }
    };
}

const mapStateToProps = state => {
    return {
        apps: state.apps.apps,
        createdApp: state.apps.createdApp,
        appLoading: state.apps.loading,
        selecting: state.sandbox.selecting,
        appCreating: state.apps.creating,
        appDeleting: state.apps.deleting,
        defaultUser: state.sandbox.defaultUser,
        personas: state.persona.patients,
        personaLoading: state.persona.loading,
        pagination: state.persona.patientsPagination,
        copying: state.sandbox.copying,
        hooksList: state.hooks.services,
        servicesLoading: state.hooks.servicesLoading
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchPersonas, doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, lookupPersonasStart, resetPersonas, copyToClipboard, launchHook,
        createService, loadServices, updateHook,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)));
