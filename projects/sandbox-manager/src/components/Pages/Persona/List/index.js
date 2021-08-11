import React, {Component} from 'react';
import {Badge, CircularProgress, Fab, IconButton, Menu, MenuItem, Popover, Table, TableBody, TableHead, TableRow, TableCell, Tooltip} from '@material-ui/core';
import DownIcon from "@material-ui/icons/KeyboardArrowDown";
import ContentAdd from '@material-ui/icons/Add';
import LaunchIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";
import FilterList from "@material-ui/icons/FilterList";
import Filters from '../Filters';
import DohMessage from "../../../UI/DohMessage";
import ConfirmModal from "../../../UI/ConfirmModal";
import Patient from "svg-react-loader?name=Patient!../../../../assets/icons/patient.svg";
import Page from '../../../UI/Page';
import {BarChart} from 'react-chartkick';
import CreatePersona from "../Create";
import moment from 'moment';
import HelpButton from '../../../UI/HelpButton';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {deletePractitioner, lookupPersonasStart, doLaunch, fetchPatientDetails, patientDetailsFetchStarted, deletePersona} from "../../../../redux/action-creators";
import {getAge} from "../../../../lib/utils";

import './styles.less';

let chartData = [
    ['Allergy Intolerance', 0], ['Care Plan', 0], ['Care Team', 0], ['Condition', 0], ['Diagnostic Report', 0], ['Encounter', 0],
    ['Goal', 0], ['Immunization', 0], ['Medication Dispense', 0], ['Medication Request', 0], ['Observation', 0], ['Procedure', 0], ['Procedure Request', 0]
];
let createKey = 1;
const TYPES = {
    patient: 'Patient',
    persona: 'Persona',
    practitioner: 'Practitioner'
};
const CHART = <BarChart data={chartData} library={{yAxis: {allowDecimals: false}, plotOptions: {series: {dataLabels: {enabled: true}}}}}/>;

class PersonaList extends Component {

    constructor(props) {
        super(props);

        let searchCrit = props.typeFilter ? props.typeFilter : '';

        this.state = {
            searchCrit,
            creationType: '',
            showConfirmModal: false,
            showCreateModal: false
        };
    }

    componentDidMount() {
        let canFit = this.calcCanFit();

        if (this.props.type !== TYPES.persona && !this.props.idRestrictions) {
            let element = this.props.modal ? document.getElementsByClassName('page-content-wrapper')[1] : document.getElementsByClassName('stage')[0];
            element.addEventListener('scroll', this.scroll);
            let crit = this.props.idRestrictions ? this.props.idRestrictions.split('?')[1] : null;
            this.props.fetchPersonas && this.props.fetchPersonas(this.props.type, crit, canFit);
        }
    }

    componentWillUnmount() {
        let element = this.props.modal ? document.getElementsByClassName('page-content-wrapper')[1] : document.getElementsByClassName('stage')[0];
        element && element.removeEventListener('scroll', this.scroll);
    }

    componentWillReceiveProps(nextProps) {
        chartData[0][1] = nextProps.allergyCount;
        chartData[1][1] = nextProps.carePlanCount;
        chartData[2][1] = nextProps.careTeamCount;
        chartData[3][1] = nextProps.conditionCount;
        chartData[4][1] = nextProps.diagnosticReportCount;
        chartData[5][1] = nextProps.encounterCount;
        chartData[6][1] = nextProps.goalCount;
        chartData[7][1] = nextProps.immunizationCount;
        chartData[8][1] = nextProps.medicationDispenseCount;
        chartData[10][1] = nextProps.observationCount;
        chartData[11][1] = nextProps.procedureCount;
        chartData[12][1] = nextProps.procedureRequestCount;

        if (nextProps.medicationOrderCount) {
            chartData[9] = ['Medication Order', nextProps.medicationOrderCount];
        } else {
            chartData[9][1] = nextProps.medicationRequestCount;
        }
    }

    render() {
        let isPatient = this.props.type === TYPES.patient;
        let isPractitioner = this.props.type === TYPES.practitioner;

        let defaultTitle = isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';
        let title = this.props.title ? this.props.title : defaultTitle;

        let personaList = this.getPersonaList(isPatient, isPractitioner);

        let helpIcon = <HelpButton style={{marginLeft: '10px'}} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/79364100/Sandbox+Persona'/>;
        let pageProps = {
            noTitle: this.props.noTitle, title, titleLeft: this.props.titleLeft, close: this.props.close, scrollContent: this.props.scrollContent, darkCloseIcon: true
        };
        !isPatient && !isPractitioner;// && (pageProps.helpIcon = helpIcon);

        return <Page {...pageProps}>
            <ConfirmModal red open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.deletePersona} title='Confirm'
                          onCancel={() => this.setState({showConfirmModal: false, personaToDelete: undefined})}>
                <p style={{padding: '15px 20px'}}>
                    Are you sure you want to delete this {this.props.type.toLowerCase()}?
                </p>
            </ConfirmModal>
            {!this.props.modal && <div className='create-resource-button'>
                <CreatePersona key={createKey} open={this.state.showCreateModal} create={this.props.create} type={this.props.type} theme={this.props.theme} close={() => this.toggleCreateModal()}
                               personaType={this.state.creationType} personas={this.props[this.state.creationType.toLowerCase() + 's']} existingPersonas={this.getFilteredList()} search={this.props.search}/>
            </div>}
            <div className={'personas-wrapper' + (this.props.modal ? ' modal' : '')} data-qa={`${this.props.type}-wrapper`}>
                {!this.props.noFilter && <div className='filter-wrapper'>
                    <FilterList style={{color: this.props.theme.p3}}/>
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter}/>
                    <div className='actions'>
                        {(isPractitioner || isPatient) && !this.props.modal && <Fab onClick={() => this.toggleCreateModal()} color='primary'>
                            <ContentAdd/>
                        </Fab>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <Fab onClick={() => this.toggleCreateModal(TYPES.patient)} style={{marginRight: '16px'}} color='primary'>
                            <Patient style={{width: '26px', fill: this.props.theme.p5}}/>
                        </Fab>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <Fab onClick={() => this.toggleCreateModal(TYPES.practitioner)} color='secondary'>
                            <i className='fa fa-user-md fa-lg'/>
                        </Fab>}
                    </div>
                </div>}
                <div style={{position: this.props.modal ? 'relative' : 'absolute', width: '100%'}}>
                    {personaList
                        ? <div className={'persona-table-wrapper' + (this.props.modal ? ' modal' : '')}>
                            {personaList}
                            {this.props.loading && <div className='loader-wrapper' style={{height: !this.props.modal ? '70px' : '110px', paddingTop: !this.props.modal ? '20px' : '30px', margin: 0}}>
                                <CircularProgress size={this.props.modal ? 80 : 40} thickness={5}/>
                            </div>}
                        </div>
                        : this.state.searchCrit
                            ? <div style={{textAlign: 'center', paddingTop: '50px'}}>No results found</div>
                            : this.props.loading
                                ? <div className='loader-wrapper' style={{height: !this.props.modal ? '70px' : '110px', paddingTop: !this.props.modal ? '20px' : '30px', margin: 0}}>
                                    <CircularProgress size={this.props.modal ? 80 : 40} thickness={5}/>
                                </div>
                                : <DohMessage message={`No ${defaultTitle.toLowerCase()} in sandbox.`}/>}
                </div>
            </div>
        </Page>
    }

    calcCanFit = () => {
        let containerHeight = document.getElementsByClassName('page-wrapper')[0].clientHeight;
        // we calculate how much patients we can show on the screen and get just that much plus two so that we have content below the fold
        return Math.ceil((containerHeight - 154) / 50) + 2;
    };

    scroll = () => {
        let scrollSize = document.getElementsByClassName('persona-table-wrapper')[0].clientHeight - (document.getElementsByClassName('page-wrapper')[0].clientHeight + 154);
        let scrollTop = this.props.modal ? document.getElementsByClassName('page-content-wrapper')[1].scrollTop : document.getElementsByClassName('stage')[0].scrollTop;
        let dif = scrollSize - scrollTop;
        let canFit = this.calcCanFit();

        let shouldFetch = !this.props.loading && this.props.type !== TYPES.persona && dif <= 50 && this.props.pagination.link.find(i => i.relation === 'next');
        shouldFetch && this.props.next(canFit);
    };

    toggleCreateModal = (type) => {
        createKey++;
        type && this.props.fetchPersonas(type);
        this.setState({showCreateModal: !this.state.showCreateModal, creationType: type || ''});
    };

    getPersonaList = (isPatient, isPractitioner) => {
        let itemStyles = {};

        let rows = [];
        let list = this.getFilteredList();
        list.map((persona, i) => {
            let style = this.props.theme ? {color: persona.gender === 'male' ? this.props.theme.p2 : this.props.theme.a1, WebkitTextStroke: '1px', fontSize: '24px'} : undefined;
            style.position = 'relative';
            let badge = isPatient
                ? <Badge style={Object.assign(style, {padding: 0})}>
                    {persona.gender === 'male' ? <i className="fa fa-mars"/> : <i className="fa fa-venus"/>}
                </Badge>
                : isPractitioner
                    ? <Badge style={{padding: '0', color: this.props.theme.p1, position: 'relative'}}>
                        <i className="fa fa-user-md fa-2x"/>
                    </Badge>
                    : persona.resource === 'Practitioner'
                        ? <Badge style={{padding: '0', color: this.props.theme.a1, position: 'relative'}}>
                            <i className="fa fa-user-md fa-2x"/>
                        </Badge>
                        : <Badge style={{padding: '0', width: '28px', height: '28px', position: 'relative', left: '-2px'}}>
                            <Patient style={{fill: this.props.theme.p2, width: '28px', height: '28px'}}/>
                        </Badge>;
            let age = getAge(persona.birthDate);
            let isSelected = i === this.state.selected || (this.props.selected && this.props.selected.id === persona.id);
            let contentStyles = isSelected ? {borderBottom: '1px solid ' + this.props.theme.p7} : {};
            let showMenuForItem = this.state.showMenuForItem === i;
            let patientRightIconStyle = {padding: 0, width: '40px', height: '40px'};

            rows.push(<TableRow key={persona.id} style={itemStyles} className={'persona-list-item' + (isSelected ? ' active' : '')} selected={isSelected} onClick={e => this.handleRowSelect([i * 2], e)}>
                <TableCell className='persona-info left-icon-wrapper'>
                    {badge}
                </TableCell>
                <TableCell className={'persona-info name' + (isPractitioner ? ' pract' : '')}>
                    <Tooltip title={persona.fhirName || (!!persona.name ? this.getName(persona.name[0] || persona.name) : '')}>
                        <span>
                        {persona.fhirName || (!!persona.name ? this.getName(persona.name[0] || persona.name) : '')}
                        </span>
                    </Tooltip>
                </TableCell>
                {!isPatient && !isPractitioner && <TableCell className='persona-info resource'>
                    {persona.resource + '/' + persona.fhirId}
                </TableCell>}
                {isPatient && !isPractitioner && <TableCell className='persona-info'>
                    {persona.id}
                </TableCell>}
                {isPatient && <TableCell className='persona-info'>
                    {isPatient && age}
                </TableCell>}
                {isPatient && <TableCell className='persona-info'>
                    {isPatient && (persona.birthDate ? moment(persona.birthDate).format('DD MMM YYYY') : 'N/A')}
                </TableCell>}
                {!isPatient && !isPractitioner && <TableCell className='persona-info login'>
                    <div>
                        U: {persona.personaUserId}
                    </div>
                    <div>
                        P: {!isPatient && persona.password}
                    </div>
                </TableCell>}
                {isPractitioner && <TableCell className={'persona-info' + (isPractitioner ? ' pract' : '')}>{persona.id}</TableCell>}
                {!this.props.modal && !isPractitioner && <TableCell className={isPatient ? 'actions-row' : !isPractitioner ? ' actions-row small' : ''} style={{textAlign: 'right'}}>
                    {!isPatient && <IconButton onClick={() => {
                        this.toggleMenuForItem();
                        this.deletePersona(persona);
                    }}>
                        <span className='anchor' ref={'anchor' + i}/>
                        {/*<MoreIcon style={{color:this.props.theme.p3}} style={{ width: '24px', height: '24px' }}/>*/}
                        <DeleteIcon style={{color: this.props.theme.p3}} style={{width: '24px', height: '24px'}}/>
                    </IconButton>}
                    {isPatient && <IconButton style={patientRightIconStyle} onClick={e => this.openInDM(e, persona)}>
                        <span/>
                        <LaunchIcon style={{color: this.props.theme.p3}} style={{width: '24px', height: '24px'}}/>
                    </IconButton>}
                    {isPatient && <IconButton onClick={e => this.handleRowSelect([i * 2], e)} style={patientRightIconStyle}>
                        <span/>
                        <DownIcon style={{color: this.props.theme.p3}} style={{width: '24px', height: '24px'}}/>
                    </IconButton>}
                    {!isPatient && showMenuForItem &&
                    <Popover open={showMenuForItem} anchorEl={this.refs['anchor' + i]} anchorOrigin={{horizontal: 'left', vertical: 'top'}} targetOrigin={{horizontal: 'right', vertical: 'top'}}
                             onClose={this.toggleMenuForItem}>
                        <Menu desktop autoWidth={false} width='100px'>
                            {isPatient && <MenuItem className='scenario-menu-item' onClick={e => this.openInDM(e, persona)}>
                                <LaunchIcon/> Edit
                            </MenuItem>}
                            <MenuItem className='scenario-menu-item' onClick={() => {
                                this.toggleMenuForItem();
                                this.deletePersona(persona)
                            }}>
                                <DeleteIcon/> Delete
                            </MenuItem>
                        </Menu>
                    </Popover>}
                </TableCell>}
            </TableRow>);
            !this.props.modal && isPatient && rows.push(<TableRow key={persona.id + '_content'} className={'content' + (isSelected ? ' active' : '')} style={contentStyles}>
                <TableCell colSpan='6'>
                    <div className='chart'>
                        {isSelected && !this.props.fetchingDetails && CHART}
                        {isSelected && this.props.fetchingDetails && <div className='loader-wrapper' style={{height: '300px', paddingTop: '75px'}}>
                            <CircularProgress size={80} thickness={5} style={{verticalAlign: 'middle'}}/>
                        </div>}
                    </div>
                </TableCell>
            </TableRow>)
        });

        return this.props.personaList && this.props.personaList.length > 0
            ? <Table className={'persona-table' + (isPatient ? ' patient' : '')}>
                <TableHead className='persona-table-header' style={{backgroundColor: this.props.theme.p5}}>
                    <TableRow>
                        <TableCell> </TableCell>
                        <TableCell className={'name' + (isPractitioner ? ' pract' : '')} style={{color: this.props.theme.p6, fontWeight: 'bold', fontSize: '14px'}}>Name</TableCell>
                        {isPractitioner &&
                        <TableCell className='pract' style={{color: this.props.theme.p6, paddingLeft: '24px', fontWeight: 'bold', fontSize: '14px'}}>FHIR id</TableCell>}
                        {isPatient && <TableCell style={{color: this.props.theme.p6, fontWeight: 'bold', fontSize: '14px'}}>
                            Identifier
                        </TableCell>}
                        {isPatient && <TableCell style={{color: this.props.theme.p6, fontWeight: 'bold', fontSize: '14px', paddingLeft: isPatient ? '30px' : '24px'}}>
                            Age
                        </TableCell>}
                        {!isPractitioner &&
                        <TableCell className={!isPatient && !isPractitioner ? 'resource' : ''}
                                   style={{color: this.props.theme.p6, fontWeight: 'bold', fontSize: '14px', paddingLeft: isPatient || isPractitioner ? '34px' : '24px'}}>
                            {!isPatient && !isPractitioner ? 'FHIR Resource' : 'DOB'}
                        </TableCell>}
                        {!isPatient && !isPractitioner &&
                        <TableCell style={{color: this.props.theme.p6, fontWeight: 'bold', fontSize: '14px', paddingLeft: isPatient || isPractitioner ? '34px' : '24px'}}>
                            Login Info
                        </TableCell>}
                        {!this.props.modal && !isPractitioner && <TableCell className={isPatient ? 'actions-row' : !isPractitioner ? ' actions-row small' : ''}> </TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
            : null;
    };

    getFilteredList = () => {
        let list = this.props.personaList ? this.props.personaList : [];
        if (this.props.type !== TYPES.patient && this.state.searchCrit) {
            let criteria = Object.keys(this.state.searchCrit);
            criteria.map(crit => {
                list = list.filter(i => i[crit] === this.state.searchCrit[crit]);
            });
        }
        return list;
    };

    toggleMenuForItem = (e, itemIndex) => {
        this.setState({showMenuForItem: itemIndex});
    };

    deletePersona = (persona) => {
        if (persona && !this.state.personaToDelete) {
            this.setState({showConfirmModal: true, personaToDelete: persona});
        } else {
            this.props.type === TYPES.persona && this.props.deletePersona(this.state.personaToDelete);
            this.props.type !== TYPES.persona && this.props.deletePractitioner(this.state.personaToDelete.id);
            this.setState({showConfirmModal: false, personaToDelete: undefined});
        }
    };

    updateFavorite = (e, persona) => {
        e.stopPropagation();
        if (persona.meta.tag !== undefined) {
            if (persona.meta.tag[0].code === "favorite") {
                persona.meta.tag[0].code = "not-favorite"
            } else {
                persona.meta.tag[0].code = "favorite";
            }

        } else {
            persona.meta.tag = [{"code": "favorite"}]
        }

        let url = `${window.fhirClient.server.serviceUrl}/Patient/${persona.id}`;
        const config = {
            headers: {
                Authorization: 'Bearer ' + window.fhirClient.server.auth.token,
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: 'PUT',
            body: JSON.stringify(persona)
        };
    };

    openInDM = (e, persona) => {
        e.stopPropagation();
        this.props.doLaunch({
            "launchUri": `${this.props.patientDataManagerUrl}/launch.html`
        }, persona.id, undefined, true);
    };

    getName = (name) => {
        let strName = (name.family || name.family[0]) + ',';
        let i;
        if (name.given && name.given.length) {
            for (i = 0; i < name.given.length; i++) {
                strName += ' ' + name.given[i];
            }
        }
        return strName;
    };

    onFilter = (searchCrit) => {
        this.props.type === TYPES.patient && this.props.search(this.props.type, searchCrit);
        this.setState({searchCrit});
    };

    handleRowSelect = (row, event) => {
        event && event.stopPropagation();
        event && event.preventDefault();
        // row = this.props.modal ? row[0] : row[0] / 2;
        row = row[0] / 2;
        let list = this.getFilteredList();
        if (!this.props.modal && this.props.type === TYPES.patient) {
            let selection = getSelection();
            let node = selection.baseNode || selection.anchorNode;
            let parentNodeClass = node && node.parentNode && node.parentNode.classList && node.parentNode.classList.value;
            let actualClick = (parentNodeClass && parentNodeClass.indexOf('persona-info') >= 0 && selection.toString().length === 0) || !node || (node.classList && node.classList.contains('fa'));
            if (actualClick || event) {
                let selected = this.state.selected !== row ? row : undefined;
                selected !== undefined && this.props.patientDetailsFetchStarted();
                selected !== undefined && setTimeout(() => list[row] && this.props.fetchPatientDetails(list[row]), 500);
                this.setState({selected});
            }
        } else {
            this.props.click && this.props.click(list[row]);
        }
    };
}

const mapStateToProps = state => {
    let patientDataManagerUrl = state.config.xsettings.data.sandboxManager
        ? state.config.xsettings.data.sandboxManager.patientDataManager
        : '';
    return {
        patients: state.persona.patients,
        practitioners: state.persona.practitioners,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        practitionersPagination: state.persona.practitionersPagination,
        personasPagination: state.persona.personasPagination,
        fetchingDetails: state.patient.fetching,
        loading: state.persona.loading,
        loggedInUser: state.users.user,
        observationCount: state.patient.details.Observation || 0,
        encounterCount: state.patient.details.Encounter || 0,
        medicationRequestCount: state.patient.details.MedicationRequest || 0,
        medicationDispenseCount: state.patient.details.MedicationDispense || 0,
        medicationOrderCount: state.patient.details.MedicationOrder || 0,
        allergyCount: state.patient.details.AllergyIntolerance || 0,
        conditionCount: state.patient.details.Condition || 0,
        procedureCount: state.patient.details.Procedure || 0,
        diagnosticReportCount: state.patient.details.DiagnosticReport || 0,
        immunizationCount: state.patient.details.Immunization || 0,
        carePlanCount: state.patient.details.CarePlan || 0,
        careTeamCount: state.patient.details.CareTeam || 0,
        goalCount: state.patient.details.Goal || 0,
        patientDataManagerUrl
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({deletePractitioner, lookupPersonasStart, fetchPatientDetails, patientDetailsFetchStarted, doLaunch, deletePersona}, dispatch);

let PersonaListWithTheme = connect(mapStateToProps, mapDispatchToProps)(PersonaList);

PersonaListWithTheme.TYPES = TYPES;

export default PersonaListWithTheme;
