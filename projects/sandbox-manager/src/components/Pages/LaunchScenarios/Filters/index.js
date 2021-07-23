import React, {Component} from 'react';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import {Chip, Menu, MenuItem} from '@material-ui/core';

import './styles.less';

export default class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        let deleteCallbackIdFilter = this.props.appliedIdFilter ? () => this.filter() : undefined;
        let deleteCallbackTypeFilter = this.props.appliedTypeFilter ? () => this.filterByType() : undefined;
        let theme = this.props.theme;
        let title = this.props.appliedIdFilter
            ? this.props.apps.find(a => a.clientId === this.props.appliedIdFilter).clientName
            : 'App';
        let typeFilterTitle = this.props.appliedTypeFilter ? this.props.appliedTypeFilter : 'Type';

        return <div className='filters'>
            <div>
                <span ref='app-filter'/>
                <Chip className='chip' onClick={() => this.showFilter('app-filter')} onDelete={deleteCallbackIdFilter} clickable
                      color={deleteCallbackIdFilter ? 'primary' : undefined} deleteIcon={!deleteCallbackIdFilter ? <DownIcon style={{fill: theme.p6}}/> : undefined}
                      label={<span>{title}<span className='icon-wrapper'>{!deleteCallbackIdFilter && <DownIcon style={{fill: theme.p3}}/>}</span></span>}/>
                {this.state.visibleFilter === 'app-filter' &&
                <Menu className='app-filter-menu margin-left' open={true} anchorEl={this.refs['app-filter']} onClose={() => this.showFilter()}>
                    {this.props.apps.map((app, i) =>
                        <MenuItem className='app-filter-menu-item' key={i} onClick={() => this.filter(app.clientId)}
                                  style={this.props.appliedIdFilter === app.clientId ? {backgroundColor: theme.p5} : undefined}>
                            {app.clientName}
                        </MenuItem>
                    )}
                </Menu>}
            </div>
            <div>
                <span ref='type-filter'/>
                <Chip className='chip' onClick={() => this.showFilter('type-filter')} onDelete={deleteCallbackTypeFilter} clickable
                      color={deleteCallbackTypeFilter ? 'primary' : undefined} deleteIcon={!deleteCallbackTypeFilter ? <DownIcon color={theme.p3}/> : undefined}
                      label={<span>{typeFilterTitle}<span className='icon-wrapper'>{!deleteCallbackTypeFilter && <DownIcon style={{fill: theme.p3}}/>}</span></span>}/>
                {this.state.visibleFilter === 'type-filter' &&
                <Menu className='left-margin type-filter-menu' width='200px' open={true} anchorEl={this.refs['type-filter']} onClose={() => this.showFilter()}>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('Patient')}>
                        Patient
                    </MenuItem>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('Practitioner')}>
                        Practitioner
                    </MenuItem>
                    <MenuItem className='type-filter-menu-item' onClick={() => this.filterByType('CDS Service')}>
                        CDS Service
                    </MenuItem>
                </Menu>}
            </div>
        </div>
    }

    filter = (id) => {
        this.props.onFilter && this.props.onFilter('appIdFilter', id);
        this.showFilter();
    };

    filterByType = (type) => {
        this.props.onFilter && this.props.onFilter('typeFilter', type);
        this.showFilter();
    };

    showFilter = (filterName) => {
        this.setState({visibleFilter: filterName});
    };
}
