import React, {Component, Fragment} from 'react';
import {
    Card, CardMedia, CircularProgress, Dialog, Button, IconButton, Step, StepLabel, Stepper, TextField, Switch, withTheme, DialogActions, Radio, FormControl, FormHelperText, FormControlLabel
} from '@material-ui/core';
import RightIcon from '@material-ui/icons/KeyboardArrowRight';
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import AccountIcon from '@material-ui/icons/AccountBox';
import SearchIcon from '@material-ui/icons/Search';
import EventIcon from '@material-ui/icons/Event';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import WebIcon from '@material-ui/icons/Web';
import PatientIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/patient.svg';
import HospitalIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/round-location_city.svg';
import DescriptionIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/round-description.svg';
import BulbIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/lightbulb.svg';
import LinkIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/round-link.svg';
import FullScreenIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/baseline-fullscreen.svg';
import InfoIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/baseline-info.svg';
import ContextIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/context-icon.svg';
import HooksIcon from 'svg-react-loader?name=Patient!../../../../assets/icons/hooks-logo-mono.svg';
import {getPatientName, getAge} from '../../../../lib/utils/fhir';
import PersonaList from '../../Persona/List';
import ContextPicker from "./ContextPicker";
import Apps from '../../Apps';

import './styles.less';

class Create extends Component {

    constructor(props) {
        super(props);

        let initialState = {
            id: props.id,
            description: props.description || '',
            title: props.title || '',
            selectedApp: props.app || props.cdsHook || null,
            encounterId: props.encounter || '',
            patientBanner: props.needPatientBanner === 'T' || false,
            showPatientSelectorWrapper: false,
            showPatientSelector: false,
            titleIsClean: true,
            intent: props.intent || '',
            showPersonaSelector: false,
            showContextSelector: false,
            showContextSelectorWrapper: false,
            patientId: props.patient || '',
            locationId: props.locationId || '',
            personaType: (props.userPersona && props.userPersona.resource) || null,
            selectedPersona: props.userPersona || null,
            url: props.smartStyleUrl || '',
            currentStep: props.app || props.cdsHook ? 0 : -1,
            requiredHookContext: [],
            scenarioType: props.app ? 'app' : props.cdsHook ? 'hook' : undefined
        };
        if (props.cdsHook) {
            (props.contextParams || []).map(p => {
                initialState[p.name] = p.value;
            });
            props.contextParams && (initialState = this.addContexts(initialState, props, props.userPersona));
            let hook = props.hookContexts[props.cdsHook.hook];
            props.contextParams.map(param => {
                this.blurHookContext(param.name, hook[param.name], initialState);
            });
        }

        this.state = {
            ...initialState,
            initialState
        };
    }

    componentDidMount() {
        this.initPatient();
        this.initEncounter();
        this.initLocation();
        this.initResource();
        this.initIntent();

        this.props.patient && this.blur('patientId');
        this.props.encounter && this.blur('encounterId');
        this.props.locationId && this.blur('locationId');
    }

    render() {
        let theme = this.props.theme;
        let titleStyle = {backgroundColor: theme.p2, color: theme.p5};
        let actions = this.getActions();

        return <Dialog open={this.props.open} onClose={this.props.close} classes={{paper: 'launch-scenario-dialog'}}>
            <h3 className='modal-title' style={titleStyle}>{this.props.id ? 'Update Launch Scenario' : 'Build Launch Scenario'}</h3>
            <IconButton style={{color: theme.p5}} className='close-button' onClick={this.props.close}>
                <i className='material-icons' data-qa='modal-close-button'>close</i>
            </IconButton>
            {this.state.currentStep >= 0 && <div className='stepper'>
                {this.getStepper()}
            </div>}
            <div className='create-scenario-content-wrapper'>
                {this.getContent()}
            </div>
            <DialogActions classes={{root: 'create-modal-actions'}}>
                {actions}
            </DialogActions>
        </Dialog>
    }

    getStepper = () => {
        return <Stepper activeStep={this.state.currentStep}>
            <Step>
                <StepLabel className='step-label'>{this.state.scenarioType === 'app' ? 'Select App' : 'Select CDS Service'}</StepLabel>
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
    };

    getActions = () => {
        let nextEnabled = this.checkNext();
        let nextColor = nextEnabled ? this.props.theme.p2 : this.props.theme.p3;
        let prevColor = this.props.theme.p2;

        let actions = this.state.currentStep !== 3
            ? [<Button key={1} variant='outlined' disabled={!nextEnabled} style={{color: nextColor}} onClick={this.next}>
                NEXT <RightIcon/>
            </Button>]
            : [<Button key={2} variant='contained' disabled={!nextEnabled} color='primary' onClick={this.createScenario} style={{padding: '6px 30px'}}>
                SAVE
            </Button>];

        if (this.state.currentStep > -1) {
            actions.unshift(
                <Button variant='outlined' style={{color: prevColor}} onClick={this.prev} key={3}>
                    <LeftIcon style={{color: prevColor}}/> BACK
                </Button>
            );
        }

        return actions;
    };

    getContent = () => {
        let theme = this.props.theme;
        let titleStyle = {color: theme.p3};
        let cardTitleStyle = {backgroundColor: 'rgba(0,87,120, 0.75)'};
        let underlineFocusStyle = {borderColor: theme.p2};
        let floatingLabelFocusStyle = {color: theme.p2};
        let iconStyle = {color: theme.p3, fill: theme.p3, width: '24px', height: '24px'};
        let iconStyleSmaller = {color: theme.p3, fill: theme.p3, width: '18px', height: '18px'};
        let rightIconGreenStyle = {color: theme.p1, fill: theme.p1, width: '16px', height: '16px'};
        let rightIconRedStyle = {color: theme.p4, fill: theme.p4, width: '16px', height: '16px', bottom: '-16px', position: 'relative'};

        switch (this.state.currentStep) {
            case -1:
                return <div className='type-selection-wrapper apps-screen-wrapper modal'>
                    <span className='modal-screen-title' style={titleStyle}>Select a launch scenario type</span>
                    <Card title='App launch' className={`app-card small`} onClick={() => this.setState({scenarioType: 'app'})}>
                        <CardMedia className='media-wrapper'>
                            <img style={{height: '100%', width: '100%'}} src='https://content.logicahealth.org/images/hspc/icon/HSPCSandboxNoIconApp-512.png' alt='Logica Logo'/>
                        </CardMedia>
                        <div className='card-title' style={cardTitleStyle}>
                            <h3 className='app-name'>SMART App</h3>
                            <Radio className='app-radio' value='selected' checked={this.state.scenarioType === 'app'}/>
                        </div>
                    </Card>
                    {!!this.props.hooks.length && <Card title='Hook launch' className={`app-card small`} onClick={() => this.setState({scenarioType: 'hook'})}>
                        <CardMedia className='media-wrapper'>
                            <HooksIcon className='default-hook-icon'/>
                        </CardMedia>
                        <div className='card-title' style={cardTitleStyle}>
                            <h3 className='app-name'>CDS Service</h3>
                            <Radio className='app-radio' value='selected' checked={this.state.scenarioType === 'hook'}/>
                        </div>
                    </Card>}
                    {!this.props.hooks.length && <Card title='Hook launch' className={`app-card small disabled`}>
                        <CardMedia className='media-wrapper'>
                            <HooksIcon className='default-hook-icon'/>
                        </CardMedia>
                        <div className='card-title' style={cardTitleStyle}>
                            <h3 className='app-name'>CDS Service</h3>
                            <h3 className='app-name disabled'>No services</h3>
                        </div>
                    </Card>}
                </div>;
            case 0:
                return <div>
                    <span className='modal-screen-title' style={titleStyle}>
                        {this.state.scenarioType === 'hook'
                            ? <Fragment>Which CDS service will be called with this Launch Scenario?</Fragment>
                            : <Fragment><WebIcon style={iconStyle}/> Which app will be launched with this Launch Scenario?</Fragment>}
                    </span>
                    <Apps title=' ' hooks={this.state.scenarioType === 'hook'} modal onCardClick={this.selectCard} selectedApp={this.state.selectedApp}/>
                </div>;
            case 1:
                let type = PersonaList.TYPES.persona;
                let personaList = this.props.personas;
                let click = selectedPersona => {
                    if (selectedPersona) {
                        let state = Object.assign({}, this.state, {selectedPersona});
                        if (this.state.scenarioType === 'hook') {
                            state = this.addContexts(state, this.props, selectedPersona);
                        }
                        this.setState(state);
                    }
                };

                let props = {
                    type, click, personaList, modal: true, theme, lookupPersonasStart: this.props.lookupPersonasStart, selected: this.state.selectedPersona,
                    search: this.props.fetchPersonas, loading: this.props.personaLoading, pagination: this.props.patientsPagination,
                    next: () => this.props.getNextPersonasPage(type, this.props.patientsPagination), prev: () => this.props.getPrevPersonasPage(type, this.props.patientsPagination)
                };
                return <div>
                    <span className='modal-screen-title' style={titleStyle}><AccountIcon style={iconStyle}/>
                        {this.state.scenarioType === 'app'
                            ? 'Which user will launch the app in this launch scenario?'
                            : 'Which user invokes the CDS Service in this launch scenario?'}
                    </span>
                    <div className='persona-selection'>
                        {this.state.selectedPersona && <span className='selected-text'><b>Selected:</b> {this.getSelectedName()}</span>}
                        <PersonaList {...props} noTitle scrollContent/>
                    </div>
                </div>;
            case 2:
                type = PersonaList.TYPES.patient;
                personaList = this.props.patients;
                props = {
                    type, click: this.togglePatientSearch, personaList, modal: true, theme, lookupPersonasStart: this.props.lookupPersonasStart,
                    search: this.props.fetchPersonas, loading: this.props.personaLoading, close: this.closePatientSearch, pagination: this.props.patientsPagination,
                    next: () => this.props.getNextPersonasPage(type, this.props.patientsPagination), prev: () => this.props.getPrevPersonasPage(type, this.props.patientsPagination)
                };
                let contextProps = this.state.showContextSelector
                    ? {
                        close: () => this.toggleContextPicker(), theme, resourceList: this.props.resourceList, resourceListFetching: this.props.resourceListFetching,
                        resourceListLoadError: this.props.resourceListLoadError, type: this.state[`${this.state.contextKey}-context`].type, onSave: this.selectContext,
                        value: this.state[`${this.state.contextKey}-context`] ? this.state[`${this.state.contextKey}-context`].selected : {}
                    }
                    : {};
                return <div>
                    <span className='modal-screen-title' style={titleStyle}>
                        <ContextIcon style={iconStyle}/>
                        {this.state.scenarioType === 'app'
                            ? 'What additional launch context will be provided to the app?'
                            : 'Add the context defined by the hook.'}
                    </span>
                    <div className='context-selection'>
                        <div className='context-left-column'>
                            {this.getLeftColumnContext(theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle)}
                        </div>
                        <div className='context-right-column'>
                            {this.getRightColumnContext(theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle)}
                        </div>
                        <div className={'persona-list-wrapper' + (this.state.showPatientSelectorWrapper ? ' active' : '')}>
                            {this.state.showPatientSelector && <PersonaList {...props} titleLeft scrollContent autoScrollBodyContent={true}/>}
                        </div>
                        <div className={'persona-list-wrapper' + (this.state.showContextSelectorWrapper ? ' active' : '')}>
                            {this.state.showContextSelector && <ContextPicker {...contextProps} />}
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
                                <span className='summary-item-text'>{this.state.selectedApp.clientName || this.state.selectedApp.title}</span>
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
                                        : <i className='fa fa-user-md fa-2x'/>}
                                </div>
                            </div>
                            <div className='summary-item'>
                                <span className='section-sub-title'>With the following context:</span>
                            </div>
                            {this.getContextSummary(iconStyle)}
                        </div>
                        <div className='context-right-column'>
                            <div className='summary-item'>
                                <span className='section-title'>Details</span>
                            </div>
                            <div className='summary-item'>
                                <TextField id='title' fullWidth label='Launch Scenario Title'
                                           onChange={e => this.onChange('title', e.target.value)} value={this.state.title} onKeyPress={this.submitMaybe}/>
                                <span className='subscript'>{this.state.title.length} / 75</span>
                            </div>
                            <div className='summary-item'>
                                <TextField id='description' fullWidth multiline onKeyUp={e => this.submitMaybe(e, true)}
                                           label='Description/Instructions' onChange={e => this.onChange('description', e.target.value)} value={this.state.description}/>
                                <span className='subscript'>{this.state.description.length} / 250</span>
                            </div>
                        </div>
                    </div>
                </div>;
        }
    };

    checkNext = () => {
        let hasAllRequiredHookContext = this.state.scenarioType === 'hook' && Object.keys(this.props.resourceListLoadError).length === 0;

        hasAllRequiredHookContext && this.state.requiredHookContext.map(item => {
            let resType = this.props.hookContexts[this.state.selectedApp.hook][item].type;
            if (resType !== 'object' && (!this.state[item] || this.state[item].length === 0)) {
                hasAllRequiredHookContext = false;
            } else if (resType === 'object' && (!this.state[`${item}-context`] || !this.state[`${item}-context`].selected || Object.keys(this.state[`${item}-context`].selected).length === 0)) {
                hasAllRequiredHookContext = false;
            }
        });

        return this.state.currentStep === -1
            ? !!this.state.scenarioType
            : this.state.currentStep === 0
                ? !!this.state.selectedApp
                : this.state.currentStep === 1
                    ? !!this.state.selectedPersona
                    : this.state.currentStep === 2
                        ? (this.state.scenarioType === 'app' && !this.props.singleEncounterLoadingError && !this.props.singleLocationLoadingError && !this.props.singleIntentLoadingError &&
                        !this.props.singleResourceLoadingError && !this.props.fetchingSinglePatientError) || hasAllRequiredHookContext
                        : this.state.title.length > 2;
    };

    submitMaybe = (event, multiLine) => {
        let nextEnabled = this.checkNext();
        ([10, 13].indexOf(event.charCode) >= 0 || [10, 13].indexOf(event.keyCode) >= 0) && nextEnabled && (!multiLine || (multiLine && event.ctrlKey)) && this.createScenario();
    };

    addContexts = (state, props, selectedPersona) => {
        state.requiredHookContext = [];
        let hookContext = props.hookContexts[state.selectedApp.hook];
        Object.keys(hookContext).map(key => {
            if (key === 'userId') {
                state[key] = selectedPersona.resource + '/' + selectedPersona.fhirId;
            }
            if (hookContext[key].required) {
                state.requiredHookContext.push(key);
            }
        });
        return state;
    };

    getContextSummary = (iconStyle) => {
        if (this.state.scenarioType === 'app') {
            return <Fragment>
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
            </Fragment>
        } else {
            return Object.keys(this.props.hookContexts[this.state.selectedApp.hook]).map((key, index) => {
                let context = this.props.hookContexts[this.state.selectedApp.hook][key];
                let isComplex = context.type === 'object';
                let value = isComplex && this.state[`${key}-context`] && this.state[`${key}-context`].selected
                    ? Object.values(this.state[`${key}-context`].selected).join(',')
                    : this.state[key] || '';
                return <div className='summary-item' key={index}>
                    <div className='summary-item-icon-left'>
                        <ContextIcon style={iconStyle}/> {context.required && <span className='required-tag'>*</span>}
                    </div>
                    <span className='summary-item-text'><span>{context.title}</span>: <span>{value ? value : '-'}</span></span>
                </div>

            })
        }
    };

    selectCard = (selectedApp, service) => {
        this.setState({selectedApp, requiredHookContext: [], service});
    };

    getRightColumnContext = (theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle) => {
        if (this.state.scenarioType === 'app') {
            return <Fragment>
                <div className='column-item-wrapper'>
                    <BulbIcon className='column-item-icon' style={iconStyle}/>
                    <FormControl error={!!this.props.singleIntentLoadingError} fullWidth>
                        <TextField fullWidth id='intent' label='Intent' onChange={e => this.onChange('intent', e.target.value)} value={this.state.intent}/>
                        {!!this.props.singleIntentLoadingError && <FormHelperText>Could not fetch an intent with that ID</FormHelperText>}
                    </FormControl>
                    {(this.props.singleIntent || this.props.fetchingSingleIntent) && <div className='subscript'>
                        {this.props.fetchingSingleIntent
                            ? 'Loading intent data...'
                            : <span>Intent FHIR Resource Located</span>}
                    </div>}
                    <div className='subscript right'>
                        {this.props.singleIntent && <CheckIcon style={rightIconGreenStyle}/>}
                        {this.props.singleIntentLoadingError && <CloseIcon style={rightIconRedStyle}/>}
                    </div>
                </div>
                <div className='column-item-wrapper'>
                    <LinkIcon className='column-item-icon' style={iconStyle}/>
                    <TextField fullWidth id='url' label='SMART Style URL' onChange={e => this.onChange('url', e.target.value)} value={this.state.url}/>
                </div>
                <div className='column-item-wrapper'>
                    <FullScreenIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                    <div style={{position: 'relative', top: '-7px'}}>
                        <FormControlLabel control={<Switch className='toggle' checked={this.state.patientBanner} onChange={(_e, v) => this.onChange('patientBanner', v)}/>}
                                          label='Needs Patient Banner'/>
                        <span className='sub'>{!this.state.patientBanner && 'App will open in the EHR Simulator.'}</span>
                    </div>
                </div>
                <div className='column-item-wrapper big-and-centered'>
                    <a href='http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/' target='_blank'>
                        <InfoIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                        <div>About SMART Context</div>
                    </a>
                </div>
            </Fragment>
        } else {
            return this.getHookContextColumn(0, theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle)
        }
    };

    getLeftColumnContext = (theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle) => {
        if (this.state.scenarioType === 'app') {
            return <Fragment>
                <div className='column-item-wrapper'>
                    <PatientIcon className='column-item-icon' style={iconStyle}/>
                    <FormControl error={!!this.props.fetchingSinglePatientError} fullWidth>
                        <TextField fullWidth id='patient-id' label='Patient ID' onBlur={() => this.blur('patientId')} onChange={e => this.onChange('patientId', e.target.value)}
                                   value={this.state.patientId}/>
                        {!!this.props.fetchingSinglePatientError && <FormHelperText>Could not fetch a patient with that ID</FormHelperText>}
                        <div className={'right-control' + (this.props.fetchingSinglePatient ? ' loader' : '')}>
                            <IconButton style={iconStyle} onClick={() => this.togglePatientSearch()}>
                                <SearchIcon style={iconStyle}/>
                            </IconButton>
                        </div>
                    </FormControl>
                    {(this.props.singlePatient || this.props.fetchingSinglePatient) && <div className='subscript'>
                        {this.props.fetchingSinglePatient
                            ? 'Loading patient data...'
                            : <span>{getPatientName(this.props.singlePatient)} | {this.props.singlePatient.gender} | {getAge(this.props.singlePatient.birthDate)}</span>}
                    </div>}
                    <div className='subscript right'>
                        {this.props.fetchingSinglePatient && <CircularProgress style={iconStyleSmaller} size={18}/>}
                        {this.props.singlePatient && <CheckIcon style={rightIconGreenStyle}/>}
                        {this.props.fetchingSinglePatientError && <CloseIcon style={rightIconRedStyle}/>}
                    </div>
                </div>
                <div className='column-item-wrapper'>
                    <EventIcon className='column-item-icon' style={iconStyle}/>
                    <FormControl error={!!this.props.singleEncounterLoadingError} fullWidth>
                        <TextField fullWidth id='encounter-id' label='Encounter ID' onBlur={() => this.blur('encounterId')} onChange={e => this.onChange('encounterId', e.target.value)}
                                   value={this.state.encounterId}/>
                        {!!this.props.singleEncounterLoadingError && <FormHelperText>Could not fetch an encounter with that ID</FormHelperText>}
                    </FormControl>
                    {(this.props.singleEncounter || this.props.fetchingSingleEncounter) && <div className='subscript'>
                        {this.props.fetchingSingleEncounter
                            ? 'Loading encounter data...'
                            : <span>Encounter FHIR Resource Located</span>}
                    </div>}
                    <div className='subscript right'>
                        {this.props.fetchingSingleEncounter && <CircularProgress style={iconStyle} size={18}/>}
                        {this.props.singleEncounter && <CheckIcon style={rightIconGreenStyle}/>}
                        {this.props.singleEncounterLoadingError && <CloseIcon style={rightIconRedStyle}/>}
                    </div>
                </div>
                <div className='column-item-wrapper'>
                    <HospitalIcon className='column-item-icon' style={iconStyle}/>
                    <FormControl error={!!this.props.singleLocationLoadingError} fullWidth>
                        <TextField fullWidth id='location-id' label='Location ID' onBlur={() => this.blur('locationId')} onChange={e => this.onChange('locationId', e.target.value)}
                                   value={this.state.locationId}/>
                        {!!this.props.singleLocationLoadingError && <FormHelperText>Could not fetch a location with that ID</FormHelperText>}
                    </FormControl>
                    {(this.props.singleLocation || this.props.fetchingSingleLocation) && <div className='subscript'>
                        {this.props.fetchingSingleLocation
                            ? 'Loading location data...'
                            : <span>Location FHIR Resource Located</span>}
                    </div>}
                    <div className='subscript right'>
                        {this.props.fetchingSingleLocation && <CircularProgress style={iconStyle} size={18}/>}
                        {this.props.singleLocation && <CheckIcon style={rightIconGreenStyle}/>}
                        {this.props.singleLocationLoadingError && <CloseIcon style={rightIconRedStyle}/>}
                    </div>
                </div>
                <div className='column-item-wrapper'>
                    <DescriptionIcon className='column-item-icon' style={iconStyle}/>
                    <FormControl error={!!this.props.singleResourceLoadingError} fullWidth>
                        <TextField fullWidth id='resource' label='Resource' onBlur={() => this.blur('resourceId')} onChange={e => this.onChange('resource', e.target.value)}/>
                        {!!this.props.singleResourceLoadingError && <FormHelperText>Could not fetch the specified resource</FormHelperText>}
                    </FormControl>
                    {(this.props.singleResource || this.props.fetchingSingleResource) && <div className='subscript'>
                        {this.props.fetchingSingleResource
                            ? 'Loading resource data...'
                            : <span>FHIR Resource Located</span>}
                    </div>}
                    <div className='subscript right'>
                        {this.props.fetchingSingleResource && <CircularProgress style={iconStyle} size={18}/>}
                        {this.props.singleResource && <CheckIcon style={rightIconGreenStyle}/>}
                        {this.props.singleResourceLoadingError && <CloseIcon style={rightIconRedStyle}/>}
                    </div>
                </div>
            </Fragment>;
        } else {
            return this.getHookContextColumn(1, theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle)
        }
    };

    getHookContextColumn = (comp, theme, iconStyle, underlineFocusStyle, floatingLabelFocusStyle, iconStyleSmaller, rightIconGreenStyle, rightIconRedStyle) => {
        return Object.keys(this.props.hookContexts[this.state.selectedApp.hook]).map((key, index) => {
            let context = this.props.hookContexts[this.state.selectedApp.hook][key];
            let value = this.state[key] || '';
            if (this.state[`${key}-context`] && this.state[`${key}-context`].selected) {
                value = Object.values(this.state[`${key}-context`].selected).join(',');
            }
            let isComplex = context.type === 'object';
            let disabled = key === 'userId' || isComplex || this.props.resourceListFetching[context.resourceType];
            // isComplex && context.resourceType && this.state[context.resourceType[this.props.sandboxApiEndpointIndex].type] &&
            // (value = Object.keys(this.state[context.resourceType[this.props.sandboxApiEndpointIndex].type]).join(','));

            return index % 2 === comp && key !== 'userId' && <div className='column-item-wrapper' key={index}>
                <ContextIcon style={iconStyle}/> {context.required && <span className='required-tag'>*</span>}
                <FormControl error={!!this.props.singleResourceLoadingError}>
                    <TextField fullWidth id={key} label={context.title} onBlur={() => this.blurHookContext(key, context, this.state)} onChange={e => this.onChange(key, e.target.value)}
                               disabled={disabled} value={value} classes={{root: isComplex ? 'custom-context-button' : ''}}/>
                    {isComplex && <div className={'right-control'}>
                        <IconButton style={iconStyle} onClick={() => this.fetchContext(context, key)}>
                            <SearchIcon style={iconStyle}/>
                        </IconButton>
                    </div>}
                    {!!this.props.singleResourceLoadingError && <FormHelperText>Could not fetch the specified resource</FormHelperText>}
                </FormControl>
                {key === 'patientId' && <div className={'right-control' + (this.props.fetchingSinglePatient ? ' loader' : '')}>
                    <IconButton style={iconStyle} onClick={() => this.togglePatientSearch()}>
                        <SearchIcon style={iconStyle}/>
                    </IconButton>
                </div>}
                <div className='subscript'>
                    {this.props.resourceListFetching[context.resourceType]
                        ? 'Loading resource data...'
                        : this.props.resourceList[context.resourceType] && !!value
                            ? <span>FHIR Resource Located</span>
                            : null}
                </div>
                <div className='subscript right'>
                    {this.props.resourceListFetching[context.resourceType] && <CircularProgress style={iconStyle} size={18}/>}
                    {this.props.resourceList[context.resourceType] && !!value && <CheckIcon style={rightIconGreenStyle}/>}
                    {this.props.resourceListLoadError[context.resourceType] && <CloseIcon style={rightIconRedStyle}/>}
                </div>
            </div>
        })
    };

    fetchContext = (context, key) => {
        if (this.state.patientId) {
            let resources = context.resourceType[this.props.sandboxApiEndpointIndex];
            resources.forEach(res => {
                let crit = {}; //Object.assign({}, context.resourceType[this.props.sandboxApiEndpointIndex].crit);
                crit.patient = this.state.patientId;
                this.props.searchAnyResource(res.type, crit);
            });
            this.toggleContextPicker(resources, key);
        } else {
            alert('Please select a patient first');
        }
    }

    toggleContextPicker = (type, key) => {
        let state = {
            contextKey: key,
            showContextSelector: !this.state.showContextSelector,
            showContextSelectorWrapper: !this.state.showContextSelectorWrapper
        };
        state[`${key}-context`] = {
            ...this.state[`${key}-context`],
            type
        };

        this.setState(state);
    }

    selectContext = values => {
        let state = {};
        let context = Object.assign({}, this.state[`${this.state.contextKey}-context`]);
        context.selected = values;
        state[`${this.state.contextKey}-context`] = context;
        this.setState(state)
        this.toggleContextPicker();
    }

    blurHookContext = (key, context, state) => {
        let crit = state[key];
        crit && context.type === 'object' && this.props.fetchAnyResource && this.props.fetchAnyResource(context.resourceType, crit);
        !crit && this.props.clearResourceFetch && this.props.clearResourceFetch(context.resourceType);
    };

    onChange = (prop, value) => {
        let trimmedProp = this.trimProp(prop, value);
        let state = {};
        state[prop] = trimmedProp;
        if (prop === 'title' && value !== this.state.title) {
            state.titleIsClean = false
        }
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
            case 'locationId':
                this.state.locationId && this.props.fetchLocation && this.props.fetchLocation(this.state.locationId);
                (!this.state.locationId || this.state.locationId.length === 0) && this.initLocation();
                break;
            case 'resourceId':
                this.state.resource && this.props.fetchResource && this.props.fetchResource(this.state.resource);
                (!this.state.resource || this.state.resource.length === 0) && this.initResource();
                break;
            case 'intentId':
                this.state.intent && this.props.fetchIntent && this.props.fetchIntent(this.state.intent);
                (!this.state.intent || this.state.intent.length === 0) && this.initIntent();
                break;
        }
    };

    getSelectedName = () => {
        return this.state.selectedPersona.fhirName || this.getName(this.state.selectedPersona.name[0] || this.state.selectedPersona.name);
    };

    personaType = (_, personaType) => {
        this.props.fetchPersonas(PersonaList.TYPES.persona);
        this.setState({personaType, selectedPersona: null, showPersonaSelector: true});
    };

    togglePatientSearch = (patient) => {
        if (patient) {
            this.setState({selectedPatient: patient, showPatientSelectorWrapper: false, patientId: patient.id});
            setTimeout(() => {
                this.setState({showPatientSelector: false});
                this.blur('patientId');
                this.blurHookContext('patientId', {resourceType: 'Patient'}, this.state);
            }, 400);
        } else {
            this.props.fetchPersonas(PersonaList.TYPES.patient);
            this.setState({selectedPatient: null, showPatientSelector: true, showPatientSelectorWrapper: true});
        }
    };

    closePatientSearch = () => {
        this.setState({showPatientSelectorWrapper: false});
        setTimeout(() => {
            this.setState({showPatientSelector: false});
        }, 400);
    };

    createScenario = () => {
        let data = {
            createdBy: this.props.user,
            title: this.state.title,
            description: this.state.description,
            lastLaunchSeconds: Date.now(),
            sandbox: this.props.sandbox,
            userPersona: this.state.selectedPersona
        };
        this.state.id && (data.id = this.state.id);

        if (this.state.scenarioType === 'app') {
            data.app = this.state.selectedApp;
            this.state.patientBanner && (data.needPatientBanner = this.state.patientBanner ? 'T' : 'F');
            this.props.singlePatient && (data.patientName = getPatientName(this.props.singlePatient));
            this.state.encounterId && (data.encounter = this.state.encounterId);
            this.props.singlePatient && (data.patient = this.state.patientId);
            this.state.locationId && (data.location = this.state.locationId);
            this.state.resource && (data.resource = this.state.resource);
            this.state.url && (data.smartStyleUrl = this.state.url);
            this.state.intent && (data.intent = this.state.intent);
        } else {
            data.cdsHook = this.state.selectedApp;
            data.cdsServiceEndpoint = this.state.service;
            data.contextParams = [];
            Object.keys(this.props.hookContexts[this.state.selectedApp.hook]).map(key => {
                if (this.state[`${key}-context`] && this.state[`${key}-context`].selected) {
                    data.contextParams.push({name: key, value: Object.values(this.state[`${key}-context`].selected).join(',')});
                } else if (this.state[key] && this.state[key].length > 0) {
                    data.contextParams.push({name: key, value: this.state[key]});
                }
            })
        }


        this.props.create && this.props.create(data);
        data.id && this.props.close && this.props.close();
    };

    next = () => {
        let currentStep = this.state.currentStep + 1;
        let state = {currentStep};
        if (currentStep === 1) {
            this.props.fetchPersonas(PersonaList.TYPES.persona);
        } else if (this.state.titleIsClean && currentStep === 3 && !this.state.id) {
            state.title = `Launch ${this.state.selectedApp.clientName || this.state.selectedApp.title}`;
            let patient = this.props.singlePatient ? ` with ${getPatientName(this.props.singlePatient)}` : '';
            let selectedName = ` as ${this.getSelectedName()}`;

            state.title.length + patient.length <= 75 && (state.title += (this.props.singlePatient ? patient : ''));
            state.title.length + selectedName.length <= 75 && (state.title += selectedName);
        }
        this.setState(state)
    };

    prev = () => {
        let currentStep = this.state.currentStep - 1;
        let state = currentStep >= 0 ? {currentStep} : this.state.initialState;
        this.setState(state)
    };

    initPatient = () => {
        this.props.setFetchingSinglePatientFailed(null);
        this.props.setSinglePatientFetched(null);
    };

    initEncounter = () => {
        this.props.setFetchingSingleEncounterError(null);
        this.props.setSingleEncounter(null);
    };

    initLocation = () => {
        this.props.setFetchingSingleLocationError(null);
        this.props.setSingleLocation(null);
    };

    initResource = () => {
        this.props.setFetchingSingleResourceError(null);
        this.props.setSingleResource(null);
    };

    initIntent = () => {
        this.props.setFetchingSingleIntentError(null);
        this.props.setSingleIntent(null);
    };
}

export default withTheme(Create);
