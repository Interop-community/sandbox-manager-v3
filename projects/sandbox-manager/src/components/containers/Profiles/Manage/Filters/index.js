import React, { Component } from 'react';
import DownIcon from "material-ui/svg-icons/navigation/arrow-drop-down";
import { Chip, IconButton, Menu, MenuItem, Popover, TextField } from 'material-ui';
import { ContentSort } from 'material-ui/svg-icons';

import './styles.less';

export default class Filters extends Component {

    constructor (props) {
        super(props);

        this.state = {}
    }

    render () {
        let deleteCallbackTypeFilter = this.props.appliedTypeFilter ? () => this.filterByType() : undefined;
        let palette = this.props.muiTheme.palette;
        let typeFilterTitle = this.props.appliedTypeFilter ? this.props.appliedTypeFilter : 'Type';
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div className='profiles-filters'>
            <IconButton onClick={() => this.setState({ desc: !this.state.desc })} className='sort-button'>
                <ContentSort className={!this.state.desc ? 'rev' : ''} color={palette.primary3Color}/>
            </IconButton>
            <div>
                <TextField id='profile-filter' hintText='By name' onChange={(_, value) => this.filter(value)}
                           underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            </div>
            <div>
                <span ref='type-filter'/>
                <Chip className={'chip' + (deleteCallbackTypeFilter ? ' active' : '')} onClick={() => this.showFilter('type-filter')} onRequestDelete={deleteCallbackTypeFilter}
                      backgroundColor={deleteCallbackTypeFilter ? palette.primary2Color : undefined} labelColor={deleteCallbackTypeFilter ? palette.alternateTextColor : undefined}>
                    <span className='title'>{typeFilterTitle}</span>
                    <span className='icon-wrapper'>
                    {!deleteCallbackTypeFilter && <DownIcon color={palette.primary3Color}/>}
                </span>
                </Chip>
                {this.state.visibleFilter === 'type-filter' &&
                <Popover open={true} anchorEl={this.refs['type-filter']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} onRequestClose={() => this.showFilter()} className='left-margin'>
                    <Menu className='type-filter-menu' width='200px' desktop autoWidth={false}>
                            <MenuItem className='type-filter-menu-item' primaryText={'Patient'}  onClick={() => this.filterByType('Patient')}/>
                            <MenuItem className='type-filter-menu-item' primaryText={'Practitioner'}  onClick={() => this.filterByType('Practitioner')}/>
                            <MenuItem className='type-filter-menu-item' primaryText={'CDS Hook'}  onClick={() => this.filterByType('Hook')}/>
                    </Menu>
                </Popover>}
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
        this.setState({ visibleFilter: filterName });
    };
}
