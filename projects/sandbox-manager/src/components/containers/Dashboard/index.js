import React, { Component } from 'react';
import AvailableSandboxes from './AvailableSandboxes';
import { Dialog, IconButton, Paper, RaisedButton } from 'material-ui';
import CreateSandbox from '../CreateSandbox';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { app_setScreen, fetchSandboxes, loadTerms, loadInvites, fetchUserNotifications, updateSandboxInvite } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './styles.less';
import Footer from "sandbox-manager-lib/components/Navigation/Footer";
import Page from 'sandbox-manager-lib/components/Page';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { NavigationCheck, NavigationClose } from 'material-ui/svg-icons';

class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            invitationToAccept: undefined,
            open: false,
            showAccept: false
        }
    }

    componentDidMount () {
        this.props.app_setScreen('dashboard');
        this.props.fetchSandboxes();
    }

    componentWillUpdate (nextProps) {
        let invitationToAccept = this.getInvitationToAccept();
        if (this.props.loading && !nextProps.loading && invitationToAccept) {
            this.setState({ showAccept: true, invitationToAccept });
        }
    }

    render () {
        let invite = this.state.showAccept && this.props.userInvites.find(i => i.id == this.state.invitationToAccept);
        let dialog = this.state.open
            ? <CreateSandbox onCancel={this.toggle} open={this.state.open}/>
            : this.state.showAccept && invite
                ? <Dialog open={this.state.showAccept} bodyClassName='invitation-dialog'
                          actions={[
                              <RaisedButton style={{marginRight: '10px'}} primary label='Accept' onClick={() => this.updateSandboxInvite(invite, 'ACCEPTED')} labelColor='#fff'/>,
                              <RaisedButton secondary label='Reject' onClick={() => this.updateSandboxInvite(invite, 'REJECTED')} labelColor='#fff'/>
                              ]}>
                    <div className='sandbox-invitation-wrapper'>
                        <Paper className='paper-card'>
                            <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleCancel}>
                                <i className="material-icons">close</i>
                            </IconButton>
                            <h3>
                                Sandbox Invitation
                            </h3>
                            <div className='paper-body'>
                                <div>
                                    <span className='bold'>{invite.invitedBy.name} / {invite.invitedBy.email}</span> has invited you to join <span className='bold'>{invite.sandbox.name}</span> HSPC Sandbox.
                                </div>
                            </div>
                        </Paper>
                        <div style={{ clear: 'both' }}/>
                    </div>
                </Dialog>
                : null;

        return <Page title='My Sandboxes' className='dashboard-wrapper'>
            {dialog}
            <div className='sandboxes-min-height'>
                <AvailableSandboxes onToggleModal={this.toggle}/>
            </div>
            <Footer loadTerms={this.props.loadTerms} terms={this.props.terms}/>
        </Page>;
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
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
        document.cookie = "hspc-invitation-id=;expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.hspconsortium.org; path=/";
        this.setState({ showAccept: false, invitationToAccept: undefined });
    };
}

const mapStateToProps = state => {
    return {
        terms: state.app.terms,
        loading: state.sandbox.loading || state.sandbox.fetchingLoginInfo,
        userInvites: state.sandbox.userInvites
    }
};
const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, fetchSandboxes, loadTerms, loadInvites, fetchUserNotifications, updateSandboxInvite }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Dashboard)));
