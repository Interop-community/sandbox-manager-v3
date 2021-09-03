import React, {Component} from 'react';
import {
    Dialog, Button, IconButton, CircularProgress, TableCell, TableRow, TableBody, Table, TableHead, FormControl, Menu, MenuItem, Fab, TextField, Snackbar, withTheme, DialogActions, InputLabel, Input,
    FormHelperText
} from '@material-ui/core';
import MoreIcon from "@material-ui/icons/MoreVert";
import Redo from '@material-ui/icons/Redo';
import ContentAdd from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {inviteNewUser, removeInvitation, fetchSandboxInvites, removeUser, toggleUserAdminRights} from '../../../redux/action-creators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import './styles.less';
import {withRouter} from "react-router";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userToRemove: '',
            email: '',
            action: '',
            open: false,
            usersToImport: '',
            importUsersModal: false
        };
    }

    render() {
        let palette = this.props.theme;
        let titleStyle = {
            backgroundColor: palette.p10,
            color: palette.p7
        };
        let {currentIsAdmin, rows} = this.props.sandbox && this.getRows();

        return <div className='users-wrapper'>
            <div>
                <div className='invitation-buttons-wrapper'>
                    <Button variant='contained' color='secondary' onClick={this.showInvitationsModal} disabled={!currentIsAdmin}>
                        MANAGE INVITES
                    </Button>
                    <Button variant='contained' color='primary' onClick={this.exportUsers} disabled={!currentIsAdmin}>
                        EXPORT USERS
                    </Button>
                    <Button variant='contained' color='secondary' onClick={this.toggleImportUsersModal} disabled={!currentIsAdmin}>
                        IMPORT USERS
                    </Button>
                </div>
                {this.state.inviteModal &&
                <Dialog open={this.state.inviteModal} onClose={this.handleClose} classes={{paper: 'invitations-modal', root: 'invite-dialog-actions-wrapper'}}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITE</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invite-modal'>
                        <FormControl error={!!this.state.emailError} fullWidth>
                            <InputLabel htmlFor="newEmailAddress">Email Address of New User</InputLabel>
                            <Input id="newEmailAddress" value={this.state.email} onChange={e => this.handleInviteEmailChange(e.target.value)} onKeyPress={this.submitMaybe} fullWidth/>
                            {!!this.state.emailError && <FormHelperText id="component-error-text">{this.state.emailError}</FormHelperText>}
                        </FormControl>
                    </div>
                    <DialogActions>
                        <Button variant='contained' color='primary' onClick={this.handleSendInvite}>Send</Button>
                    </DialogActions>
                </Dialog>}
                {this.state.invitationsModal && <Dialog open={this.state.invitationsModal} onClose={this.handleClose} classes={{root: 'invites-dialog-actions-wrapper', paper: 'invitations-modal'}}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>INVITES</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-invites-modal'>
                        <Table className='sandbox-invitations-list'>
                            <TableHead className='invitations-table-header' style={{backgroundColor: this.props.theme.p7}}>
                                <TableRow>
                                    <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>Email</TableCell>
                                    <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>Date Sent</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.invitations && this.getInvitations()}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogActions>
                        <Fab color='primary' onClick={this.toggleCreateModal}><ContentAdd/></Fab>
                    </DialogActions>
                </Dialog>}
                {this.state.userToRemove && <Dialog open={this.state.open} onClose={this.handleClose}>
                    <div className='screen-title invitations' style={titleStyle}>
                        <h1 style={titleStyle}>Remove User from Sandbox</h1>
                        <IconButton className="close-button" onClick={this.handleClose}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-delete-modal'>
                        Are you sure you want to remove {(this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.state.userToRemove) || {user: {email: '"not found"'}}).user.email}?
                    </div>
                    <DialogActions classes={{root: 'user-remove-dialog-actions-wrapper'}}>
                        <Button variant='contained' style={{color: this.props.theme.p5, backgroundColor: this.props.theme.p4}} onClick={this.deleteSandboxUserHandler}>
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>}
                {this.state.importUsersModal &&
                <Dialog open={this.state.importUsersModal} onClose={this.toggleImportUsersModal} classes={{paper: 'import-users-dialog'}}>
                    <div className='screen-title imports' style={titleStyle}>
                        <h1 style={titleStyle}>Import users</h1>
                        <IconButton className="close-button" onClick={this.toggleImportUsersModal}>
                            <i className="material-icons" data-qa="modal-close-button">close</i>
                        </IconButton>
                    </div>
                    <div className='screen-content-import-modal'>
                        <input type='file' id='file' ref='file' style={{display: 'none'}} onChange={this.readFile}/>
                        <TextField multiline fullWidth label='Enter comma separated emails' onChange={e => this.setState({usersToImport: e.target.value})}
                                   value={this.state.usersToImport} onKeyUp={this.importMaybe} id='emailList'/>
                    </div>
                    <DialogActions classes={{root: 'user-remove-dialog-actions-wrapper'}}>
                        <Button variant='contained' style={{marginRight: '10px'}} onClick={this.importUsers} color='primary'>
                            Import
                        </Button>
                        <Button variant='contained' color='primary' onClick={() => this.refs.file.click()}>
                            Load from file (csv)
                        </Button>
                    </DialogActions>
                </Dialog>}
                {!this.props.updatingUser && <Table className='sandbox-users-list'>
                    <TableHead className='users-table-header' style={{backgroundColor: this.props.theme.p7}}>
                        <TableRow>
                            <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Name</TableCell>
                            <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Identifier</TableCell>
                            <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Role</TableCell>
                            <TableCell style={{color: 'black', fontWeight: 'bold', fontSize: '14px'}}>Signed In</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.sandbox && rows}
                    </TableBody>
                </Table>}
                {this.props.updatingUser && <div className='loader-wrapper'>
                    <p>
                        Updating user
                    </p>
                    <CircularProgress size={80} thickness={5}/>
                </div>}
            </div>
            <Snackbar open={this.props.inviting} message={this.state.action === 'sending' ? 'Sending invitation to user...' : 'Deleting user invitation...'} autoHideDuration={30000}/>
        </div>;
    }

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.handleSendInvite();
    };

    importMaybe = (event) => {
        [10, 13].indexOf(event.keyCode) >= 0 && event.ctrlKey && this.importUsers();
    };

    readFile = () => {
        let fr = new FileReader();

        fr.onload = (e) => {
            this.setState({usersToImport: e.target.result});
        };

        fr.readAsText(this.refs.file.files.item(0));
    };

    importUsers = () => {
        let users = this.state.usersToImport.split(',') || [];
        users.map(user => {
            this.props.inviteNewUser(user.trim());
        });
        this.toggleImportUsersModal();
    };

    toggleImportUsersModal = () => {
        let state = {importUsersModal: !this.state.importUsersModal};
        state.importUsersModal && (state.usersToImport = '');

        this.setState(state, () => {
            setTimeout(() => {
                let field = document.getElementById('emailList');
                field && field.focus();
            }, 200);
        });
    };

    exportUsers = () => {
        let users = [];
        this.props.sandbox.userRoles.map(r => {
            users.push(r.user.email);
        });

        users = [...new Set(users)];

        let blob = new Blob([users.concat(',')], {type: 'text/csv'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'usersExport.csv');
        } else {
            let e = document.createEvent('MouseEvents');
            let a = document.createElement('a');

            a.download = 'usersExport.csv';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    };

    toggleCreateModal = () => {
        this.setState({inviteModal: true, invitationsModal: false}, () => {
            setTimeout(() => {
                let field = document.getElementById('newEmailAddress');
                field && field.focus();
            }, 200);
        });
    };

    showInvitationsModal = () => {
        this.props.fetchSandboxInvites();
        this.setState({invitationsModal: true});
    };

    getRows = () => {
        let users = {};
        let adminCount = 0;
        let currentIsAdmin = false;
        this.props.sandbox.userRoles.map(r => {
            users[r.user.id] = users[r.user.id] || {
                name: r.user.name,
                email: r.user.email,
                sbmUserId: r.user.sbmUserId,
                roles: []
            };
            r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN' && (currentIsAdmin = true);
            r.role === 'ADMIN' && (adminCount++);
            users[r.user.id].roles.push(r.role);
        });

        let keys = Object.keys(users);

        let rows = keys.map(key => {
            let user = users[key];
            let isAdmin = user.roles.indexOf('ADMIN') >= 0;

            let canRemoveUser = keys.length > 1 && (
                (currentIsAdmin && user.sbmUserId !== this.props.user.sbmUserId) ||
                (user.sbmUserId === this.props.user.sbmUserId && (!currentIsAdmin || adminCount > 1))
            );
            let lastLogin = (this.props.loginInfo.find(i => i.sbmUserId === user.sbmUserId) || {}).accessTimestamp;
            if (lastLogin !== undefined) {
                lastLogin = new Date(lastLogin);
                let myDateString = lastLogin.getFullYear() + '-' + ('0' + (lastLogin.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + lastLogin.getDate()).slice(-2);
                lastLogin = myDateString + ' ' + ('0' + (lastLogin.getHours())).slice(-2) + ':' + ('0' + (lastLogin.getMinutes())).slice(-2);
            } else {
                lastLogin = 'unknown';
            }

            return <TableRow key={key}>
                <TableCell>{user.name || ''}</TableCell>
                <TableCell>{user.email || ''}</TableCell>
                <TableCell>{isAdmin ? 'Admin' : ''}</TableCell>
                <TableCell>{lastLogin}</TableCell>
                <TableCell>
                    <IconButton onClick={() => this.toggleMenu(key)}>
                        <span className='anchor' ref={'anchor_' + key}/>
                        <MoreIcon style={{color: this.props.theme.p3, width: '24px', height: '24px'}}/>
                        {this.state.showMenu && key === this.state.menuItem &&
                        <Menu anchorEl={this.refs['anchor_' + key]} open={this.state.showMenu && key === this.state.menuItem} onClose={this.toggleMenu}>
                            {isAdmin && <MenuItem disabled={adminCount === 1} className='scenario-menu-item' onClick={() => this.toggleAdmin(user.sbmUserId, isAdmin)}>
                                Revoke admin
                            </MenuItem>}
                            {currentIsAdmin && !isAdmin && <MenuItem className='scenario-menu-item' onClick={() => this.toggleAdmin(user.sbmUserId, isAdmin)}>
                                Make admin
                            </MenuItem>}
                            <MenuItem disabled={!canRemoveUser} className='scenario-menu-item' onClick={() => this.handleOpen(user.sbmUserId)}>
                                {user.sbmUserId === this.props.user.sbmUserId ? 'Leave sandbox' : 'Remove user'}
                            </MenuItem>
                        </Menu>}
                    </IconButton>
                </TableCell>
            </TableRow>
        });

        return {currentIsAdmin, rows};
    };

    handleInviteEmailChange = (email) => {
        this.setState({email, emailError: undefined});
    };

    getInvitations = () => {
        if (this.props.userInvitesLoading) {
            return <TableRow>
                <TableCell colSpan={3} style={{textAlign: 'center'}}>
                    <CircularProgress/>
                </TableCell>
            </TableRow>
        } else {
            let buttonStyles = {width: '30px', height: '30px', color: this.props.theme.p3};
            let style = {width: '40px', height: '40px'};
            let revokeStyle = {width: '30px', height: '30px', color: this.props.theme.p4};

            return this.props.invitations.map((invitation, key) => {
                let timestamp = invitation.inviteTimestamp;
                if (timestamp !== undefined) {
                    timestamp = new Date(timestamp);
                    timestamp = timestamp.getFullYear() + '-' + ('0' + (timestamp.getMonth() + 1)).slice(-2) + '-' + ('0' + timestamp.getDate()).slice(-2);
                } else {
                    timestamp = '';
                }
                return <TableRow key={key} className='invitation-table-row'>
                    <TableCell>{invitation.invitee.email}</TableCell>
                    <TableCell>{timestamp}</TableCell>
                    <TableCell className='invite-buttons-wrapper'>
                        <IconButton style={style} onClick={() => this.resendEmail(invitation.invitee.email)} tooltip='Resend'>
                            <Redo style={{buttonStyles}}/>
                        </IconButton>
                        <IconButton style={style} onClick={() => this.revokeInvitation(invitation.id)} tooltip='Revoke'>
                            <DeleteIcon style={{revokeStyle}}/>
                        </IconButton>
                    </TableCell>
                </TableRow>;
            });
        }
    };

    resendEmail = (email) => {
        EMAIL_REGEX.test(String(email).toLowerCase()) && this.props.inviteNewUser(email);
        this.handleClose();
        this.setState({action: 'sending'});
    };

    revokeInvitation = (id) => {
        this.props.removeInvitation(id);
        this.handleClose();
        this.setState({action: 'rejecting'});
    };

    toggleMenu = (menuItem) => {
        this.setState({showMenu: !this.state.showMenu, menuItem});
    };

    toggleAdmin = (userId, toggle) => {
        this.props.toggleUserAdminRights(userId, !toggle);
        this.toggleMenu();
    };

    handleOpen = (userId) => {
        this.setState({open: true, userToRemove: userId});
        this.toggleMenu();
    };

    handleClose = () => {
        this.setState({open: false, invitationsModal: false, inviteModal: false});
    };

    handleSendInvite = () => {
        if (EMAIL_REGEX.test(String(this.state.email).toLowerCase())) {
            this.props.inviteNewUser(this.state.email);
            this.setState({email: '', action: 'sending'});
            this.handleClose();
        } else {
            this.setState({emailError: 'Please enter a valid email address!'});
        }
    };

    deleteSandboxUserHandler = () => {
        this.setState({userToRemove: undefined});
        this.props.removeUser(this.state.userToRemove, this.props.history);
    };
}

const mapStateToProps = state => {
    return {
        invitations: state.sandbox.invitations,
        userInvitesLoading: state.sandbox.invitesLoading,
        inviting: state.sandbox.inviting,
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        user: state.users.user,
        updatingUser: state.sandbox.updatingUser,
        loginInfo: state.sandbox.userLoginInfo || []
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchSandboxInvites, removeUser, toggleUserAdminRights, inviteNewUser, removeInvitation}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(withTheme(Users))));
