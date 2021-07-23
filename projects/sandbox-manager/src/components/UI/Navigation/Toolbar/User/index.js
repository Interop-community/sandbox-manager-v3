import React, {Component} from 'react';
import {Divider, Menu, MenuItem} from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import strings from '../../../../../assets/strings';
import './styles.less';

export default class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            anchorEl: undefined,
            showUserDropdown: false
        }
    }

    shouldComponentUpdate(_n, nextState) {
        let user = JSON.parse(localStorage.getItem('oauthUser'));
        if (user != null) {
            if (!this.state.user || this.state.user.name !== user.name) {
                this.setState({user: user});
                return true;
            }
        }
        return nextState.showUserDropdown !== this.state.showUserDropdown;
    }

    render() {
        let onClick = this.state.user ? this.handleUSerDropdown : this.handleSignIn;

        return <div className='user-wrapper'>
            <div className='right'>
                <span className='anchor' ref='anchor'/>
                <a data-qa='header-user-button' className={this.state.showUserDropdown ? 'active' : ''} onClick={onClick}><AccountIcon style={{fill: this.props.theme.p9}}/></a>
            </div>
            {this.state.showUserDropdown &&
            <div className='sandbox-menu-item left-margin'>
                <Menu className='user-menu' data-qa='user-menu-popover' open onClose={this.handleUSerDropdown} anchorEl={this.state.anchorEl}>
                    <MenuItem disabled className='user-menu-item static'>
                        {this.state.user.name}
                    </MenuItem>
                    <MenuItem disabled className='user-menu-item static'>
                        {this.state.user.email}
                    </MenuItem>
                    <Divider/>
                    <MenuItem className='user-menu-item active' onClick={() => window.open(this.props.settings.sandboxManager.userManagementUrl, '_blank')}>
                        {<span><i className='fa fa-gear fa-lg'/>{strings.settingsLabel}</span>}
                    </MenuItem>
                    <MenuItem className='user-menu-item active' onClick={this.props.signOut} data-qa='sign-out-button'>
                        {<span><i className='fa fa-sign-out'/>{strings.signOutLabel}</span>}
                    </MenuItem>
                </Menu>
            </div>}
        </div>;
    };

    handleSignIn = () => {
        let url = this.props.location;
        this.props.onAuthInit(url);
    };

    handleUSerDropdown = (e) => {
        this.setState({
            showUserDropdown: !this.state.showUserDropdown,
            anchorEl: e.currentTarget
        });
    };
}
