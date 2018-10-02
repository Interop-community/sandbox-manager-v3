import React, { Component } from 'react';
import { CircularProgress, Card, CardMedia, CardTitle, Dialog, CardActions, FlatButton, IconButton, FloatingActionButton, RadioButton, Paper } from 'material-ui';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import Page from 'sandbox-manager-lib/components/Page';
import ConfirmModal from 'sandbox-manager-lib/components/ConfirmModal';
import {
    lookupPersonasStart, app_setScreen, doLaunch, fetchPersonas, loadSandboxApps, createApp, updateApp, deleteApp, loadApp,
    getDefaultUserForSandbox, getPersonasPage, resetPersonas
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';

import AppDialog from './AppDialog';
import PersonaList from "../Persona/List";
import DohMessage from "sandbox-manager-lib/components/DohMessage";

import './styles.less';
import muiThemeable from "material-ui/styles/muiThemeable";

class Apps extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedApp: undefined,
            appToLaunch: undefined,
            registerDialogVisible: false,
            showConfirmModal: false,
            createApp: undefined,
            appIsLoading: false
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
        let appsList = this.props.apps ? this.props.apps.slice() : [];
        appsList.sort((a, b) => a.clientName.localeCompare(b.clientName));

        let apps = appsList.map((app, index) => (
            <Card className={`app-card ${this.props.modal ? 'small' : ''} ${this.state.toggledApp === app.id ? 'active' : ''}`} key={index}
                  onTouchStart={() => this.appCardClick(app)} onClick={() => this.props.onCardClick && this.props.onCardClick(app)}>
                <CardMedia className='media-wrapper'>
                    <img style={{ height: '100%' }} src={app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                </CardMedia>
                <CardTitle className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                    <h3 className='app-name'>{app.clientName}</h3>
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
        ));

        let props = {
            type: 'Patient', click: this.doLaunch, personaList: this.props.personas, modal: true, theme: this.props.muiTheme.palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.search, loading: this.props.personaLoading, close: this.handleAppLaunch, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };
        let app = this.state.selectedApp ? this.props.apps.find(i => i.id === this.state.selectedApp.id) : undefined;

        let dialog = (this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible
            ? <AppDialog key={this.state.selectedApp && this.state.selectedApp.clientId || 1} onSubmit={this.appSubmit} onDelete={this.toggleConfirmation}
                         muiTheme={this.props.muiTheme} app={app} open={(!!this.state.selectedApp && !this.state.appIsLoading) || this.state.registerDialogVisible}
                         onClose={this.closeAll} doLaunch={this.doLaunch}/>
            : this.state.appToLaunch
                ? <Dialog modal={false} open={!!this.state.appToLaunch} onRequestClose={this.handleAppLaunch} className='launch-app-dialog' autoScrollBodyContent>
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
                            <div className='paper-body'>
                                App Client Id <br/>
                                ID: <span className='client-id'>{this.state.createdApp.clientId}</span>
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
        </Page>
    }

    search = (type, crit) => {
        console.log('search');
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

    appSubmit = (app, changes) => {
        this.state.selectedApp ? this.props.updateApp(app, this.state.selectedApp, changes) : this.props.createApp(app);
        this.closeAll();
    };

    register = () => {
        this.closeAll();
    };

    doLaunch = (persona) => {
        this.props.doLaunch(this.state.appToLaunch || this.state.selectedApp, persona.id);
        this.closeAll();
    };

    closeAll = () => {
        this.setState({ selectedApp: undefined, appToLaunch: undefined, registerDialogVisible: false, showConfirmModal: false, createdApp: undefined });
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
        app && app.samplePatients && this.props.fetchPersonas(PersonaList.TYPES.patient, app.samplePatients.split('?')[1], 15);
        (!app || !app.samplePatients) && this.props.fetchPersonas(PersonaList.TYPES.patient, null, 15);
        this.setState({ appToLaunch: app, registerDialogVisible: false });
        this.props.resetPersonas();
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
        pagination: state.persona.patientsPagination
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchPersonas, doLaunch, app_setScreen, loadSandboxApps, createApp, updateApp, deleteApp, loadApp, getDefaultUserForSandbox, lookupPersonasStart, resetPersonas,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Apps)))
