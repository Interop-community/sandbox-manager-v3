import React, { Component } from 'react';
import { CircularProgress, Dialog, FlatButton, IconButton, RadioButton, RadioButtonGroup, RaisedButton, Step, StepLabel, Stepper, TextField, Toggle } from "material-ui";
import RightIcon from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import LeftIcon from "material-ui/svg-icons/hardware/keyboard-arrow-left";
import AccountIcon from "material-ui/svg-icons/action/account-box";
import SearchIcon from "material-ui/svg-icons/action/search";
import EventIcon from "material-ui/svg-icons/action/event";
import PatientIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/patient.svg";
import HospitalIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-location_city.svg";
import DescriptionIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-description.svg";
import BulbIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/lightbulb.svg";
import LinkIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/round-link.svg";
import FullScreenIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/baseline-fullscreen.svg";
import InfoIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/baseline-info.svg";
import ContextIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/context-icon.svg";
import WebIcon from "material-ui/svg-icons/av/web";
import { getPatientName, getAge } from "sandbox-manager-lib/utils/fhir";
import PersonaList from "../../Persona/List";
import Apps from '../../Apps';
import muiThemeable from "material-ui/styles/muiThemeable";

import './styles.less';

class Create extends Component {

    constructor (props) {
        super(props);

        this.state = {
            description: '',
            title: '',
            selectedApp: null,
            encounterId: null,
            patientBanner: null,
            showPatientSelectorWrapper: false,
            showPatientSelector: false,
            intent: null,
            showPersonaSelector: false,
            patientId: '',
            locationId: null,
            personaType: null,
            selectedPersona: null,
            currentStep: 0
        };
    }

    componentDidMount () {
        this.initPatient();
        this.initEncounter();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let titleStyle = { backgroundColor: palette.primary2Color, color: palette.primary5Color };
        let actions = this.getActions();

        return <Dialog open={this.props.open} modal={false} onRequestClose={this.props.close} contentClassName='launch-scenario-dialog' actions={actions} actionsContainerClassName='create-modal-actions'>
            <h3 className='modal-title' style={titleStyle}>BUILD LAUNCH SCENARIO</h3>
            <IconButton style={{ color: palette.primary5Color }} className="close-button" onClick={this.props.close}>
                <i className="material-icons">close</i>
            </IconButton>
            <div className='stepper'>
                <Stepper activeStep={this.state.currentStep}>
                    <Step>
                        <StepLabel className='step-label'>Select App</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Choose Persona</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Build Launch Context</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className='step-label'>Details</StepLabel>
                    </Step>
                </Stepper>
            </div>
            <div className='create-scenario-content-wrapper'>
                {this.getContent()}
            </div>
        </Dialog>
    }

    getActions = () => {
        let nextEnabled = this.state.currentStep === 0
            ? !!this.state.selectedApp
            : this.state.currentStep === 1
                ? !!this.state.selectedPersona
                : this.state.currentStep === 2
                    ? true
                    : this.state.title.length > 2;
        let nextColor = nextEnabled ? this.props.muiTheme.palette.primary2Color : this.props.muiTheme.palette.primary3Color;
        let prevColor = this.props.muiTheme.palette.primary2Color;

        let actions = this.state.currentStep !== 3
            ? [<FlatButton disabled={!nextEnabled} label="NEXT" labelPosition="before" style={{ color: nextColor }} icon={<RightIcon/>} onClick={this.next}/>]
            : [<RaisedButton disabled={!nextEnabled} label="SAVE" primary onClick={this.createScenario}/>];

        if (this.state.currentStep > 0) {
            actions.unshift(
                <FlatButton label={<span className='perv-button-label'><LeftIcon style={{ color: prevColor }}/> BACK</span>} labelPosition="before" style={{ color: prevColor }} onClick={this.prev}/>
            );
        }

        return actions;
    };

    getContent = () => {
        let palette = this.props.muiTheme.palette;
        let titleStyle = { color: palette.primary3Color };
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let iconStyle = { color: palette.primary3Color, fill: palette.primary3Color, width: '24px', height: '24px' };

        switch (this.state.currentStep) {
            case 0:
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><WebIcon style={iconStyle}/> Which app will be launched with this Launch Scenario?</span>
                    <Apps title=' ' modal onCardClick={selectedApp => this.setState({ selectedApp })} selectedApp={this.state.selectedApp}/>
                </div>;
            case 1:
                let type = PersonaList.TYPES.persona;
                let typeFilter = { resource: this.state.personaType };
                let personaList = this.props.personas;
                let click = selectedPersona => {
                    this.setState({ showPersonaSelector: false });
                    setTimeout(() => {
                        this.setState({ selectedPersona });
                    }, 300)
                };
                let close = () => {
                    this.setState({ showPersonaSelector: false });
                    setTimeout(() => this.setState({ personaType: undefined }), 400);
                };
                let props = {
                    typeFilter, type, click, personaList, modal: true, theme: palette, lookupPersonasStart: this.props.lookupPersonasStart,
                    search: this.props.fetchPersonas, loading: this.props.personaLoading, close
                };
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><AccountIcon style={iconStyle}/> Which user will launch the app in this launch scenario?</span>
                    <div className='persona-selection'>
                        {((!this.state.personaType && !this.state.selectedPersona) ||
                            (this.state.personaType && this.state.selectedPersona)) && [
                            <div key={2} className='type-selection'>
                                <span>User Persona Type</span>
                                <div>
                                    <RadioButtonGroup valueSelected={this.state.personaType} name="personaType" onChange={this.personaType}>
                                        <RadioButton value="Practitioner" label="Practitioner"/>
                                        <RadioButton value="Patient" label="Patient"/>
                                    </RadioButtonGroup>
                                </div>
                            </div>,
                            <div key={1} className='selected-values'>
                                <span>Selected Persona</span>
                                <span><AccountIcon style={iconStyle}/> {this.state.selectedPersona ? this.getSelectedName() : '-'}</span>
                            </div>]}
                        <div className={'persona-list-wrapper' + (this.state.showPersonaSelector ? ' active' : '')}>
                            {this.state.personaType && !this.state.selectedPersona && <PersonaList {...props} noFilter titleLeft scrollContent/>}
                        </div>
                    </div>
                </div>;
            case 2:
                type = PersonaList.TYPES.patient;
                personaList = this.props.patients;
                props = {
                    typeFilter, type, click: this.togglePatientSearch, personaList, modal: true, theme: palette, lookupPersonasStart: this.props.lookupPersonasStart,
                    search: this.props.fetchPersonas, loading: this.props.personaLoading, close: () => this.togglePatientSearch()
                };
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><ContextIcon style={iconStyle}/> What additional launch context will be provided to the app?</span>
                    <div className='context-selection'>
                        <div className='context-left-column'>
                            <div className='column-item-wrapper'>
                                <PatientIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='patient-id' floatingLabelText='Patient ID'
                                           onBlur={() => this.blur('patientId')} onChange={(_, value) => this.onChange('patientId', value)} value={this.state.patientId}
                                           errorText={this.props.fetchingSinglePatientError ? 'Could not fetch a patient with that ID' : ''}/>
                                <div className={'right-control' + (this.props.fetchingSinglePatient ? ' loader' : '')}>
                                    {!this.props.fetchingSinglePatient
                                        ? <IconButton iconStyle={iconStyle} onClick={() => this.togglePatientSearch()}>
                                            <SearchIcon style={iconStyle}/>
                                        </IconButton>
                                        : <CircularProgress innerStyle={iconStyle} size={25}/>}
                                </div>
                                {(this.props.singlePatient || this.props.fetchingSinglePatient) && <div className='subscript'>
                                    {this.props.fetchingSinglePatient
                                        ? 'Loading patient data...'
                                        : <span>
                                            {getPatientName(this.props.singlePatient)} | {this.props.singlePatient.gender} | {getAge(this.props.singlePatient.birthDate)}
                                        </span>}
                                </div>}
                            </div>
                            <div className='column-item-wrapper'>
                                <EventIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='encounter-id' floatingLabelText='Encounter ID'
                                           onBlur={() => this.blur('encounterId')} onChange={(_, value) => this.onChange('encounterId', value)}
                                           errorText={this.props.singleEncounterLoadingError ? 'Could not fetch an encounter with that ID' : ''}/>
                                <div className={'right-control' + (this.props.fetchingSingleEncounter ? ' loader' : '')}>
                                    {this.props.fetchingSingleEncounter && <CircularProgress innerStyle={iconStyle} size={25}/>}
                                </div>
                                {(this.props.singleEncounter || this.props.fetchingSingleEncounter) && <div className='subscript'>
                                    {this.props.fetchingSingleEncounter
                                        ? 'Loading encounter data...'
                                        : <span>Encounter FHIR Resource Located</span>}
                                </div>}
                            </div>
                            <div className='column-item-wrapper'>
                                <HospitalIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='location-id' floatingLabelText='Location ID'
                                           onChange={(_, value) => this.onChange('locationId', value)}/>
                            </div>
                            <div className='column-item-wrapper'>
                                <DescriptionIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='resource' floatingLabelText='Resource'
                                           onChange={(_, value) => this.onChange('resource', value)}/>
                            </div>
                        </div>
                        <div className='context-right-column'>
                            <div className='column-item-wrapper'>
                                <BulbIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='intent' floatingLabelText='Intent'
                                           onChange={(_, value) => this.onChange('intent', value)}/>
                            </div>
                            <div className='column-item-wrapper'>
                                <LinkIcon className='column-item-icon' style={iconStyle}/>
                                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} fullWidth id='url' floatingLabelText='SMART Style URL'
                                           onChange={(_, value) => this.onChange('url', value)}/>
                            </div>
                            <div className='column-item-wrapper'>
                                <FullScreenIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                                <div>
                                    <Toggle className='toggle' label='Needs Patient Banner' thumbStyle={{ backgroundColor: palette.primary5Color }} trackStyle={{ backgroundColor: palette.primary7Color }}
                                            thumbSwitchedStyle={{ backgroundColor: palette.primary2Color }} trackSwitchedStyle={{ backgroundColor: palette.primary2Color }}
                                            onToggle={(_, value) => this.onChange('patientBanner', value)}/>
                                </div>
                            </div>
                            <div className='column-item-wrapper big-and-centered'>
                                <a href='http://docs.smarthealthit.org/authorization/scopes-and-launch-context/' target='_blank'>
                                    <InfoIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                                    <div>About SMART Context</div>
                                </a>
                            </div>
                        </div>
                        <div className={'persona-list-wrapper' + (this.state.showPatientSelectorWrapper ? ' active' : '')}>
                            {this.state.showPatientSelector && <PersonaList {...props} titleLeft scrollContent/>}
                        </div>
                    </div>
                </div>;
            case 3:
                return <div>
                    <div className='context-selection'>
                        <div className='context-left-column'>
                            <div className='summary-item'>
                                <span className='section-title'>Summary</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <WebIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.selectedApp.authClient.clientName}</span>
                            </div>
                            <div className='summary-item'>
                                <span className='section-sub-title'>Launched by</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <AccountIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.getSelectedName()}</span>
                                <div className='summary-item-icon-right'>
                                    {this.state.selectedPersona.type === 'Patient'
                                        ? <PatientIcon style={iconStyle}/>
                                        : <i className="fa fa-user-md fa-2x"/>}
                                </div>
                            </div>
                            <div className='summary-item'>
                                <span className='section-sub-title'>With the following context:</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <PatientIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.props.singlePatient ? getPatientName(this.props.singlePatient) : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <EventIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.encounterId ? this.state.encounterId : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <HospitalIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.locationId ? this.state.locationId : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <DescriptionIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.resource ? this.state.resource : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <BulbIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.intent ? this.state.intent : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <LinkIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>{this.state.url ? this.state.url : '-'}</span>
                            </div>
                            <div className='summary-item'>
                                <div className='summary-item-icon-left'>
                                    <FullScreenIcon style={iconStyle}/>
                                </div>
                                <span className='summary-item-text'>Needs Patient Banner: {this.state.patientBanner ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className='context-right-column'>
                            <div className='summary-item'>
                                <span className='section-title'>Details</span>
                            </div>
                            <div className='summary-item'>
                                <TextField id='title' fullWidth underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle} floatingLabelText='Launch Scenario Title'
                                           onChange={(_, val) => this.onChange('title', val)} value={this.state.title}/>
                                <span className='subscript'>{this.state.title.length} / 75</span>
                            </div>
                            <div className='summary-item'>
                                <TextField id='description' fullWidth multiLine underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                                           floatingLabelText='Description/Instructions' onChange={(_, val) => this.onChange('description', val)} value={this.state.description}/>
                                <span className='subscript'>{this.state.description.length} / 250</span>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    };

    onChange = (prop, value) => {
        let trimmedProp = this.trimProp(prop, value);
        let state = {};
        state[prop] = trimmedProp;
        this.setState(state);
    };

    trimProp = (prop, value) => {
        switch (prop) {
            case 'title':
                return value.substr(0, 75);
            case 'description':
                return value.substr(0, 250);
            default:
                return value;
        }
    };

    blur = (input) => {
        switch (input) {
            case 'patientId':
                this.state.patientId && this.props.fetchPatient && this.props.fetchPatient(this.state.patientId);
                (!this.state.patientId || this.state.patientId.length === 0) && this.initPatient();
                break;
            case 'encounterId':
                this.state.encounterId && this.props.fetchEncounter && this.props.fetchEncounter(this.state.encounterId);
                (!this.state.encounterId || this.state.encounterId.length === 0) && this.initEncounter();
                break;
        }
    };

    getSelectedName = () => {
        return this.state.selectedPersona.fhirName || this.getName(this.state.selectedPersona.name[0] || this.state.selectedPersona.name);
    };

    personaType = (_, personaType) => {
        this.props.fetchPersonas(PersonaList.TYPES.persona);
        this.setState({ personaType, selectedPersona: null, showPersonaSelector: true });
    };

    togglePatientSearch = (patient) => {
        if (patient) {
            console.log(patient.id);
            this.setState({ selectedPatient: patient, showPatientSelectorWrapper: false, patientId: patient.id });
            setTimeout(() => {
                this.setState({ showPatientSelector: false });
                this.blur('patientId');
            }, 400);
        } else {
            this.props.fetchPersonas(PersonaList.TYPES.patient);
            this.setState({ selectedPatient: null, showPatientSelector: true, showPatientSelectorWrapper: true });
        }
    };

    createScenario = () => {
        let data = {
            app: this.state.selectedApp,
            title: this.state.title,
            description: this.state.description,
            lastLaunchSeconds: Date.now(),
            sandbox: this.props.sandbox,
            userPersona: this.state.selectedPersona,
            createdBy: this.props.user
        };
        this.state.patientBanner && (data.needPatientBanner = this.state.patientBanner ? 'T' : 'F');
        this.props.singlePatient && (data.patientName = getPatientName(this.props.singlePatient));
        this.state.encounterId && (data.encounter = this.state.encounterId);
        this.props.singlePatient && (data.patient = this.state.patientId);
        this.state.locationId && (data.location = this.state.locationId);
        this.state.resource && (data.resource = this.state.resource);
        this.state.intent && (data.intent = this.state.intent);
        this.state.url && (data.url = this.state.url);

        this.props.create && this.props.create(data);
    };

    next = () => {
        this.setState({ currentStep: this.state.currentStep + 1 })
    };

    prev = () => {
        this.setState({ currentStep: this.state.currentStep - 1 })
    };

    initPatient = () => {
        this.props.setFetchingSinglePatientFailed(null);
        this.props.setSinglePatientFetched(null);
    };

    initEncounter = () => {
        this.props.setFetchingSingleEncounterError(null);
        this.props.setSingleEncounter(null);
    };
}

export default muiThemeable()(Create);