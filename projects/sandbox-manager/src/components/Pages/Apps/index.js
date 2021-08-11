import React, {Component, Fragment} from 'react';
import {CircularProgress, Card, CardMedia, Dialog, CardActions, Button, Fab, IconButton, Paper, Snackbar, TextField, Radio, withTheme, Tooltip, MenuItem, Menu} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ContentAdd from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import Publish from '@material-ui/icons/Publish';
import LaunchIcon from '@material-ui/icons/Launch';
import UpdateIcon from '@material-ui/icons/Update';
import ContentCopy from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import Assignment from '@material-ui/icons/Assignment';
import AlarmAdd from '@material-ui/icons/AlarmAdd';
import Alarm from '@material-ui/icons/Alarm';
import AlarmOn from '@material-ui/icons/AlarmOn';
import MoreVert from '@material-ui/icons/MoreVert';
import Page from '../../UI/Page';
import ConfirmModal from '../../UI/ConfirmModal';
import API from '../../../lib/api';
import {
    lookupPersonasStart, app_setScreen, doLaunch, fetchPersonas, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, getPersonasPage, resetPersonas, copyToClipboard, launchHook,
    createService, updateHook, updateService, deleteService
} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import HooksIcon from "svg-react-loader?name=Patient!../../../assets/icons/hooks-logo-mono.svg";
import PatientIcon from "svg-react-loader?name=Patient!../../../assets/icons/patient.svg";
import PillIcon from "svg-react-loader?name=Patient!../../../assets/icons/pill_icon_2.svg";

import AppDialog from './AppDialog';
import HookDialog from './HookDialog';
import PersonaList from "../Persona/List";
import DohMessage from "../../UI/DohMessage";

import './styles.less';
import {isUrlValid} from '../../../lib/misc';
import HelpButton from '../../UI/HelpButton';
import EditIcon from "@material-ui/core/SvgIcon/SvgIcon";

const POSTFIX = '/.well-known/smart/manifest.json';
const NEEDED_PROPS = ['software_id', 'client_name', 'client_uri', 'logo_uri', 'launch_url', 'redirect_uris', 'scope', 'token_endpoint_auth_method', 'grant_types', 'fhir_versions'];

class Apps extends Component {

    constructor(props) {
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

    componentDidMount() {
        if (!this.props.hooks) {
            this.props.app_setScreen('apps');
        } else {
            this.props.app_setScreen('hooks');
        }

        this.props.loadSandboxApps();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps(nextProps) {
        this.state.selectedApp && !nextProps.appLoading && !nextProps.appDeleting && this.setState({appIsLoading: false}) && (sessionStorage.loading = false);
        this.props.appCreating && !nextProps.appCreating && nextProps.location.pathname.indexOf('hook') === -1 && this.setState({createdApp: nextProps.createdApp});
        // this.props.appCreating && !nextProps.appCreating && console.log('Will set created App');
        // this.props.appCreating && !nextProps.appCreating && console.log(nextProps);
        ((this.props.hookCards.cards && this.props.hookCards.cards.length && (!nextProps.hookCards.cards || !nextProps.hookCards.cards.length))
            || (this.props.hookExecuting && !nextProps.hookExecuting && (!nextProps.hookCards.cards || !nextProps.hookCards.cards.length))
        ) && this.setState({toggledHook: undefined});
    }

    render() {
        let apps = !this.props.hooks && this.getApps();
        let hooks = this.props.hooks && this.getHooks();
        let dialog = this.getDialog();
        let actionClick = this.props.hooks
            ? () => this.setState({loadDialogVisible: true, serviceName: '', manifestURL: ''}, () => {
                setTimeout(() => {
                    let url = document.getElementById('serviceName');
                    url && url.focus();
                }, 200);
            })
            : () => this.setState({selectCreationType: true});
        let url = this.props.hooks
            ? 'https://cds-hooks.hl7.org/1.0/'
            : 'https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60915727/Sandbox+Registered+Apps';

        return <Page noTitle={this.props.modal} title={this.props.title ? this.props.title : 'Registered Apps'} //helpIcon={<HelpButton style={{marginLeft: '10px'}} url={url}/>}
        >
            <div className='apps-page-wrapper' data-qa='app-page-wrapper'>
                {!this.props.modal && <div className='filter-wrapper'>
                    <div className='actions'>
                        <span className='dummy-expander'/>
                        <Fab onClick={actionClick} color='primary'>
                            <ContentAdd/>
                        </Fab>
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
            {this.state.showConfirmModal &&
            <ConfirmModal red open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.delete} onCancel={this.toggleConfirmation} title='Confirm' theme={this.props.theme}>
                {this.state.serviceToDelete && <p>
                    Are you sure you want to delete this service? Deleting this service will result in the deletion of all the launch scenarios connected to it.
                </p>}
                {!this.state.serviceToDelete && <p>
                    Are you sure you want to delete app "{this.state.selectedApp ? this.state.selectedApp.clientName : ''}"? Deleting this app will result in the deletion of all the launch scenarios connected
                    to it.
                </p>}
            </ConfirmModal>}
            <Snackbar open={!!this.props.copying} message='Text Copied to Clipboard' autoHideDuration={30000}/>
        </Page>
    }

    getHooks = () => {
        let hooks = [];
        this.props.hooksList.map(service => {
            hooks.push(<div className='service-title-wrapper' key={`${service.url}_div_1`}>
                <h2>{service.title}</h2>
                <span>{service.url}</span>
                {!this.props.modal && this.props.changedServices.indexOf(service.id) >= 0 && <Fragment>
                    <Tooltip title="The service seems to have changed." aria-label="add" placement='top'>
                        <Button variant='contained' className='service-update-button' onClick={() => this.props.updateService(service)} color='secondary'>
                            Update
                        </Button>
                    </Tooltip>
                    <span className='service-last-updated'>Last updated: {moment(service.lastUpdated).format('YYYY-MM-DD')}</span>
                </Fragment>}
                {!this.props.modal &&
                <Fragment>
                    <Button ref={service.id} onClick={() => this.toggleMenuForItem(service.id)}>
                        <MoreVert/>
                    </Button>
                    <Menu width='100px' open={this.state[`service_${service.id}`] || false} anchorEl={this.refs[service.id]} onClose={() => this.toggleMenuForItem(service.id)}>
                        <MenuItem className='scenario-menu-item' onClick={() => this.toggleDeleteService(service)}>
                            <DeleteIcon/> Delete
                        </MenuItem>
                    </Menu>
                </Fragment>}
            </div>);
            let cards = [];
            service.cdsHooks.map((hook, index) => {
                hook.title = hook.title ? hook.title : '';
                hook.url = service.url;
                let titleStyle = {backgroundColor: 'rgba(71, 132, 84, 0.75)'};
                cards.push(<Card title={hook.title} className={`app-card${this.props.modal ? ' small' : ''}${this.state.toggledHook === hook.id ? ' active' : ''}`} key={service.url + index}
                                 onTouchStart={() => this.hookCardClick(index)} onClick={() => this.props.onCardClick && this.props.onCardClick(hook, service)}>
                    <div className={`hook-icon-wrapper ${hook.hook}`}>
                        {this.getHookIcon(hook.hook)}
                    </div>
                    <CardMedia className='media-wrapper'>
                        {hook.logoUri && <img style={this.props.modal ? {height: '156px', width: '235px'} : {height: '200px', width: '300px'}} src={hook.logoUri} alt='Logo'/>}
                        {!hook.logoUri && <HooksIcon className='default-hook-icon'/>}
                    </CardMedia>
                    <div className='card-title' style={titleStyle}>
                        <h3 className='app-name'>{hook.title}</h3>
                        <h3 className='app-name long'>{hook.title.substring(0, 52)}{hook.title.length > 52 && '...'}</h3>
                        {this.props.modal && <Radio className='app-radio' value="selected"
                                                    checked={this.props.selectedApp ? hook.hookUrl === this.props.selectedApp.hookUrl && hook.hookId === this.props.selectedApp.hookId : false}/>}
                        <div className='app-description'>{hook.description}</div>
                    </div>
                    {!this.props.modal && <CardActions className='card-actions-wrapper'>
                        <Button variant='outlined' style={{color: 'whitesmoke', background: 'transparent'}} onClick={(e) => this.handleLaunch(e, hook)}>
                            <LaunchIcon style={{width: '24px', height: '24px'}}/> Launch
                        </Button>
                        <Button variant='outlined' style={{color: 'whitesmoke', background: 'transparent'}} onClick={(e) => this.handleHookSelect(e, hook, service)}>
                            <InfoIcon style={{width: '24px', height: '24px'}}/> Info
                        </Button>
                    </CardActions>}
                </Card>);
            });
            hooks.push(<div key={`${service.url}_div_2`}>{cards}</div>);
        });
        return hooks;
    };

    toggleMenuForItem = id => {
        let state = {};
        state[`service_${id}`] = !this.state[`service_${id}`];
        this.setState(state);
    };

    toggleDeleteService = service => {
        this.setState({serviceToDelete: service});
        this.toggleConfirmation();
    };

    getHookIcon = (hookType) => {
        switch (hookType) {
            case 'patient-view':
                return <PatientIcon/>;
            case 'appointment-book':
                return <AlarmAdd/>;
            case 'encounter-start':
                return <Alarm/>;
            case 'encounter-discharge':
                return <AlarmOn/>;
            case 'order-review':
            case 'order-sign':
                return <Assignment/>;
            case 'medication-prescribe':
            case 'order-select':
                return <PillIcon className='additional-rotation'/>;
        }
        return null;
    };

    handleHookSelect = (e, hook, service) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({selectedHook: hook, toggledHook: hook.id, service, registerDialogVisible: false, appIsLoading: true});
    };

    getDialog = () => {
        let props = {
            type: 'Patient', click: this.doLaunch, personaList: this.props.patients, modal: true, theme: this.props.theme, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.search, loading: this.props.personaLoading, close: this.handleLaunch, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };
        let app = this.state.selectedApp ? this.props.apps.find(i => i.id === this.state.selectedApp.id) : undefined;
        let createAppClientJSON = this.state.createdApp && this.state.createdApp.clientJSON ? JSON.parse(this.state.createdApp.clientJSON) : {};

        return (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.clientId || 1} onSubmit={this.appSubmit} onDelete={this.toggleConfirmation} manifest={this.state.manifest}
                         app={app} open={(!!this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible}
                         onClose={() => this.closeAll()} doLaunch={this.doLaunch} copyToClipboard={this.props.copyToClipboard}/>
            : (this.state.appToLaunch || this.state.hookToLaunch) && !this.state.selectedPersonaForLaunch
                ? <Dialog open onClose={() => this.closeAll()} className='launch-app-dialog'>
                    {!this.state.hookToLaunch && this.props.defaultUser && <div className='no-patient-button'>
                        <Button variant='contained' color='primary' onClick={() => this.showSelectPersona()}>
                            Launch with default persona
                        </Button>
                    </div>}
                    {this.props.defaultUser &&
                    <PersonaList {...props} idRestrictions={!this.state.hookToLaunch ? this.state.appToLaunch.samplePatients : undefined} scrollContent type='Persona'
                                 click={this.showSelectPersona} personaList={this.props.personas}/>}
                    {!this.props.defaultUser && <DohMessage message='Please create at least one pratitioner persona.'/>}
                </Dialog>
                : this.state.appToLaunch || this.state.hookToLaunch
                    ? <Dialog open onClose={() => this.closeAll()} className='launch-app-dialog'>
                        {!this.state.hookToLaunch && this.props.defaultUser && <div className='no-patient-button'>
                            <Button variant='contained' color='primary' onClick={() => this.doLaunch()}>
                                Launch without a patient
                            </Button>
                        </div>}
                        {this.props.defaultUser && <PersonaList {...props} idRestrictions={!this.state.hookToLaunch ? this.state.appToLaunch.samplePatients : undefined} titleLeft scrollContent/>}
                        {!this.props.defaultUser && <DohMessage message='Please create at least one user persona.'/>}
                    </Dialog>
                    : this.state.createdApp
                        ? <Dialog open={!!this.state.createdApp} onClose={() => this.closeAll()} classes={{paper: 'created-app-dialog'}}>
                            <Paper className='paper-card' data-qa='created-app-modal'>
                                <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={() => this.closeAll()}>
                                    <i className="material-icons" data-qa="modal-close-button">close</i>
                                </IconButton>
                                <h3>Registered App Details</h3>
                                <div className="client-details">
                                    <div className="label-value">
                                        <span>Client Id:</span> <span className='client-id' data-qa='new-app-client-id'>{this.state.createdApp.clientId}</span>
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
                            ? <Dialog open={!!this.state.loadDialogVisible} onClose={() => this.closeAll()} classes={{paper: 'created-app-dialog'}}>
                                <Paper className='paper-card'>
                                    <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={() => this.closeAll()}>
                                        <i className="material-icons">close</i>
                                    </IconButton>
                                    <h3>{this.props.hooks ? 'Register through service' : 'Register with manifest'}</h3>
                                    <div className={`manifest-load${this.props.hooks ? ' small' : ''}`}>
                                        {this.props.hooks &&
                                        <TextField value={this.state.serviceName} onChange={e => this.setState({serviceName: e.target.value})} fullWidth label='Service name' id='serviceName'
                                                   onKeyPress={event => {
                                                       [10, 13].indexOf(event.charCode) >= 0 && isUrlValid(this.state.manifestURL) && this.loadFromUrl();
                                                   }}/>}
                                        <div style={{width: '100%', verticalAlign: 'middle', marginTop: '20px'}}>
                                            <TextField disabled={this.state.loadingManifest} value={this.state.manifestURL} fullWidth onChange={e => this.setState({manifestURL: e.target.value.trim()})}
                                                       label={this.props.hooks ? 'Service url' : 'Manifest URL'} className={!this.props.hooks ? 'manifest-url' : ''} id='url' style={{verticalAlign: 'bottom'}}
                                                       onKeyPress={event => {
                                                           [10, 13].indexOf(event.charCode) >= 0 && isUrlValid(this.state.manifestURL) && this.loadFromUrl();
                                                       }}/>
                                            <Button variant='contained' color='primary' onClick={this.loadFromUrl} disabled={!isUrlValid(this.state.manifestURL) || this.state.loadingManifest}>
                                                Load
                                            </Button>
                                            {/*{!this.props.hooks && <span className='sub'>Example: https://bilirubin-risk-chart.interop.community(/.well-known/smart/manifest.json)</span>}*/}
                                            {/*{this.props.hooks && <span className='sub'>Example: https://bilirubin-cdshooks.interop.community(/cds-services)</span>}*/}
                                        </div>
                                        {!this.props.hooks && <Fragment>
                                            <div className='separator'>
                                                <span>or</span>
                                            </div>
                                            <div style={{width: '100%', verticalAlign: 'middle', textAlign: 'center'}}>
                                                <Button variant='contained' color='primary' onClick={() => this.refs.file.click()} disabled={this.state.loadingManifest}>
                                                    Load from file
                                                </Button>
                                                <input ref='file' type='file' style={{'display': 'none'}} onChange={this.onFileInput}/>
                                            </div>
                                        </Fragment>}
                                    </div>
                                </Paper>
                            </Dialog>
                            : !!this.state.selectedHook
                                ? <HookDialog theme={this.props.theme} open={!!this.state.selectedHook} onClose={() => this.closeAll()} hook={this.state.selectedHook} service={this.state.service}
                                              onSubmit={(hookId, file) => {
                                                  this.props.updateHook(hookId, file);
                                                  this.closeAll();
                                              }}/>
                                : this.state.selectCreationType
                                    ? <Dialog open={!!this.state.selectCreationType} onClose={() => this.closeAll()} classes={{paper: 'created-app-dialog'}}>
                                        <Paper className='paper-card'>
                                            <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={() => this.closeAll()}>
                                                <i className="material-icons">close</i>
                                            </IconButton>
                                            <h3>App creation</h3>
                                            <div className='app-creation-type-selection-wrapper apps-screen-wrapper modal'>
                                                <div className='modal-screen-title' style={{color: this.props.theme.p3}}>How would you like to create the app</div>
                                                <Card title='App launch' className={`app-card small`} onClick={() => this.setState({selectCreationType: false, registerDialogVisible: true})}>
                                                    <CardMedia className='media-wrapper'>
                                                        <img style={{height: '156px', width: '235px'}} src='/img/HSPCSandboxNoIconApp.png' alt='Logo'/>
                                                    </CardMedia>
                                                    <div className='card-title' style={{backgroundColor: 'rgba(71, 132, 84, 0.75)'}}>
                                                        <h3 className='app-name'>Manually</h3>
                                                    </div>
                                                </Card>
                                                <Card title='Hook launch' className={`app-card small`} onClick={() => this.setState({selectCreationType: false, loadDialogVisible: true}, () => {
                                                    setTimeout(() => {
                                                        let url = document.getElementById('url');
                                                        url && url.focus();
                                                    }, 200);
                                                })}>
                                                    <CardMedia className='media-wrapper'>
                                                        <Publish className='default-hook-icon'/>
                                                    </CardMedia>
                                                    <div className='card-title' style={{backgroundColor: 'rgba(71, 132, 84, 0.75)'}}>
                                                        <h3 className='app-name'>Through a manifest</h3>
                                                    </div>
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
            let titleStyle = {backgroundColor: 'rgba(71, 132, 84, 0.75)'};
            return <Card title={app.clientName} className={`app-card${this.props.modal ? ' small' : ''}${this.state.toggledApp === app.id ? ' active' : ''}`} key={app.id} id={app.id}
                         onTouchStart={() => this.appCardClick(app)} onClick={() => this.props.onCardClick && this.props.onCardClick(app)} data-qa={`app-${app.clientId}`}>
                <CardMedia className='media-wrapper'>
                    <img style={this.props.modal ? {height: '156px', width: '235px'} : {height: '200px', width: '300px'}} src={app.logoUri || '/img/HSPCSandboxNoIconApp.png'} alt='Logo'/>
                </CardMedia>
                <div className='card-title' style={titleStyle}>
                    <h3 className='app-name'>{app.clientName}</h3>
                    <h3 className='app-name long'>{app.clientName.substring(0, 52)}{app.clientName.length > 52 && '...'}</h3>
                    {this.props.modal && <Radio className='app-radio' value="selected" checked={this.props.selectedApp ? app.id === this.props.selectedApp.id : false}/>}
                    <div className='app-description'>{app.briefDescription}</div>
                </div>
                {!this.props.modal && <CardActions className='card-actions-wrapper'>
                    <Button variant='contained' style={{color: 'whitesmoke', background: 'transparent'}} onClick={(e) => this.handleLaunch(e, app)}>
                        <LaunchIcon style={{width: '24px', height: '24px'}}/> Launch
                    </Button>
                    <Button variant='contained' style={{color: 'whitesmoke', background: 'transparent'}} onClick={(e) => this.handleAppSelect(e, app)}>
                        <SettingsIcon style={{width: '24px', height: '24px'}}/> Settings
                    </Button>
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

        this.setState({loadingManifest: true});
        API.getNoAuth(url)
            .then(manifest => {
                let keys = Object.keys(manifest);
                if (NEEDED_PROPS.every(p => keys.indexOf(p) !== -1)) {
                    this.setState({registerDialogVisible: true, loadDialogVisible: false, loadingManifest: false, manifest});
                } else {
                    this.setState({loadingManifest: false});
                }
            })
            .catch(_ => {
                this.setState({loadingManifest: false});
            });
    };

    onFileInput = () => {
        let input = this.refs.file;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let manifest = JSON.parse(atob(e.target.result.split(',')[1]));
                    this.setState({registerDialogVisible: true, loadDialogVisible: false, loadingManifest: false, manifest});
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
        this.setState({showConfirmModal: !this.state.showConfirmModal});
    };

    appCardClick = (app) => {
        let toggledApp = this.state.toggledApp && this.state.toggledApp === app.id ? undefined : app.id;
        this.setState({toggledApp});
    };

    hookCardClick = (hook) => {
        let toggledHook = this.state.toggledHook && this.state.toggledHook === hook ? undefined : hook;
        this.setState({toggledHook});
    };

    delete = () => {
        this.state.selectedApp && this.props.deleteApp(this.state.selectedApp);
        this.state.serviceToDelete && this.props.deleteService(this.state.serviceToDelete);
        this.closeAll();
    };

    appSubmit = (app, changes, clone) => {
        (this.state.selectedApp && !clone) ? this.props.updateApp(app, this.state.selectedApp, changes) : this.props.createApp(app);
        this.closeAll();
    };

    register = () => {
        this.closeAll();
    };

    showSelectPersona = (selectedPersonaForLaunch = {}) => {
        this.setState({selectedPersonaForLaunch});
    };

    doLaunch = (patient = {}) => {
        this.state.appToLaunch && this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, patient.id, this.state.selectedPersonaForLaunch);
        this.state.hookToLaunch && this.props.launchHook(this.state.hookToLaunch, {patientId: patient.id}, this.state.selectedPersonaForLaunch);
        this.closeAll(true);
    };

    closeAll = (doNotRemoveHook = false) => {
        let state = {
            selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false, showConfirmModal: false, createdApp: undefined, loadDialogVisible: false, loadingManifest: false,
            hookToLaunch: undefined, selectedHook: undefined, selectCreationType: false, manifestURL: '', toggledApp: undefined, toggledHook: undefined, selectedPersonaForLaunch: undefined
        };
        !!doNotRemoveHook && (delete state.toggledHook);
        !this.state.loadingManifest && this.setState(state);
    };

    handleAppSelect = (event, app) => {
        this.props.loadApp(app);
        this.setState({selectedApp: app, toggledApp: app.id, registerDialogVisible: false, appIsLoading: true});
    };

    handleLaunch = (event, app) => {
        if (!this.props.hooks && !!app) {
            let clientJSON = JSON.parse(app.clientJSON);
            let isPatientScoped = clientJSON.scope.find(i => i.toLowerCase().indexOf('patient/') >= 0);
            if (isPatientScoped) {
                app && app.samplePatients && this.props.fetchPersonas(PersonaList.TYPES.persona, app.samplePatients.split('?')[1], 15, PersonaList.TYPES.patient);
                (!app || !app.samplePatients) && this.props.fetchPersonas(PersonaList.TYPES.persona, null, 15, PersonaList.TYPES.patient);
                // app && app.samplePatients && this.props.fetchPersonas(PersonaList.TYPES.patient, app.samplePatients.split('?')[1], 15);
                // (!app || !app.samplePatients) && this.props.fetchPersonas(PersonaList.TYPES.patient, null, 15);
                this.setState({appToLaunch: app, toggledApp: app.id, toggledHook: app.id, registerDialogVisible: false});
                this.props.resetPersonas();
            } else {
                this.setState({appToLaunch: app, toggledApp: app.id, toggledHook: app.id, registerDialogVisible: false}, this.doLaunch);
            }
        } else if (this.props.hooks && !!app) {
            //TODO add patient restriction to the HOOKS
            this.props.fetchPersonas(PersonaList.TYPES.persona, null, 15, PersonaList.TYPES.patient);
            // this.props.fetchPersonas(PersonaList.TYPES.patient, null, 15);
            this.setState({hookToLaunch: app, toggledApp: app.id, toggledHook: app.id, registerDialogVisible: false});
            this.props.resetPersonas();
        } else {
            this.setState({appToLaunch: undefined, hookToLaunch: undefined, registerDialogVisible: false, toggledApp: undefined, toggledHook: undefined});
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
        patients: state.persona.patients,
        personas: state.persona.personas,
        personaLoading: state.persona.loading,
        pagination: state.persona.patientsPagination,
        copying: state.sandbox.copying,
        hooksList: state.hooks.services,
        servicesLoading: state.hooks.servicesLoading,
        hookCards: state.hooks.cards || {cards: []},
        hookExecuting: state.hooks.executing,
        errorToShow: state.app.errorToShow,
        changedServices: state.hooks.changed || []
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchPersonas, doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, lookupPersonasStart, resetPersonas, copyToClipboard, launchHook,
        createService, updateHook, updateService, deleteService,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Apps)));
