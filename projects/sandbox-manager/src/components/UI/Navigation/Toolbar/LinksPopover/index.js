import React, { Component } from 'react';
import { Popover, Menu, MenuItem } from 'material-ui';
import './styles.less';

export default class LinksPopover extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showLinksDropdown: false,
            anchorEl: undefined
        }
    }

    shouldComponentUpdate (_n, nextState) {
        return nextState.showLinksDropdown !== this.state.showLinksDropdown;
    }

    render () {
        return <div className='links-popover-wrapper'>
            <div>
                <a><span /></a>
            </div>
            <div className='left'><a onClick={this.handleLinksDropdown}><i className='fa fa-th fa-lg' /></a></div>
            <Popover open={this.state.showLinksDropdown} anchorEl={this.state.anchorEl} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                     targetOrigin={{ horizontal: 'left', vertical: 'top' }} onClose={this.handleLinksDropdown}
                     className='sandbox-menu-item left-margin'>
                <Menu className='links-menu'>
                    <MenuItem className='links-menu-item image static' onClick={() => this.openLink('http://interop.community')}
                              primaryText={<span><img src={`${window.location.origin}\\img\\hspc-new-logo-md.png`} />
                              <div className='label'>Consortium</div></span>} />
                    <MenuItem className='links-menu-item image static' onClick={() => this.openLink('http://developers.interop.community')}
                              primaryText={<span><img className='small' src={`${window.location.origin}\\img\\hspc-developers-icon.png`} />
                              <div className='label'>Developers</div></span>} />
                </Menu>
            </Popover>
        </div>;
    };

    handleLinksDropdown = (event) => {
        this.setState({
            showLinksDropdown: !this.state.showLinksDropdown,
            anchorEl: event.currentTarget
        });
    };

    openLink = (url) => {
        window.open(url, '_blank');
    };
}
