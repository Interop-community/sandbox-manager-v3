import React, { Component } from 'react';
import { Badge, CircularProgress, FloatingActionButton, IconButton, Menu, MenuItem, Popover, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import DownIcon from "material-ui/svg-icons/hardware/keyboard-arrow-down";
import ContentAdd from 'material-ui/svg-icons/content/add';
import LaunchIcon from "material-ui/svg-icons/action/launch";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import StarIcon from "material-ui/svg-icons/toggle/star-border";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import RightIcon from "material-ui/svg-icons/hardware/keyboard-arrow-right";
import LeftIcon from "material-ui/svg-icons/hardware/keyboard-arrow-left";
import FilterList from "material-ui/svg-icons/content/filter-list";
import Filters from '../Filters';
import DohMessage from "sandbox-manager-lib/components/DohMessage";
import ConfirmModal from "sandbox-manager-lib/components/ConfirmModal";
import Patient from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/patient.svg";
import Page from 'sandbox-manager-lib/components/Page';
import { BarChart } from 'react-chartkick';
import CreatePersona from "../Create";
import moment from 'moment';

import './styles.less';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { deletePractitioner, lookupPersonasStart, doLaunch, fetchPatientDetails, patientDetailsFetchStarted, deletePersona } from "../../../../redux/action-creators";
import { getAge } from "sandbox-manager-lib/utils";

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
const CHART = <BarChart data={chartData} library={{ yAxis: { allowDecimals: false }, plotOptions: { series: { dataLabels: { enabled: true } } } }}/>;

class PersonaList extends Component {

    constructor (props) {
        super(props);

        let searchCrit = props.typeFilter ? props.typeFilter : '';

        this.state = {
            searchCrit,
            creationType: '',
            showConfirmModal: false,
            showCreateModal: false
        };
    }

    componentWillReceiveProps (nextProps) {
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

    render () {
        let isPatient = this.props.type === TYPES.patient;
        let isPractitioner = this.props.type === TYPES.practitioner;

        let defaultTitle = isPatient ? 'Patients' : isPractitioner ? 'Practitioners' : 'Personas';
        let title = this.props.title ? this.props.title : defaultTitle;

        let personaList = this.getPersonaList(isPatient, isPractitioner);

        return <Page noTitle={this.props.noTitle} title={title} titleLeft={this.props.titleLeft} close={this.props.close} scrollContent={this.props.scrollContent}>
            <ConfirmModal red open={this.state.showConfirmModal} confirmLabel='Delete' onConfirm={this.deletePersona} title='Confirm'
                          onCancel={() => this.setState({ showConfirmModal: false, personaToDelete: undefined })}>
                <p>
                    Are you sure you want to delete this {this.props.type.toLowerCase()}?
                </p>
            </ConfirmModal>
            {!this.props.modal && <div className='create-resource-button'>
                <CreatePersona key={createKey} open={this.state.showCreateModal} create={this.props.create} type={this.props.type} theme={this.props.theme} close={() => this.toggleCreateModal()}
                               personaType={this.state.creationType} personas={this.props[this.state.creationType.toLowerCase() + 's']} search={this.props.search}/>
            </div>}
            <div className='personas-wrapper'>
                {!this.props.noFilter && <div className='filter-wrapper'>
                    <FilterList color={this.props.theme.primary3Color}/>
                    <Filters {...this.props} apps={this.props.apps} onFilter={this.onFilter} appliedTypeFilter={this.state.typeFilter}/>
                    <div className='actions'>
                        {personaList && this.props.pagination && this.getPagination(false, isPractitioner)}
                        {(isPractitioner || isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal()}>
                            <ContentAdd/>
                        </FloatingActionButton>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal(TYPES.patient)} style={{ marginRight: '16px' }}>
                            <Patient style={{width: '26px', fill: this.props.theme.primary5Color }}/>
                        </FloatingActionButton>}
                        {(!isPractitioner && !isPatient) && !this.props.modal && <FloatingActionButton onClick={() => this.toggleCreateModal(TYPES.practitioner)}>
                            <i className='fa fa-user-md fa-lg'/>
                        </FloatingActionButton>}
                    </div>
                </div>}
                <div style={{ position: this.props.modal ? 'relative' : 'absolute', width: '100%' }}>
                    {personaList && !this.props.loading
                        ? <div className={'persona-table-wrapper' + (this.props.modal ? ' modal' : '')}>
                            {personaList}
                        </div>
                        : this.props.loading
                            ? <div className='loader-wrapper'>
                                <CircularProgress size={80} thickness={5}/>
                            </div>
                            : this.state.searchCrit
                                ? <div className='centered'>No results found</div>
                                : <DohMessage message={`No ${defaultTitle.toLowerCase()} in sandbox.`}/>}
                    {personaList && this.props.pagination && this.getPagination(true)}
                </div>
            </div>
        </Page>
    }

    toggleCreateModal = (type) => {
        createKey++;
        type && this.props.fetchPersonas(type);
        this.setState({ showCreateModal: !this.state.showCreateModal, creationType: type || '' });
    };

    getPersonaList = (isPatient, isPractitioner) => {
        let itemStyles = { backgroundColor: this.props.theme.canvasColor };

        let rows = [];
        let list = this.getFilteredList();
        list.map((persona, i) => {
            let style = this.props.theme ? { color: persona.gender === 'male' ? this.props.theme.primary2Color : this.props.theme.accent1Color, WebkitTextStroke: '1px', fontSize: '24px' } : undefined;
            style.position = 'relative';
            let badge = isPatient
                ? <Badge badgeStyle={style} badgeContent={persona.gender === 'male' ? <i className="fa fa-mars"/> : <i className="fa fa-venus"/>} style={{ padding: 0 }}/>
                : isPractitioner
                    ? <Badge style={{ padding: '0' }} badgeStyle={{ color: this.props.theme.primary1Color, position: 'relative' }} badgeContent={<i className="fa fa-user-md fa-2x"/>}/>
                    : persona.resource === 'Practitioner'
                        ? <Badge style={{ padding: '0' }} badgeStyle={{ color: this.props.theme.accent1Color, position: 'relative' }} badgeContent={<i className="fa fa-user-md fa-2x"/>}/>
                        : <Badge style={{ padding: '0' }} badgeStyle={{ width: '28px', height: '28px', position: 'relative', left: '-2px' }}
                                 badgeContent={<Patient style={{ fill: this.props.theme.primary2Color, width: '28px', height: '28px' }}/>}/>;
            let age = getAge(persona.birthDate);
            let isSelected = i === this.state.selected;
            let contentStyles = isSelected ? { borderBottom: '1px solid ' + this.props.theme.primary7Color } : {};
            let showMenuForItem = this.state.showMenuForItem === i;
            let patientRightIconStyle = { padding: 0, width: '40px', height: '40px' };

            rows.push(<TableRow key={persona.id} style={itemStyles} className={'persona-list-item' + (isSelected ? ' active' : '')} selected={false}>
                <TableRowColumn className='left-icon-wrapper'>
                    {badge}
                </TableRowColumn>
                <TableRowColumn className='persona-info'>
                    {persona.fhirName || this.getName(persona.name[0] || persona.name)}
                </TableRowColumn>
                {!isPatient && !isPractitioner && <TableRowColumn className='persona-info'>
                    {persona.personaUserId}
                </TableRowColumn>}
                {isPatient && !isPractitioner && <TableRowColumn className='persona-info'>
                    {persona.id}
                </TableRowColumn>}
                {!isPractitioner && <TableRowColumn className='persona-info'>
                    {!isPatient && persona.password}
                    {isPatient && age}
                </TableRowColumn>}
                {!isPractitioner && <TableRowColumn className='persona-info'>
                    {!isPatient && !isPractitioner && persona.resource + '/' + persona.fhirId}
                    {isPatient && moment(persona.birthDate).format('DD MMM YYYY')}
                </TableRowColumn>}
                {isPractitioner && <TableRowColumn className='persona-info'>{persona.id}</TableRowColumn>}
                {isPractitioner && <TableRowColumn className='persona-info'>
                    {persona.practitionerRole && persona.practitionerRole[0].role && persona.practitionerRole[0].role.coding[0].display}
                </TableRowColumn>}
                {isPractitioner && <TableRowColumn className='persona-info'>
                    {persona.practitionerRole && persona.practitionerRole[0].specialty && persona.practitionerRole[0].specialty[0].coding[0].display}
                </TableRowColumn>}
                {!this.props.modal && !isPractitioner && <TableRowColumn className={isPatient ? 'actions-row' : ' '}>
                    {!isPatient && <IconButton onClick={e => this.toggleMenuForItem(e, i)}>
                        <span className='anchor' ref={'anchor' + i}/>
                        <MoreIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                    {isPatient && <IconButton style={patientRightIconStyle}>
                        <span/>
                        <StarIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                    {isPatient && <IconButton style={patientRightIconStyle} onClick={e => this.openInDM(e, persona)}>
                        <span/>
                        <LaunchIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                    {isPatient && <IconButton onClick={e => this.toggleMenuForItem(e, i)} style={patientRightIconStyle}>
                        <span/>
                        <DownIcon color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>}
                    {!isPatient && showMenuForItem &&
                    <Popover open={showMenuForItem} anchorEl={this.refs['anchor' + i]} anchorOrigin={{ horizontal: 'left', vertical: 'top' }} style={{ backgroundColor: this.props.theme.canvasColor }}
                             targetOrigin={{ horizontal: 'right', vertical: 'top' }} onRequestClose={this.toggleMenuForItem}>
                        <Menu desktop autoWidth={false} width='100px'>
                            {isPatient && <MenuItem className='scenario-menu-item' primaryText='Edit' leftIcon={<LaunchIcon/>} onClick={e => this.openInDM(e, persona)}/>}
                            <MenuItem className='scenario-menu-item' primaryText='Delete' leftIcon={<DeleteIcon/>} onClick={() => {
                                this.toggleMenuForItem();
                                this.deletePersona(persona)
                            }}/>
                        </Menu>
                    </Popover>}
                </TableRowColumn>}
            </TableRow>);
            !this.props.modal && rows.push(<TableRow key={persona.id + '_content'} className={'content' + (isSelected ? ' active' : '')} style={contentStyles}>
                <TableRowColumn colSpan='6'>
                    <div className='chart'>
                        {isSelected && CHART}
                    </div>
                </TableRowColumn>
            </TableRow>)
        });

        return this.props.personaList && this.props.personaList.length > 0
            ? <Table className={'persona-table' + (isPatient ? ' patient' : '')} onRowSelection={this.handleRowSelect}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false} className='persona-table-header' style={{ backgroundColor: this.props.theme.primary5Color }}>
                    <TableRow>
                        <TableHeaderColumn> </TableHeaderColumn>
                        <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>Name</TableHeaderColumn>
                        {isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>FHIR id</TableHeaderColumn>}
                        {isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>Speciality</TableHeaderColumn>}
                        {isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>Role</TableHeaderColumn>}
                        {!isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>
                            {isPatient ? 'Identifier' : 'User Name'}
                        </TableHeaderColumn>}
                        {!isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>
                            {isPatient ? 'Age' : 'Password'}
                        </TableHeaderColumn>}
                        {!isPractitioner && <TableHeaderColumn style={{ color: this.props.theme.primary6Color, fontWeight: 'bold', fontSize: '14px' }}>
                            {!isPatient && !isPractitioner ? 'FHIR Resource' : 'DOB'}
                        </TableHeaderColumn>}
                        {!this.props.modal && <TableHeaderColumn className={isPatient ? 'actions-row' : ' '}> </TableHeaderColumn>}
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} showRowHover={this.props.modal}>
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
        this.setState({ showMenuForItem: itemIndex });
    };

    deletePersona = (persona) => {
        if (persona && !this.state.personaToDelete) {
            this.setState({ showConfirmModal: true, personaToDelete: persona });
        } else {
            this.props.type === TYPES.persona && this.props.deletePersona(this.state.personaToDelete);
            this.props.type !== TYPES.persona && this.props.deletePractitioner(this.state.personaToDelete.id);
            this.setState({ showConfirmModal: false, personaToDelete: undefined });
        }
    };

    openInDM = (e, persona) => {
        e.stopPropagation();
        this.props.doLaunch({
            "authClient": {
                "clientName": "Patient Data Manager",
                "clientId": "patient_data_manager",
                "redirectUri": "https://patient-data-manager.hspconsortium.org/index.html"
            },
            "appUri": "https://patient-data-manager.hspconsortium.org/",
            "launchUri": "https://patient-data-manager.hspconsortium.org/launch.html",
            "logoUri": "https://content.hspconsortium.org/images/hspc-patient-data-manager/logo/pdm.png",
            "briefDescription": "The HSPC Patient Data Manager app is a SMART on FHIR application that is used for managing the data of a single patient."
        }, persona);
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
        this.props.type !== TYPES.patient && this.setState({ searchCrit });
    };

    getPagination = (isBottom, isPractitioner) => {
        let self = this.props.pagination.link.find(i => i.relation === 'self');
        let currentSkip = self.url.indexOf('_getpagesoffset=') >= 0 ? parseInt(self.url.split('_getpagesoffset=')[1].split('&')[0]) : 0;
        let start = currentSkip + 1;
        let end = start + this.props.personaList.length - 1;

        return this.props.pagination && <div className={'persona-list-pagination-wrapper' + (isBottom ? ' bottom' : '') + (isPractitioner ? ' pract' : '')}>
            <div>
                <IconButton onClick={() => this.paginate(this.props.prev)} disabled={start === 1 || this.props.loading}>
                    <LeftIcon/>
                </IconButton>
            </div>
            <div>
                <span>Showing {start} to {end} of {this.props.pagination.total}</span>
            </div>
            <div>
                <IconButton onClick={() => this.paginate(this.props.next)} disabled={end + 1 >= this.props.pagination.total || this.props.loading}>
                    <RightIcon/>
                </IconButton>
            </div>
        </div>
    };

    paginate = toCall => {
        toCall && toCall();
        toCall && this.setState({ selected: undefined });
    };

    handleRowSelect = (row) => {
        row = this.props.modal ? row : row[0] / 2;
        let list = this.getFilteredList();
        if (!this.props.modal && this.props.type === TYPES.patient) {
            let selection = getSelection();
            let parentNodeClass = selection.baseNode && selection.baseNode.parentNode && selection.baseNode.parentNode.classList && selection.baseNode.parentNode.classList.value;
            let actualClick = parentNodeClass === 'persona-info' && selection.toString().length === 0;
            if (actualClick) {
                let selected = this.state.selected !== row ? row : undefined;
                selected !== undefined && this.props.patientDetailsFetchStarted();
                selected !== undefined && setTimeout(() => this.props.fetchPatientDetails(list[row]), 500);
                this.setState({ selected });
            }
        } else {
            this.props.click && this.props.click(list[row]);
        }
    };
}


const mapStateToProps = state => {
    return {
        patients: state.persona.patients,
        practitioners: state.persona.practitioners,
        personas: state.persona.personas,
        patientsPagination: state.persona.patientsPagination,
        practitionersPagination: state.persona.practitionersPagination,
        personasPagination: state.persona.personasPagination,
        fetchingDetails: state.patient.fetching,
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
        goalCount: state.patient.details.Goal || 0
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ deletePractitioner, lookupPersonasStart, fetchPatientDetails, patientDetailsFetchStarted, doLaunch, deletePersona }, dispatch);

let PersonaListWithTheme = connect(mapStateToProps, mapDispatchToProps)(PersonaList);

PersonaListWithTheme.TYPES = TYPES;

export default PersonaListWithTheme;