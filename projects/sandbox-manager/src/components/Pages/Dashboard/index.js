import React, {Component} from 'react';
import {Dialog, IconButton, Paper, Button, DialogActions} from '@material-ui/core';
import {withTheme} from '@material-ui/styles';
import {app_setScreen, fetchSandboxes, loadTerms, loadInvites, fetchUserNotifications, updateSandboxInvite} from '../../../redux/action-creators';
import AvailableSandboxes from './AvailableSandboxes';
import CreateSandbox from '../CreateSandbox';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Footer from "../../UI/Navigation/Footer";
import Page from '../../UI/Page';

import './styles.less';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invitationToAccept: undefined,
            open: false,
            showAccept: false
        }
    }

    componentDidMount() {
        this.props.app_setScreen('dashboard');
        this.props.fetchSandboxes();
    }

    componentWillUpdate(nextProps) {
        let invitationToAccept = this.getInvitationToAccept();
        if (this.props.loading && !nextProps.loading && invitationToAccept) {
            this.setState({showAccept: true, invitationToAccept});
        }
    }

    render() {
        let invite = this.state.showAccept && this.props.userInvites.find(i => i.id == this.state.invitationToAccept);
        let dialog = this.state.open
            ? <CreateSandbox onCancel={this.toggle} open={this.state.open}/>
            : this.state.showAccept && invite
                ? <Dialog open={this.state.showAccept}>
                    <div className='sandbox-invitation-wrapper'>
                        <Paper className='paper-card'>
                            <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.handleCancel}>
                                <i className="material-icons">close</i>
                            </IconButton>
                            <h3>
                                Sandbox Invitation
                            </h3>
                            <div className='paper-body-invitation'>
                                <div>
                                    <span className='bold'>{invite.invitedBy.name} / {invite.invitedBy.email}</span> has invited you to join <span className='bold'>{invite.sandbox.name}</span> Sandbox.
                                </div>
                            </div>
                        </Paper>
                        <div style={{clear: 'both'}}/>
                    </div>
                    <DialogActions>
                        <Button variant='contained' style={{marginRight: '10px'}} color='primary' onClick={() => this.updateSandboxInvite(invite, 'ACCEPTED')}>
                            Accept
                        </Button>
                        <Button variant='contained' color='secondary' onClick={() => this.updateSandboxInvite(invite, 'REJECTED')}>
                            Reject
                        </Button>
                    </DialogActions>
                </Dialog>
                : null;

        return <Page title='My Sandboxes' className='dashboard-wrapper'>
            {dialog}
            <div className='sandboxes-min-height' data-qa='dashboard-page'>
                <AvailableSandboxes onToggleModal={this.toggle}/>
            </div>
            {/*<Footer loadTerms={this.props.loadTerms} terms={this.props.terms} user={this.props.user}/>*/}
        </Page>;
    }

    toggle = () => {
        this.setState({open: !this.state.open});
    };

    getInvitationToAccept = () => {
        let cookie = false;
        if (document.cookie.indexOf('hspc-invitation-id') >= 0) {
            cookie = document.cookie.split(';').find(i => i.indexOf('hspc-invitation-id=') >= 0);
            if (cookie) {
                return cookie.split('hspc-invitation-id=')[1];
            }
        }
        return cookie;
    };

    updateSandboxInvite = (invite, type) => {
        this.props.updateSandboxInvite(invite, type);
        this.handleCancel();
    };

    handleCancel = () => {
        let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        if (isIE11) {
            document.cookie = "hspc-invitation-id=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.interop.community; path=/";
        } else {
            document.cookie = "hspc-invitation-id=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.interop.community; path=/";
        }
        this.setState({showAccept: false, invitationToAccept: undefined});
    };
}

const mapStateToProps = state => {
    return {
        terms: state.app.terms,
        loading: state.sandbox.loading || state.sandbox.fetchingLoginInfo,
        userInvites: state.sandbox.userInvites,
        user: state.users.user
    }
};
const mapDispatchToProps = dispatch => bindActionCreators({app_setScreen, fetchSandboxes, loadTerms, loadInvites, fetchUserNotifications, updateSandboxInvite}, dispatch);

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Dashboard)));
