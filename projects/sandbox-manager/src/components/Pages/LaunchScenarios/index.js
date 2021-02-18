import React, {Component, Fragment} from 'react';
import {
    app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, updateNeedPatientBanner, lookupPersonasStart, addCustomContext,
    fetchLocation, fetchPatient, setFetchingSinglePatientFailed, setSinglePatientFetched, setFetchSingleEncounter, setSingleEncounter, setFetchingSingleEncounterError, fetchEncounter, deleteCustomContext,
    setSingleLocation, setFetchingSingleLocationError, setSingleIntent, setFetchingSingleIntentError, setSingleResource, setFetchingSingleResourceError, fetchResource, fetchIntent, getDefaultUserForSandbox,
    customSearch, fetchAnyResource, clearResourceFetch, launchHook, loadServices, searchAnyResource
} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {
    CircularProgress, Card, IconButton, Fab, CardMedia, Popover, Menu, MenuItem, Table, TableHead, TableRow, TableBody, TableCell,
    TextField, Select, Switch, withTheme, Tooltip
} from '@material-ui/core';
import PersonaList from '../Persona/List';
import ContentSort from '@material-ui/icons/Sort';
import ContentAdd from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/PlayCircleOutline';
import WebIcon from '@material-ui/icons/Web';
import AccountIcon from '@material-ui/icons/AccountBox';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreIcon from '@material-ui/icons/MoreVert';
import EventIcon from '@material-ui/icons/Event';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import FilterList from '@material-ui/icons/FilterList';
import HospitalIcon from 'svg-react-loader?name=Patient!../../../assets/icons/round-location_city.svg';
import DescriptionIcon from 'svg-react-loader?name=Patient!../../../assets/icons/round-description.svg';
import LinkIcon from 'svg-react-loader?name=Patient!../../../assets/icons/round-link.svg';
import FullScreenIcon from 'svg-react-loader?name=Patient!../../../assets/icons/baseline-fullscreen.svg';
import HooksIcon from 'svg-react-loader?name=Patient!../../../assets/icons/hooks-logo-mono.svg';
import BulbIcon from 'svg-react-loader?name=Patient!../../../assets/icons/lightbulb.svg';
import Patient from 'svg-react-loader?name=Patient!../../../assets/icons/patient.svg';
import ContextIcon from 'svg-react-loader?name=Patient!../../../assets/icons/context-icon.svg';
import Page from '../../UI/Page';
import DohMessage from '../../UI/DohMessage';
import ConfirmModal from '../../UI/ConfirmModal';
import Filters from './Filters';
import Create from './Create';

import './styles.less';
import HelpButton from '../../UI/HelpButton';

const SORT_VALUES = [
    {val: 'last_used', label: 'Last Used'},
    {val: 'alphabetical', label: 'Alphabetical'}
];

class LaunchScenarios extends Component {

    createKey = 0;
    buttonClick = false;

    constructor(props) {
        super(props);

        this.state = {
            desc: true,
            showModal: false,
            addContext: false,
            showMenuForItem: false,
            showConfirmModal: false,
            descriptionEditing: false,
            selectedCustomContent: undefined,
            selectedScenario: undefined,
            scenarioToEdit: undefined,
            scenarioToDelete: undefined,
            description: '',
            key: '',
            val: '',
            sort: SORT_VALUES[0].val,
            lastLaunch: undefined
        }
    }

    componentDidMount() {
        this.setState({lastLaunch: undefined});
        this.props.app_setScreen('launch');
        this.props.loadLaunchScenarios();
        this.props.loadServices();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps(nextProps) {
        this.props.deleting && !nextProps.deleting && this.props.loadLaunchScenarios();
    }

    render() {
        let theme = this.props.theme;

        return <Page title='Launch Scenarios' helpIcon={<HelpButton style={{marginLeft: '10px'}} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/65011892/Sandbox+Launch+Scenarios'/>}>
            {this.state.scenarioToEdit && <Create key={this.createKey} open={!!this.state.scenarioToEdit} close={() => this.selectScenarioForEditing()} create={this.createScenario} {...this.props}
                                                  {...this.state.scenarioToEdit}/>}
            <ConfirmModal open={this.state.showConfirmModal} red confirmLabel='Delete' onConfirm={() => {
                this.props.deleteScenario(this.state.scenarioToDelete);
                this.setState({showConfirmModal: false})
            }} onCancel={() => this.setState({showConfirmModal: false, scenarioToDelete: undefined})} title='Confirm'>
                <p>
                    Are you sure you want to delete {this.state.scenarioToDelete && this.state.scenarioToDelete.title ? '' + this.state.scenarioToDelete.title + '' : 'this launch scenario'}?
                </p>
            </ConfirmModal>
            <div className='launch-scenarios-wrapper'>
                <a ref='openLink' target='_blank'/>
                <div className='filter-wrapper'>
                    <IconButton onClick={() => this.setState({desc: !this.state.desc})} className='sort-button'>
                        <ContentSort className={!this.state.desc ? 'rev' : ''} style={{fill: theme.p3}}/>
                    </IconButton>
                    <Select style={{width: '140px', marginLeft: '16px'}} value={this.state.sort}
                            className='sort-select' onChange={e => this.setState({sort: e.target.value})}>
                        <MenuItem value={SORT_VALUES[0].val}>
                            {SORT_VALUES[0].label}
                        </MenuItem>
                        <MenuItem value={SORT_VALUES[1].val}>
                            {SORT_VALUES[1].label}
                        </MenuItem>
                    </Select>
                    <FilterList style={{fill: theme.p3}}/>
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 &&
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter} appliedIdFilter={this.state.appIdFilter}/>}
                    <div className='actions'>
                        <Fab onClick={this.toggleCreateModal} color='primary'>
                            <ContentAdd/>
                        </Fab>
                    </div>
                </div>
                <div>
                    {(this.props.scenariosLoading || this.props.creating || this.props.deleting) && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                    {!this.props.scenariosLoading && !this.props.deleting && !this.props.creating && this.props.scenarios && this.props.scenarios.length > 0 && this.getScenarios()}
                    {!this.props.scenariosLoading && !this.props.deleting && !this.props.creating && this.props.scenarios && this.props.scenarios.length === 0 &&
                    <DohMessage message='No launch scenarios in sandbox.' topMargin/>}
                </div>
                <Create key={this.createKey} open={this.state.showModal} close={this.toggleCreateModal} create={this.createScenario} {...this.props}/>
            </div>
        </Page>
    }

    selectScenarioForEditing = (scenarioToEdit) => {
        this.toggleMenuForItem();
        this.setState({scenarioToEdit, showModal: false});
    };

    onFilter = (type, appId) => {
        let state = {};
        state[type] = appId;
        this.setState(state);
    };

    launchScenario = (e, sc) => {
        this.preventDefault(e);
        (sc.app || sc.cdsHook) && this.props.updateLaunchScenario(sc);
        if (!!sc.app) {
            sc.needPatientBanner === 'T'
                ? this.props.doLaunch(sc.app, sc.patient, sc.userPersona, undefined, sc)
                : this.openEHRSimulator(sc);
        } else {
            !sc.cdsHook && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
            sc.cdsHook && this.props.launchHook(sc.cdsHook, sc.contextParams);
        }
        this.setState({lastLaunch: sc});
    };

    openEHRSimulator = (sc) => {
        const cookieUrl = window.location.host.split(':')[0].split('.').slice(-2).join('.');
        const date = new Date();
        const token = {
            sandboxId: this.props.sandbox.sandboxId, sandboxApiUrl: this.props.sandboxApiUrl, appId: sc.app.id, personaId: sc.userPersona.id, patientId: sc.patient,
            refApi: window.fhirClient.server.serviceUrl.split('/')[2], token: window.fhirClient.server.auth.token
        };
        sc.encounter && (token.encounter = sc.encounter);
        sc.location && (token.location = sc.location);
        sc.resource && (token.resource = sc.resource);
        sc.smartStyleUrl && (token.smartStyleUrl = sc.smartStyleUrl);
        sc.intent && (token.intent = sc.intent);
        sc.contextParams && (token.contextParams = sc.contextParams);

        date.setTime(date.getTime() + (3 * 60 * 1000));
        let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        if (isIE11) {
            document.cookie = `hspc-launch-token=${JSON.stringify(token)}; expires=${date.toUTCString()}; domain=${cookieUrl}; path=/`;
        } else {
            document.cookie = `hspc-launch-token=${JSON.stringify(token)}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
        }

        let openLink = this.refs.openLink;
        openLink.href = `${this.props.ehrUrl}/launch`;
        openLink.click();
    };

    handleRowSelect = (row) => {
        let selection = this.state.selectedScenario !== row ? row : undefined;
        this.setState({selectedScenario: selection, addContext: false, key: '', val: '', selectedCustomContent: undefined});
    };

    createScenario = (data) => {
        this.props.createScenario(data);
        this.toggleCreateModal();
    };

    showDeleteScenario = (sc) => {
        this.toggleMenuForItem();
        this.setState({showConfirmModal: true, scenarioToDelete: sc});
    };

    toggleCreateModal = () => {
        let showModal = !this.state.showModal;
        let selectedScenario = showModal ? this.state.selectedScenario : undefined;
        showModal && !selectedScenario && !this.props.personas && this.props.fetchPersonas(PersonaList.TYPES.persona);
        showModal && !selectedScenario && !this.props.patients.length && this.props.fetchPersonas(PersonaList.TYPES.patient);
        showModal && !selectedScenario && this.state.selectedPersona && this.props.fetchPersonas(PersonaList.TYPES.patient);
        this.setState({showModal, selectedScenario, selectedPatient: undefined, selectedPersona: undefined, selectedApp: undefined, description: ''});
        this.createKey++;
    };

    getScenarios = () => {
        let theme = this.props.theme;
        let sorted = this.sortScenarios();
        return <div className='scenarios-list'>
            {sorted.map((sc, index) => {
                    let isSelected = this.state.selectedScenario === index;
                    let isLast = this.state.lastLaunch && this.state.lastLaunch.id === sc.id;
                    let itemStyles = {backgroundColor: theme.p5};
                    let contentStyles = isSelected ? {borderTop: '1px solid ' + theme.p7} : {};
                    let isPatient = sc.userPersona.resource !== 'Practitioner';
                    let iconStyle = {
                        backgroundColor: theme.p5,
                        color: theme.a1
                    };

                    let details = <div key={1} className='expanded-content'>
                        {isSelected && this.getDetailsContent(sc)}
                    </div>;
                    let filter = (!this.state.appIdFilter || (sc.app && this.state.appIdFilter === sc.app.clientId)) &&
                        (!this.state.typeFilter || (this.state.typeFilter === sc.userPersona.resource || (this.state.typeFilter === 'CDS Service' && !!sc.cdsHook)));
                    let showMenuForItem = this.state.showMenuForItem === index;
                    if (filter) {
                        return <div key={index} style={itemStyles} onClick={() => this.handleRowSelect(index)} className={'scenarios-list-row' + (isSelected ? ' active' : '') + (isLast ? ' last' : '')}>
                            <div className='left-icon-wrapper' style={iconStyle}>
                                <span className='left-icon'>
                                    {!sc.app
                                        ? <i><HooksIcon/></i>
                                        : isPatient
                                            ? <i><Patient/></i>
                                            : <i className='fa fa-user-md fa-lg'/>}
                                </span>
                            </div>
                            <div className='title-wrapper'>
                                <span className='launch-scenario-title'>{sc.title || sc.description}</span>
                                <span className='launch-scenario-app-name'>{sc.app && sc.app.clientName}{'\u00A0'}</span>
                            </div>
                            <div className='actions-wrapper'>
                                <IconButton onClick={e => this.launchScenario(e, sc)} tooltip='Launch'>
                                    <LaunchIcon style={{width: '24px', height: '24px', fill: theme.p3}}/>
                                </IconButton>
                                <IconButton onClick={e => this.toggleMenuForItem(e, index)}>
                                    <span className='anchor' ref={'anchor' + index.toString()}/>
                                    <MoreIcon style={{width: '24px', height: '24px', fill: theme.p3}}/>
                                </IconButton>
                                {showMenuForItem &&
                                <Menu width='100px' open={showMenuForItem} anchorEl={this.refs['anchor' + index]} onClose={this.toggleMenuForItem}>
                                    <MenuItem className='scenario-menu-item' onClick={() => this.selectScenarioForEditing(sc)}>
                                        <EditIcon/> Edit
                                    </MenuItem>
                                    <MenuItem className='scenario-menu-item' onClick={() => this.showDeleteScenario(sc)}>
                                        <DeleteIcon/> Delete
                                    </MenuItem>
                                </Menu>}
                                <IconButton className='expanded-toggle'>
                                    <DownIcon style={{width: '24px', height: '24px', fill: theme.p3}}/>
                                </IconButton>
                            </div>
                            <div className='content' style={contentStyles} onClick={e => e.stopPropagation()}>
                                {details}
                            </div>
                        </div>
                    }
                }
            )}
        </div>
    };

    sortScenarios = () => {
        if (this.state.sort === SORT_VALUES[1].val) {
            return this.props.scenarios.sort((a, b) => {
                let nameA = (a.title || a.description).toLowerCase();
                let nameB = (b.title || b.description).toLowerCase();
                let val = 0;
                if (nameA > nameB) {
                    val = 1;
                } else if (nameA < nameB) {
                    val = -1;
                }
                if (!this.state.desc) {
                    val *= -1;
                }
                return val;
            });
        } else {
            return this.props.scenarios.sort((a, b) => {
                let timeA = a.lastLaunchSeconds || a.createdTimestamp;
                let timeB = b.lastLaunchSeconds || b.createdTimestamp;
                let val = timeA >= timeB ? 1 : -1;
                if (this.state.desc) {
                    val *= -1;
                }
                return val;
            });
        }
    };

    preventDefault = (e) => {
        e && e.preventDefault && e.preventDefault();
        e && e.stopPropagation && e.stopPropagation();
    };

    toggleMenuForItem = (e, itemIndex) => {
        this.preventDefault(e);
        this.setState({showMenuForItem: itemIndex});
    };

    getDetailsContent = (selectedScenario) => {
        let theme = this.props.theme;
        let lightColor = {color: theme.p3, alpha: '.7'};
        let normalColor = {color: theme.p3};
        let darkColor = {color: theme.p6};
        let iconStyle = {color: theme.p6, fill: theme.p6, width: '24px', height: '24px'};
        let iconStyleLight = {color: theme.p3, fill: theme.p3, width: '24px', height: '24px'};
        let disabled = this.props.modifyingCustomContext || (this.state.addContext && (!this.state.key.length || !this.state.val.length));
        let deleteEnabled = this.state.selectedCustomContent !== undefined;
        let onClick = this.state.addContext ? this.addContext : deleteEnabled ? this.deleteCustomContext : this.toggleAddContext;

        return <div className='launch-scenario-wrapper'>
            <div className='persona-wrapper'>
                <span className='section-title' style={darkColor}><AccountIcon style={iconStyle}/>Persona</span>
                <span className='persona-name' style={normalColor}>{selectedScenario.userPersona.fhirName || '-'}</span>
                <span className='persona-id' style={lightColor}>{selectedScenario.userPersona.personaUserId || '-'}</span>
                <div className='app-wrapper'>
                    <span className='section-title' style={darkColor}><WebIcon style={iconStyle}/>{selectedScenario.app ? 'App' : 'CDS Service'}</span>
                    <Card className='app-card small'>
                        <CardMedia className='media-wrapper'>
                            {selectedScenario.app && <img style={{height: '100%', width: '100%'}} src={selectedScenario.app.logoUri || 'https://content.logicahealth.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'}
                                                          alt='Logica Logo'/>}
                            {selectedScenario.cdsHook && selectedScenario.cdsHook.logoUri && <img style={{height: '100%', width: '100%'}} src={selectedScenario.cdsHook.logoUri} alt='Logica Logo'/>}
                            {selectedScenario.cdsHook && !selectedScenario.cdsHook.logoUri && <HooksIcon className='default-hook-icon'/>}
                        </CardMedia>
                        <div className='card-title' style={{backgroundColor: 'rgba(0,87,120, 0.75)'}}>
                            <span className='app-name'>{selectedScenario.app && selectedScenario.app.clientName}</span>
                            <span className='app-name'>{selectedScenario.cdsHook && selectedScenario.cdsHook.title}</span>
                        </div>
                    </Card>
                </div>
            </div>
            <div className='right-side-wrapper'>
                <div className='context-wrapper'>
                    <span className='section-title' style={darkColor}><ContextIcon style={iconStyle}/>Context</span>
                    {selectedScenario.app && <div>
                        <span className='section-value' style={lightColor}>
                            <Patient style={iconStyleLight}/>
                            {selectedScenario.patientName && <span style={{cursor: 'pointer', color: theme.p2, textDecoration: 'underline'}}
                                                                   onClick={e => this.openInDM(e, selectedScenario.patient)}>{selectedScenario.patientName ? selectedScenario.patientName : '-'}</span>}
                            {!selectedScenario.patientName && <span>-</span>}
                        </span>
                        <span className='section-value' style={lightColor}>
                            <EventIcon style={iconStyleLight}/>
                            {selectedScenario.encounter ? selectedScenario.encounter : '-'}
                        </span>
                        <span className='section-value' style={lightColor}>
                            <HospitalIcon style={iconStyleLight}/>
                            {selectedScenario.location ? selectedScenario.location : '-'}
                        </span>
                        <span className='section-value' style={lightColor}>
                            <DescriptionIcon style={iconStyleLight}/>
                            {selectedScenario.resource ? selectedScenario.resource : '-'}
                        </span>
                        <span className='section-value' style={lightColor}>
                            <BulbIcon style={iconStyleLight}/>
                            {selectedScenario.intent ? selectedScenario.intent : '-'}
                        </span>
                        <span className='section-value' style={lightColor}>
                            <LinkIcon style={iconStyleLight}/>
                            {selectedScenario.smartStyleUrl ? selectedScenario.smartStyleUrl : '-'}
                        </span>
                        <Tooltip title={selectedScenario.needPatientBanner === 'T' ? "Application will be launched in fullscreen" : "Application will be launched inside EHR Simulator"} placement='bottom'>
                        <span className='section-value' style={lightColor}>
                                    <FullScreenIcon style={iconStyleLight}/>
                                        <Switch className='toggle' label='Needs Patient Banner' style={{display: 'inline-block', bottom: '2px'}} checked={selectedScenario.needPatientBanner === 'T'}
                                                onChange={e => {
                                                    this.toggleNeedsPatientBanner(e, selectedScenario)
                                                }}/>
                        </span>
                        </Tooltip>
                    </div>}
                    {selectedScenario.cdsHook && selectedScenario.contextParams.map(param => {
                        let patient = selectedScenario.contextParams.find(i => i.name === 'patientId').value;
                        let isPatient = param.name === 'patientId';
                        // let click = param.name !== 'patientId' ? () => this.props.history.push(`data-manager?q=${param.value}&p=${patient}`) : e => this.openInDM(e, patient);
                        let click = isPatient ? () => this.props.history.push(`data-manager?q=${param.value}&p=${patient}`) : e => this.openInDM(e, patient);
                        return <span key={`val-${param.value}`} className='section-value' style={lightColor}>
                                {/*{this.getContextIcon(param.name, iconStyleLight)} <span className={`context-value ${!!patient ? 'context-link' : ''}`} onClick={click}>{param.value}</span>*/}
                            {param.name}: <span className={`context-value ${isPatient ? 'context-link' : ''}`} onClick={isPatient ? e => this.openInDM(e, patient) : null}>{param.value}</span>
                            </span>;

                    })}
                </div>
                {selectedScenario.app && <div className='custom-context-wrapper'>
                    <span className='section-title' style={darkColor}><ContextIcon style={iconStyle}/>Custom Context</span>
                    <div className='custom-context-table-wrapper'>
                        <Fab onClick={onClick} size='small' className={'add-custom-context' + (deleteEnabled && !this.state.addContext ? ' delete' : '')} disabled={disabled}
                             onMouseDown={this.clickingOnTheButton}
                             color={`${deleteEnabled ? 'secondary' : 'primary'}`}>
                            {this.state.addContext ? <SaveIcon/> : deleteEnabled ? <DeleteIcon/> : <ContentAdd/>}
                        </Fab>
                        <Table className='custom-context-table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{color: theme.p3}}>Key</TableCell>
                                    <TableCell style={{color: theme.p3}}>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className='table-body'>
                                {this.state.addContext && <TableRow>
                                    <TableCell>
                                        <TextField label='Key*' id='key' onChange={e => this.setState({key: e.target.value})}/>
                                    </TableCell>
                                    <TableCell>
                                        <TextField label='Value*' id='val' onChange={e => this.setState({val: e.target.value})}/>
                                    </TableCell>
                                </TableRow>}
                                {this.getCustomContext(selectedScenario)}
                            </TableBody>
                        </Table>
                    </div>
                </div>}
                <div className='description-wrapper'>
                    <span className='section-title' style={darkColor}><DescriptionIcon style={iconStyle}/>Description</span>
                    <div className='description'>
                        {selectedScenario.description}
                    </div>
                </div>
            </div>
        </div>
    };

    getContextIcon = (paramName, iconStyleLight) => {
        switch (paramName) {
            case 'patientId':
                return <Patient style={iconStyleLight}/>;
            default:
                return paramName;
        }
    };

    clickingOnTheButton = () => {
        this.buttonClick = true;
    };

    handleContextSelection = (selection) => {
        !this.buttonClick && this.setState({selectedCustomContent: selection});
    };

    deleteCustomContext = () => {
        this.props.deleteCustomContext(this.props.scenarios[this.state.selectedScenario], this.state.selectedCustomContent);
        this.setState({selectedCustomContent: undefined});
        this.buttonClick = false;
    };

    addContext = () => {
        this.props.addCustomContext(this.props.scenarios[this.state.selectedScenario], this.state.key, this.state.val);
        this.setState({addContext: false, key: '', val: ''});
        this.buttonClick = false;
    };

    toggleNeedsPatientBanner = (e, selectedScenario) => {
        selectedScenario.needPatientBanner = selectedScenario.needPatientBanner === 'T' ? 'F' : 'T';
        this.props.updateNeedPatientBanner(this.props.scenarios[this.state.selectedScenario]);
    };

    getCustomContext = (selectedScenario) => {
        let contexts = selectedScenario.contextParams || [];
        return !this.props.modifyingCustomContext
            ? contexts.map((context, i) => {
                return <TableRow hover key={i} selected={this.state.selectedCustomContent === i} onClick={() => this.handleContextSelection(i)} role='checkbox'>
                    <TableCell>
                        {context.name}
                    </TableCell>
                    <TableCell>
                        {context.value}
                    </TableCell>
                </TableRow>
            })
            : <TableRow key={1}>
                <TableCell colSpan={2} style={{textAlign: 'center'}}>
                    <CircularProgress/>
                </TableCell>
            </TableRow>;
    };

    toggleAddContext = () => {
        this.setState({addContext: !this.state.addContext});
        this.buttonClick = false;
    };

    openInDM = (_e, patient) => {
        this.props.doLaunch({
            'launchUri': `${this.props.patientDataManagerUrl}/launch.html`
        }, patient, undefined, true);
    };
}

const mapStateToProps = state => {
    let sandboxApiUrl = state.config.xsettings.data.sandboxManager && state.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
    sandboxApiUrl && sandboxApiUrl.indexOf('//') >= 0 && (sandboxApiUrl = sandboxApiUrl.split('//')[1]);

    let ehrUrl = state.config.xsettings.data.sandboxManager
        ? state.config.xsettings.data.sandboxManager.ehrSimulator
        : '';
    let patientDataManagerUrl = state.config.xsettings.data.sandboxManager
        ? state.config.xsettings.data.sandboxManager.patientDataManager
        : '';

    return {
        user: state.users.oauthUser,
        apps: state.apps.apps,
        fetchingSingleEncounter: state.sandbox.fetchingSingleEncounter,
        fetchingSingleLocation: state.sandbox.fetchingSingleLocation,
        fetchingSingleResource: state.sandbox.fetchingSingleResource,
        modifyingCustomContext: state.sandbox.modifyingCustomContext,

        singleEncounterLoadingError: state.sandbox.singleEncounterLoadingError,
        singleLocationLoadingError: state.sandbox.singleLocationLoadingError,
        singleIntentLoadingError: state.sandbox.singleIntentLoadingError,
        singleResourceLoadingError: state.sandbox.singleResourceLoadingError,
        fetchingSinglePatientError: state.patient.fetchingSingleError,

        singleEncounter: state.sandbox.singleEncounter,
        singleLocation: state.sandbox.singleLocation,
        singleResource: state.sandbox.singleResource,
        singleIntent: state.sandbox.singleIntent,

        fetchingSinglePatient: state.patient.fetchingSingle,
        singlePatient: state.patient.singlePatient,
        creating: state.sandbox.launchScenarioCreating,
        deleting: state.sandbox.launchScenarioDeleting,
        scenariosLoading: state.sandbox.launchScenariosLoading,
        scenarios: state.sandbox.launchScenarios,
        personasPagination: state.persona.personasPagination,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        patients: state.persona.patients,
        personaLoading: state.persona.loading,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),

        hookContexts: state.hooks.hookContexts,
        hooks: state.hooks.services,
        sandboxApiEndpointIndex: state.sandbox.sandboxApiEndpointIndex,
        resourceList: state.sandbox.resourceList,
        resourceListFetching: state.sandbox.resourceListFetching,
        resourceListLoadError: state.sandbox.resourceListLoadError,

        sandboxApiUrl, ehrUrl, patientDataManagerUrl
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        setFetchingSinglePatientFailed, fetchPatient, app_setScreen, loadLaunchScenarios, fetchPersonas, getPersonasPage, createScenario, deleteScenario, doLaunch, updateLaunchScenario, updateNeedPatientBanner,
        lookupPersonasStart, setSinglePatientFetched, setFetchSingleEncounter, setSingleEncounter, setFetchingSingleEncounterError, fetchEncounter, addCustomContext, deleteCustomContext, fetchLocation,
        setFetchingSingleLocationError, setSingleLocation, setSingleIntent, setFetchingSingleIntentError, setSingleResource, setFetchingSingleResourceError, fetchResource, fetchIntent, getDefaultUserForSandbox,
        customSearch, fetchAnyResource, clearResourceFetch, launchHook, loadServices, searchAnyResource,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    },
    dispatch
)


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(LaunchScenarios)));
