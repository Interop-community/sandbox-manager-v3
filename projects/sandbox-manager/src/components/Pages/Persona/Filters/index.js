import React, {Component, Fragment} from 'react';
import DownIcon from "@material-ui/icons/ArrowDropDown";
import Search from '@material-ui/icons/Search';
import Patient from "svg-react-loader?name=Patient!../../../../assets/icons/patient.svg";
import {Chip, IconButton, Menu, MenuItem, Popover, Slider, TextField, Tooltip, withStyles} from '@material-ui/core';
import moment from 'moment';

import './styles.less';
import PersonaListWithTheme from "../List";

let CustomSlider = withStyles({
    root: {
        color: '#3a8589',
        height: 3,
        padding: '13px 0',
    },
    thumb: {
        height: 27,
        width: 27,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -12,
        marginLeft: -13,
        boxShadow: '#ebebeb 0px 2px 2px',
        '&:focus,&:hover,&$active': {
            boxShadow: '#ccc 0px 2px 3px 1px',
        },
        '& .bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 3,
    },
    rail: {
        color: '#d8d8d8',
        opacity: 1,
        height: 3,
    },
})(Slider);

function ThumbComponent(props) {
    console.log(props);
    return <span {...props}>
                <span className="bar"/>
                <span className="bar"/>
                <span className="bar"/>
            </span>;
}

export default class Filters extends Component {

    timer = null;

    constructor(props) {
        super(props);

        this.state = {
            filters: {},
            maxAge: 100,
            minAge: 0,
            ageChanged: false
        }
    }

    render() {
        let isPatient = this.props.type === PersonaListWithTheme.TYPES.patient;
        let isPersona = this.props.type === PersonaListWithTheme.TYPES.persona;

        return <div className='filters'>
            {isPatient && this.getPatientFilters()}
            {isPersona && this.getPersonaFilters()}
        </div>
    }

    getPatientFilters = () => {
        let palette = this.props.theme;

        let genderActive = this.state.filters.gender;
        let genderTitle = genderActive ? this.state.filters.gender : 'Gender';
        let genderDeleteCallback = genderActive ? () => this.filter('gender') : undefined;

        let ageActive = this.state.filters.age;
        let ageTitle = ageActive ? this.state.filters.age : 'Age';
        let ageDeleteCallback = ageActive ? () => this.filter('age') : undefined;

        return [
            <div key={1}>
                <span ref='gender-filter'/>
                <Chip className={'chip' + (genderActive ? ' active' : '')} onClick={() => this.showFilter('gender')} onDelete={genderDeleteCallback}
                      label={<Fragment>
                          <span className='genderTitle'>{genderTitle}</span>
                          <span className='icon-wrapper'>
                            {!genderActive && <DownIcon style={{fill: palette.p3}}/>}
                          </span>
                      </Fragment>}/>
                {this.state.visibleFilter === 'gender' &&
                <Menu open={true} anchorEl={this.refs['gender-filter']} className='left-margin gender-filter-menu' onClose={() => this.showFilter()} classes={{paper: 'gender-filter'}}>
                    <MenuItem className='gender-filter-menu-item' onClick={() => this.filter('gender', 'male')}>
                        Male
                    </MenuItem>
                    <MenuItem className='gender-filter-menu-item' onClick={() => this.filter('gender', 'female')}>
                        Female
                    </MenuItem>
                </Menu>}
            </div>,
            <div key={2}>
                <span ref='age-filter'/>
                <Chip className={'chip' + (ageActive ? ' active' : '')} onClick={() => this.showFilter('age')} onDelete={ageDeleteCallback}
                      label={<Fragment>
                          <span className='genderTitle'>{ageTitle}</span>
                          <span className='icon-wrapper'>
                                {!ageActive && <DownIcon style={{color: palette.p3}}/>}
                          </span>
                      </Fragment>}/>
                {this.state.visibleFilter === 'age' &&
                <Popover open={true} anchorEl={this.refs['age-filter']} onClose={this.closeAgeFilter} className='left-margin'>
                    <div className='age-filter-wrapper'>
                        <div className='filter-title' style={{backgroundColor: palette.p10, color: palette.p5}}>
                            <h3>Age</h3>
                            <IconButton style={{color: palette.p5, width: '42px', height: '40px', position: 'absolute', right: '10px', top: '-3px'}} onClick={this.closeAgeFilter}>
                                <i className="material-icons" data-qa="modal-close-button">close</i>
                            </IconButton>
                        </div>
                        <div className='slider-wrapper'>
                            <CustomSlider valueLabelDisplay='auto' aria-label='slider' onChange={this.filterByAge} defaultValue={[this.state.minAge, this.state.maxAge]}/>
                        </div>
                    </div>
                </Popover>}
            </div>,
            <div key={3}>
                <Search style={{width: '30px', height: '30px', color: palette.p3, verticalAlign: 'middle'}}/>
                <TextField id='name-filter' placeholder='Search by name' onChange={e => this.delayFiltering('name', e.target.value)}/>
            </div>
        ]
    };

    getPersonaFilters = () => {
        let palette = this.props.theme;

        let typeActive = this.state.filters.resource;
        let typeTitle = typeActive ? this.state.filters.resource : 'Type';
        let typeDeleteCallback = typeActive ? () => this.filter('resource') : undefined;

        return [<div key={1}>
            <span ref='persona-type-filter'/>
            <Chip className={'chip' + (typeActive ? ' active' : '')} onClick={() => this.showFilter('resource')} onDelete={typeDeleteCallback}
                  label={<Fragment>
                      <span className='type-title'>{typeTitle}</span>
                      <span className='icon-wrapper'>{!typeActive && <DownIcon style={{color: palette.p3}}/>}</span>
                  </Fragment>}/>
            {this.state.visibleFilter === 'resource' &&
            <Menu className='persona-type-filter-menu left-margin' open={true} anchorEl={this.refs['persona-type-filter']} onClose={() => this.showFilter()} classes={{paper: 'type-filter'}}>
                <MenuItem className='persona-type-filter-menu-item' onClick={() => this.filter('resource', 'Patient')}>
                    <Patient style={{fill: this.props.theme.p2, position: 'relative', top: '-3px', left: '-4px'}}/> Patient
                </MenuItem>
                <MenuItem className='persona-type-filter-menu-item' onClick={() => this.filter('resource', 'Practitioner')}>
                    <i className='fa fa-user-md fa-lg' style={{color: this.props.theme.a1, position: 'relative', top: '-1px', left: '-4px', width: '24px', height: '24px'}}/> Practitioner
                </MenuItem>
            </Menu>}
        </div>]
    };

    closeAgeFilter = () => {
        this.state.ageChanged
            ? this.filter('age', this.state.minAge + ' - ' + this.state.maxAge)
            : this.showFilter();
    };

    filterByAge = (_, val) => {
        let state = {ageChanged: true};
        state.minAge = val[0];
        state.maxAge = val[1];
        this.setState(state)
    };

    delayFiltering = (filter, value) => {
        this.timer && clearTimeout(this.timer);
        !this.timer && this.props.lookupPersonasStart(true);
        this.timer = setTimeout(() => {
            this.filter(filter, value);
            this.timer = null;
        }, 500);
    };

    filter = (filter, value) => {
        let filters = Object.assign({}, this.state.filters);
        value ? filters[filter] = value : delete filters[filter];

        this.setState({filters});

        let transformedFilter = '';
        if (filters.age) {
            let ages = filters.age.split(' - ');
            transformedFilter = `birthdate=>${moment().subtract(ages[1], 'years').format('YYYY')}&birthdate=<${moment().subtract(ages[0], 'years').format('YYYY')}`;
        }
        if (filters.gender) {
            transformedFilter += (filters.age ? '&' : '');
            transformedFilter += `gender=${filters.gender}`;
        }
        if (filters.name) {
            transformedFilter += (transformedFilter.length > 0 ? '&' : '');
            transformedFilter += `name:contains=${filters.name}`;
        }
        if (filter === 'resource' && value) {
            transformedFilter = {resource: value};
        }

        this.props.onFilter && this.props.onFilter(transformedFilter);
        this.showFilter();
    };

    showFilter = (filterName) => {
        let state = {visibleFilter: filterName, ageChanged: false};
        if (filterName === 'age' && !this.state.filters.age) {
            state.minAge = 0;
            state.maxAge = 99;
        }
        this.setState(state);
    };
}
