import React, { Component } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton, RaisedButton, IconButton, FloatingActionButton, RadioButton, Paper, Snackbar, TextField } from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Page from 'sandbox-manager-lib/components/Page';
import ConfirmModal from 'sandbox-manager-lib/components/ConfirmModal';
import API from '../../../lib/api';
import {
    lookupPersonasStart, app_setScreen, doLaunch, fetchPersonas, loadSandboxApps, createApp, updateApp, deleteApp, loadApp,
    getDefaultUserForSandbox, getPersonasPage, resetPersonas, copyToClipboard
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import PersonaList from "../Persona/List";
import DohMessage from "sandbox-manager-lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";
import { isUrlValid } from '../../../lib/misc';

const postfix = '/.well-known/smart/manifest.json';
const neededProps = ['software_id', 'client_name', 'client_uri', 'logo_uri', 'launch_url', 'redirect_uris', 'scope', 'token_endpoint_auth_method', 'grant_types', 'fhir_versions'];

class Apps extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            manifest: undefined,
            registerDialogVisible: false,
            loadingManifest: false,
            loadDialogVisible: false,
            showConfirmModal: false,
            createApp: undefined,
            appIsLoading: false,
            manifestURL: '',
            textSelected: undefined
        };
    }

    componentDidMount () {
        this.props.app_setScreen('apps');
        this.props.loadSandboxApps();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps (nextProps) {
        this.state.selectedApp && !nextProps.appLoading && !nextProps.appDeleting && this.setState({ appIsLoading: false });
        this.props.appCreating && !nextProps.appCreating && this.setState({ createdApp: nextProps.createdApp });
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let appsList = this.props.apps ? this.props.apps.slice() : [];
        appsList.sort((a, b) => a.clientName.localeCompare(b.clientName));

        let apps = appsList.map((app, index) => {
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
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleAppLaunch(e, app)}
                                icon={<LaunchIcon style={{ width: '24px', height: '24px' }}/>} label='Launch'/>
                    <FlatButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} style={{ color: 'whitesmoke' }} onClick={(e) => this.handleAppSelect(e, app)}
                                icon={<SettingsIcon style={{ width: '24px', height: '24px' }}/>} label='Settings'/>
                </CardActions>}
            </Card>
        });

        let props = {
            type: 'Patient', click: this.doLaunch, personaList: this.props.personas, modal: true, theme: this.props.muiTheme.palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.search, loading: this.props.personaLoading, close: this.handleAppLaunch, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };
        let app = this.state.selectedApp ? this.props.apps.find(i => i.id === this.state.selectedApp.id) : undefined;
        let createAppClientJSON = this.state.createdApp && this.state.createdApp.clientJSON ? JSON.parse(this.state.createdApp.clientJSON) : {};

        let dialog = (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.clientId || 1} onSubmit={this.appSubmit} onDelete={this.toggleConfirmation} manifest={this.state.manifest}
                         muiTheme={this.props.muiTheme} app={app} open={(!!this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible}
                         onClose={this.closeAll} doLaunch={this.doLaunch} copyToClipboard={this.props.copyToClipboard}/>
            : this.state.appToLaunch
                ? <Dialog modal={false} open={!!this.state.appToLaunch} onRequestClose={this.handleAppLaunch} className='launch-app-dialog' autoScrollBodyContent>
                    {this.props.defaultUser && <div className='no-patient-button'>
                        <RaisedButton labelStyle={{ fontSize: '14px', fontWeight: 700 }} primary onClick={() => this.doLaunch()} label='Launch without a patient'/>
                    </div>}
                    {this.props.defaultUser && <PersonaList {...props} idRestrictions={this.state.appToLaunch.samplePatients} titleLeft/>}
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
                                <h3>Register with manifest</h3>
                                <div className="manifest-load">
                                    <div style={{ width: '100%', verticalAlign: 'middle' }}>
                                        <TextField floatingLabelText='Manifest URL' value={this.state.manifestURL} fullWidth onChange={(_, a) => this.setState({ manifestURL: a.trim() })}
                                                   disabled={this.state.loadingManifest}/>
                                        <RaisedButton primary label='Load' onClick={this.loadManifest} disabled={!isUrlValid(this.state.manifestURL) || this.state.loadingManifest}/>
                                        <span className='sub'>Example: https://bilirubin-risk-chart.hspconsortium.org(/.well-known/smart/manifest.json)</span>
                                    </div>
                                    <div className='separator'>
                                        <span>or</span>
                                    </div>
                                    <div style={{ width: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
                                        <RaisedButton label='Load from file' onClick={() => this.refs.file.click()} disabled={this.state.loadingManifest}/>
                                        <input ref='file' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                                    </div>
                                </div>
                            </Paper>
                        </Dialog>
                        : null;

        return <Page noTitle={this.props.modal} title={this.props.title ? this.props.title : 'Registered Apps'}>
            <div className='apps-page-wrapper'>
                {!this.props.modal && <div className='filter-wrapper'>
                    <div className='actions'>
                        <span className='dummy-expander'/>
                        <FloatingActionButton onClick={() => this.setState({ registerDialogVisible: true })}>
                            <ContentAdd/>
                        </FloatingActionButton>
                        <FloatingActionButton onClick={() => this.setState({ loadDialogVisible: true })}>
                            <DownloadIcon/>
                        </FloatingActionButton>
                    </div>
                </div>}
                <div className={'apps-screen-wrapper' + (this.props.modal ? ' modal' : '')}>
                    {dialog}
                    <div className='screen-content'>
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps}
                        {!this.props.appDeleting && !this.props.appCreating && !this.props.appLoading && apps.length === 0 && this.props.apps &&
                        <DohMessage message='There are no apps in this sandbox platform yet.'/>}
                        {(this.props.appDeleting || this.props.appCreating || this.props.appLoading) && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
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

    loadManifest = () => {
        //Prepare the url
        let url = this.state.manifestURL;

        // remove trailing slash if present
        url[url.length - 1] === '/' && (url = url.substr(0, url.length - 1));

        // add the final part of the path if not there
        url.indexOf(postfix) === -1 && (url += postfix);

        this.setState({ loadingManifest: true });
        API.getNoAuth(url)
            .then(manifest => {
                let keys = Object.keys(manifest);
                if (neededProps.every(p => keys.indexOf(p) !== -1)) {
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
        this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, persona.id);
        this.closeAll();
    };

    closeAll = () => {
        !this.state.loadingManifest &&
        this.setState({
            selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false, showConfirmModal: false, createdApp: undefined, loadDialogVisible: false,
            loadingManifest: false
        });
    };

    handleAppSelect = (event, app) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.loadApp(app);
        this.setState({ selectedApp: app, registerDialogVisible: false, appIsLoading: true });
    };

    handleAppLaunch = (event, app) => {
        event && event.preventDefault();
        event && event.stopPropagation();

        if (!!app) {
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
        } else {
            this.setState({ appToLaunch: undefined, registerDialogVisible: false });
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
        copying: state.sandbox.copying
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchPersonas, doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, lookupPersonasStart, resetPersonas, copyToClipboard,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)))
