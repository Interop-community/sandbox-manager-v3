import React, { Component } from 'react';
import {
    app_setScreen,
    loadLaunchScenarios,
    fetchPersonas,
    getPersonasPage,
    createScenario,
    deleteScenario,
    doLaunch,
    updateLaunchScenario,
    updateNeedPatientBanner,
    lookupPersonasStart,
    addCustomContext,
    fetchLocation,
    fetchPatient,
    setFetchingSinglePatientFailed,
    setSinglePatientFetched,
    setFetchSingleEncounter,
    setSingleEncounter,
    setFetchingSingleEncounterError,
    fetchEncounter,
    deleteCustomContext,
    setSingleLocation,
    setFetchingSingleLocationError,
    setSingleIntent,
    setFetchingSingleIntentError,
    setSingleResource,
    setFetchingSingleResourceError,
    fetchResource,
    fetchIntent,
    getDefaultUserForSandbox
} from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import {
    CircularProgress, Card, IconButton, FloatingActionButton, CardMedia, Popover, Menu, MenuItem, Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn,
    TextField, SelectField, Toggle
} from 'material-ui';
import { ContentSort } from "material-ui/svg-icons/index";
import ContentAdd from 'material-ui/svg-icons/content/add';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import EditIcon from 'material-ui/svg-icons/image/edit';
import PersonaList from '../Persona/List';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import HospitalIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-location_city.svg";
import DescriptionIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-description.svg";
import LinkIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-link.svg";
import FullScreenIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/baseline-fullscreen.svg";
import BulbIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/lightbulb.svg";
import WebIcon from "material-ui/svg-icons/av/web";
import AccountIcon from "material-ui/svg-icons/action/account-box";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import EventIcon from "material-ui/svg-icons/action/event";
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Patient from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/patient.svg";
import ContextIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/context-icon.svg";
import Page from 'sandbox-manager-lib/components/Page';
import DohMessage from "sandbox-manager-lib/components/DohMessage";
import ConfirmModal from "sandbox-manager-lib/components/ConfirmModal";
import Filters from './Filters';
import muiThemeable from "material-ui/styles/muiThemeable";
import Create from './Create';

import './styles.less';

const SORT_VALUES = [
    { val: 'last_used', label: 'Last Used' },
    { val: 'alphabetical', label: 'Alphabetical' }
];

class LaunchScenarios extends Component {

    createKey = 0;
    buttonClick = false;

    constructor (props) {
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
            sort: SORT_VALUES[0].val
        }
    }

    componentDidMount () {
        this.props.app_setScreen('launch');
        this.props.loadLaunchScenarios();
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
    }

    componentWillReceiveProps (nextProps) {
        this.props.deleting && !nextProps.deleting && this.props.loadLaunchScenarios();
    }

    render () {
        return <Page title='Launch Scenarios'>
            {this.state.scenarioToEdit && <Create key={this.createKey} open={!!this.state.scenarioToEdit} close={() => this.selectScenarioForEditing()} create={this.createScenario} {...this.props}
                                                  {...this.state.scenarioToEdit}/>}
            <ConfirmModal open={this.state.showConfirmModal} red confirmLabel='Delete' onConfirm={() => {
                this.props.deleteScenario(this.state.scenarioToDelete);
                this.setState({ showConfirmModal: false })
            }} onCancel={() => this.setState({ showConfirmModal: false, scenarioToDelete: undefined })} title='Confirm'>
                <p>
                    Are you sure you want to delete {this.state.scenarioToDelete && this.state.scenarioToDelete.title ? '"' + this.state.scenarioToDelete.title + '"' : 'this launch scenario'}?
                </p>
            </ConfirmModal>
            <div className='launch-scenarios-wrapper'>
                <a ref='openLink' target='_blank'/>
                <div className='filter-wrapper'>
                    <IconButton onClick={() => this.setState({ desc: !this.state.desc })} className='sort-button'>
                        <ContentSort className={!this.state.desc ? 'rev' : ''} color={this.props.muiTheme.palette.primary3Color}/>
                    </IconButton>
                    <SelectField style={{ width: '140px', marginLeft: '16px' }} labelStyle={{ color: this.props.muiTheme.palette.primary6Color }} underlineStyle={{ display: 'none' }}
                                 value={this.state.sort}
                                 className='sort-select' onChange={(_, sort) => this.setState({ sort: SORT_VALUES[sort].val })}>
                        <MenuItem value={SORT_VALUES[0].val} primaryText={SORT_VALUES[0].label}/>
                        <MenuItem value={SORT_VALUES[1].val} primaryText={SORT_VALUES[1].label}/>
                    </SelectField>
                    <FilterList color={this.props.muiTheme.palette.primary3Color}/>
                    {!this.props.scenariosLoading && this.props.scenarios && this.props.scenarios.length > 0 &&
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter} appliedIdFilter={this.state.appIdFilter}/>}
                    <div className='actions'>
                        <FloatingActionButton onClick={this.toggleCreateModal}>
                            <ContentAdd/>
                        </FloatingActionButton>
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
        this.setState({ scenarioToEdit, showModal: false });
    };

    onFilter = (type, appId) => {
        let state = {};
        state[type] = appId;
        this.setState(state);
    };

    launchScenario = (e, sc) => {
        this.preventDefault(e);
        sc.app && this.props.updateLaunchScenario(sc);
        sc.app && (sc.needPatientBanner === 'T'
            ? this.props.doLaunch(sc.app, sc.patient, sc.userPersona, undefined, sc)
            : this.openEHRSimulator(sc));
        !sc.app && this.props.doLaunch(this.state.selectedApp, this.state.selectedPatient, this.state.selectedPersona);
    };

    openEHRSimulator = (sc) => {
        const cookieUrl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
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
        document.cookie = `hspc-launch-token=${JSON.stringify(token)}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;

        let openLink = this.refs.openLink;
        openLink.href = `${this.props.ehrUrl}/launch`;
        openLink.click();
    };

    handleRowSelect = (row) => {
        let selection = this.state.selectedScenario !== row ? row : undefined;
        this.setState({ selectedScenario: selection, addContext: false, key: '', val: '' });
    };

    createScenario = (data) => {
        this.props.createScenario(data);
        this.toggleCreateModal();
    };

    showDeleteScenario = (sc) => {
        this.toggleMenuForItem();
        this.setState({ showConfirmModal: true, scenarioToDelete: sc });
    };

    toggleCreateModal = () => {
        let showModal = !this.state.showModal;
        let selectedScenario = showModal ? this.state.selectedScenario : undefined;
        showModal && !selectedScenario && !this.props.personas && this.props.fetchPersonas(PersonaList.TYPES.persona);
        showModal && !selectedScenario && !this.props.patients.length && this.props.fetchPersonas(PersonaList.TYPES.patient);
        showModal && !selectedScenario && this.state.selectedPersona && this.props.fetchPersonas(PersonaList.TYPES.patient);
        this.setState({ showModal, selectedScenario, selectedPatient: undefined, selectedPersona: undefined, selectedApp: undefined, description: '' });
        this.createKey++;
    };

    getScenarios = () => {
        let sorted = this.sortScenarios();
        return <div className='scenarios-list'>
            {sorted.map((sc, index) => {
                    let isSelected = this.state.selectedScenario === index;
                    let itemStyles = { backgroundColor: this.props.muiTheme.palette.canvasColor };
                    let contentStyles = isSelected ? { borderTop: '1px solid ' + this.props.muiTheme.palette.primary7Color } : {};
                    let isPatient = sc.userPersona.resource !== 'Practitioner';
                    let iconStyle = isPatient
                        ? {
                            backgroundColor: this.props.muiTheme.palette.accent1Color,
                            color: this.props.muiTheme.palette.primary5Color
                        }
                        : {
                            backgroundColor: this.props.muiTheme.palette.primary5Color,
                            color: this.props.muiTheme.palette.accent1Color
                        };

                    let details = <div key={1} className='expanded-content'>
                        {this.getDetailsContent(sc)}
                    </div>;
                    let filter = (!this.state.appIdFilter || this.state.appIdFilter === sc.app.clientId) &&
                        (!this.state.typeFilter || this.state.typeFilter === sc.userPersona.resource);
                    let showMenuForItem = this.state.showMenuForItem === index;
                    if (filter) {
                        return <div key={index} style={itemStyles} onClick={() => this.handleRowSelect(index)} className={'scenarios-list-row' + (isSelected ? ' active' : '')}>
                            <div className='left-icon-wrapper' style={iconStyle}>
                                <span className='left-icon'>
                                    {isPatient
                                        ? <i><Patient/></i>
                                        : <i className='fa fa-user-md fa-lg'/>}
                                </span>
                            </div>
                            <div className='title-wrapper'>
                                <span className='launch-scenario-title'>{sc.title || sc.description}</span>
                                <span className='launch-scenario-app-name'>{sc.app.clientName}</span>
                            </div>
                            <div className='actions-wrapper'>
                                <IconButton onClick={e => this.launchScenario(e, sc)} tooltip='Launch'>
                                    <LaunchIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                <IconButton onClick={e => this.toggleMenuForItem(e, index)}>
                                    <span className='anchor' ref={'anchor' + index.toString()}/>
                                    <MoreIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                                </IconButton>
                                {showMenuForItem &&
                                <Popover open={showMenuForItem} anchorEl={this.refs['anchor' + index]} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                         targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.toggleMenuForItem}>
                                    <Menu desktop autoWidth={false} width='100px'>
                                        <MenuItem className='scenario-menu-item' primaryText='Edit' leftIcon={<EditIcon/>} onClick={() => this.selectScenarioForEditing(sc)}/>
                                        <MenuItem className='scenario-menu-item' primaryText='Delete' leftIcon={<DeleteIcon/>} onClick={() => this.showDeleteScenario(sc)}/>
                                    </Menu>
                                </Popover>}
                                <IconButton className='expanded-toggle'>
                                    <DownIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
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
        this.setState({ showMenuForItem: itemIndex });
    };

    getDetailsContent = (selectedScenario) => {
        let lightColor = { color: this.props.muiTheme.palette.primary3Color, alpha: '.7' };
        let needsBanner = { color: this.props.muiTheme.palette.primary3Color, alpha: '.7', width: '58%' };
        let normalColor = { color: this.props.muiTheme.palette.primary3Color };
        let darkColor = { color: this.props.muiTheme.palette.primary6Color };
        let iconStyle = { color: this.props.muiTheme.palette.primary6Color, fill: this.props.muiTheme.palette.primary6Color, width: '24px', height: '24px' };
        let iconStyleLight = { color: this.props.muiTheme.palette.primary3Color, fill: this.props.muiTheme.palette.primary3Color, width: '24px', height: '24px' };
        let disabled = this.props.modifyingCustomContext || (this.state.addContext && (!this.state.key.length || !this.state.val.length));
        let deleteEnabled = this.state.selectedCustomContent !== undefined;
        let onClick = this.state.addContext ? this.addContext : deleteEnabled ? this.deleteCustomContext : this.toggleAddContext;
        let underlineFocusStyle = { borderColor: this.props.muiTheme.palette.primary2Color };
        let floatingLabelFocusStyle = { color: this.props.muiTheme.palette.primary2Color };

        return <div className='launch-scenario-wrapper'>
            <div className='persona-wrapper'>
                <span className='section-title' style={darkColor}><AccountIcon style={iconStyle}/>Persona</span>
                <span className='persona-name' style={normalColor}>{selectedScenario.userPersona.fhirName || '-'}</span>
                <span className='persona-id' style={lightColor}>{selectedScenario.userPersona.personaUserId || '-'}</span>
                <div className='app-wrapper'>
                    <span className='section-title' style={darkColor}><WebIcon style={iconStyle}/>App</span>
                    <Card className='app-card small'>
                        <CardMedia className='media-wrapper'>
                            <img style={{ height: '100%' }} src={selectedScenario.app.logoUri || 'https://content.hspconsortium.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png'} alt='HSPC Logo'/>
                        </CardMedia>
                        <div className='card-title' style={{ backgroundColor: 'rgba(0,87,120, 0.75)' }}>
                            <span className='app-name'>{selectedScenario.app.clientName}</span>
                        </div>
                    </Card>
                </div>
            </div>
            <div className='right-side-wrapper'>
                <div className='context-wrapper'>
                    <span className='section-title' style={darkColor}><ContextIcon style={iconStyle}/>Context</span>
                    <div>
                    <span className='section-value' style={lightColor}>
                        <Patient style={iconStyleLight}/>
                        {selectedScenario.patientName && <span style={{ cursor: 'pointer', color: this.props.muiTheme.palette.primary2Color, textDecoration: "underline" }}
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
                        <span className='section-value' style={lightColor}>
                            <FullScreenIcon style={iconStyleLight}/>
                            <Toggle className='toggle' label='Needs Patient Banner' style={{ display: 'inline-block', bottom: '2px' }} labelStyle={needsBanner}
                                    thumbStyle={{ backgroundColor: this.props.muiTheme.palette.primary5Color }}
                                    trackStyle={{ backgroundColor: this.props.muiTheme.palette.primary7Color }} toggled={selectedScenario.needPatientBanner === 'T'}
                                    thumbSwitchedStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color }}
                                    trackSwitchedStyle={{ backgroundColor: this.props.muiTheme.palette.primary2Color, opacity: '.5' }}
                                    onToggle={e => {
                                        this.toggleNeedsPatientBanner(e, selectedScenario)
                                    }}/>
                            {selectedScenario.needPatientBanner !== 'T' && <span className='sub'>App will open in the EHR Simulator.</span>}
                        </span>
                    </div>
                </div>
                <div className='custom-context-wrapper'>
                    <span className='section-title' style={darkColor}><ContextIcon style={iconStyle}/>Custom Context</span>
                    <div className='custom-context-table-wrapper'>
                        <FloatingActionButton onClick={onClick} mini className={'add-custom-context' + (deleteEnabled ? ' delete' : '')} disabled={disabled} onMouseDown={this.clickingOnTheButton}>
                            {this.state.addContext ? <CheckIcon/> : deleteEnabled ? <DeleteIcon/> : <ContentAdd/>}
                        </FloatingActionButton>
                        <Table onRowSelection={this.handleContextSelection} className='custom-context-table'>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                                <TableRow>
                                    <TableHeaderColumn style={{ color: this.props.muiTheme.palette.primary3Color }}>Key</TableHeaderColumn>
                                    <TableHeaderColumn style={{ color: this.props.muiTheme.palette.primary3Color }}>Value</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} className='table-body'>
                                {this.state.addContext && <TableRow selectable={false}>
                                    <TableRowColumn>
                                        <TextField floatingLabelText='Key*' id='key' onChange={(_, key) => this.setState({ key })}
                                                   underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <TextField floatingLabelText='Value*' id='val' onChange={(_, val) => this.setState({ val })}
                                                   underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                                    </TableRowColumn>
                                </TableRow>}
                                {this.getCustomContext(selectedScenario)}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className='description-wrapper'>
                    <span className='section-title' style={darkColor}><DescriptionIcon style={iconStyle}/>Description</span>
                    <div className='description'>
                        {selectedScenario.description}
                    </div>
                </div>
            </div>
        </div>
    };

    clickingOnTheButton = () => {
        this.buttonClick = true;
    };

    handleContextSelection = (selection) => {
        !this.buttonClick && this.setState({ selectedCustomContent: selection[0] });
    };

    deleteCustomContext = () => {
        this.props.deleteCustomContext(this.props.scenarios[this.state.selectedScenario], this.state.selectedCustomContent);
        this.setState({ selectedCustomContent: undefined });
        this.buttonClick = false;
    };

    addContext = () => {
        this.props.addCustomContext(this.props.scenarios[this.state.selectedScenario], this.state.key, this.state.val);
        this.setState({ addContext: false, key: '', val: '' });
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
                return <TableRow key={i} selected={this.state.selectedCustomContent === i}>
                    <TableRowColumn>
                        {context.name}
                    </TableRowColumn>
                    <TableRowColumn>
                        {context.value}
                    </TableRowColumn>
                </TableRow>
            })
            : <TableRow key={1}>
                <TableRowColumn colSpan={2} style={{ textAlign: 'center' }}>
                    <CircularProgress/>
                </TableRowColumn>
            </TableRow>;
    };

    toggleAddContext = () => {
        this.setState({ addContext: !this.state.addContext });
        this.buttonClick = false;
    };

    updateScenario = (state) => {
        let description = state.description !== this.state.scenarioToEdit.description ? state.description : undefined;
        let title = state.title !== this.state.scenarioToEdit.title ? state.title : undefined;
        this.props.updateLaunchScenario(this.state.scenarioToEdit, description, title);
        this.selectScenarioForEditing();
    };

    openInDM = (e, patient) => {
        // e.stopPropagation();
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

        sandboxApiUrl, ehrUrl, patientDataManagerUrl
    }
};

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        setFetchingSinglePatientFailed,
        fetchPatient,
        app_setScreen,
        loadLaunchScenarios,
        fetchPersonas,
        getPersonasPage,
        createScenario,
        deleteScenario,
        doLaunch,
        updateLaunchScenario,
        updateNeedPatientBanner,
        lookupPersonasStart,
        setSinglePatientFetched,
        setFetchSingleEncounter,
        setSingleEncounter,
        setFetchingSingleEncounterError,
        fetchEncounter,
        addCustomContext,
        deleteCustomContext,
        fetchLocation,
        setFetchingSingleLocationError,
        setSingleLocation,
        setSingleIntent,
        setFetchingSingleIntentError,
        setSingleResource,
        setFetchingSingleResourceError,
        fetchResource,
        fetchIntent,
        getDefaultUserForSandbox,
        getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
        getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
    },
    dispatch
);


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(LaunchScenarios)))
