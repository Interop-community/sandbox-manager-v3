import React, {Component} from 'react';
import {Checkbox, Button, TextField, Card, DialogActions, IconButton, Dialog, FormControlLabel} from '@material-ui/core';
import Redo from '@material-ui/icons/Redo';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {bindActionCreators} from 'redux';
import {updateSandbox, resetCurrentSandbox, deleteCurrentSandbox, clearSearchResults} from '../../../../redux/action-creators';
import withErrorHandler from '../../../UI/hoc/withErrorHandler';

import './styles.less';
import SandboxReset from "../SandboxReset";
import DeleteSandbox from '../DeleteSandbox';

const MODALS = {edit: 'edit', reset: 'reset', delete: 'delete'};

class SandboxDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            updateDone: false,
            toggleReset: false,
            addSampleData: false,
            modalToShow: undefined,
            name: this.props.sandboxName,
            description: this.props.sandboxDescription,
            allowOpen: this.props.sandboxAllowOpenAccess,
            currentUserIsAdmin: false
        };
    }

    componentDidMount() {
        let current = this.props.sandbox && this.props.sandbox.userRoles && this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN');
        current && this.setState({currentUserIsAdmin: true});
    }

    componentWillReceiveProps(nextProps) {
        let current = (!this.props.sandbox || (this.props.sandbox && !this.props.sandbox.userRoles)) &&
            (nextProps.sandbox && nextProps.sandbox.userRoles) && nextProps.sandbox.userRoles.find(r => r.user.sbmUserId === nextProps.user.sbmUserId && r.role === 'ADMIN');
        current && this.setState({currentUserIsAdmin: true});
    }

    render() {
        let [actions, content] = this.getModalContent();

        return <Card className='sandbox-details-wrapper'>
            <Dialog open={!!this.state.modalToShow} onClose={() => this.toggleModal()} classes={{paper: 'settings-dialog'}}>
                {content}
                <DialogActions>
                    {actions}
                </DialogActions>
            </Dialog>
            <div className='header-actions-wrapper'>
                <IconButton tooltip='Edit' onClick={() => this.toggleModal(MODALS.edit)} disabled={!this.state.currentUserIsAdmin}>
                    <Edit style={{color: this.props.theme.p3, width: '24px', height: '24px'}}/>
                </IconButton>
                <IconButton tooltip='Reset' onClick={() => this.toggleModal(MODALS.reset)} disabled={!this.state.currentUserIsAdmin}>
                    <Redo style={{color: this.props.theme.p3, width: '24px', height: '24px'}}/>
                </IconButton>
                <IconButton tooltip='Delete' onClick={() => this.toggleModal(MODALS.delete)} disabled={!this.state.currentUserIsAdmin} data-qa='delete-sandbox-button'>
                    <Delete style={{color: this.props.theme.p3, width: '24px', height: '24px'}}/>
                </IconButton>
            </div>
            <div>
                <div className='label-value'>
                    <span>Sandbox Name: </span>
                    <span>{this.props.sandboxName}</span>
                </div>
                <div className='label-value'>
                    <span>Sandbox Description: </span>
                    <span>{this.props.sandboxDescription || 'no description available'}</span>
                </div>
                <div className='label-value'>
                    <span>Sandbox ID: </span>
                    <span>{this.props.sandboxId}</span>
                </div>
                <div className='label-value'>
                    <span>Secured FHIR Server URL: </span>
                    <span>{window.fhirClient ? window.fhirClient.server.serviceUrl : ''}</span>
                </div>
                {this.props.sandboxAllowOpenAccess && <div className='label-value'>
                    <span>Open FHIR Server URL: </span>
                    <span>{this.props.serviceUrl.replace('/data', '/open')}</span>
                </div>}
                <div className='label-value'>
                    <span>Sandbox FHIR Version: </span>
                    <span>{this.props.sandboxVersion.name}</span>
                </div>
                <div className='label-value'>
                    <span>{this.props.metadata.software.name}: </span>
                    <span>{this.props.metadata.software.version}</span>
                </div>
            </div>
        </Card>;
    }

    getModalContent = () => {
        let titleStyle = {
            backgroundColor: this.props.theme.p2,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        let actions = this.state.modalToShow === MODALS.edit
            ? <div className='modal-bottom-actions-wrapper'>
                <Button variant='contained' color='primary' onClick={this.updateSandboxHandler}>
                    Save
                </Button>
            </div>
            : this.state.modalToShow === MODALS.reset
                ? <div className='modal-bottom-actions-wrapper'>
                    <Button variant='contained' disabled={!this.state.toggleReset} onClick={this.resetSandbox}>
                        Reset
                    </Button>
                </div>
                : <div className='modal-bottom-actions-wrapper'>
                    <Button variant='contained' disabled={!this.state.toggleDelete} onClick={this.deleteSandbox} data-qa='sandbox-delete-button'
                            style={this.state.toggleDelete ? {backgroundColor: this.props.theme.p4, color: this.props.theme.p7} : undefined}>
                        Delete sandbox
                    </Button>
                </div>;

        let content = this.state.modalToShow === MODALS.edit
            ? <div className='sandbox-edit-modal' key={this.state.modalToShow}>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={() => this.toggleModal()}>
                        <i className="material-icons" data-qa="modal-close-button">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>EDIT SANDBOX</h1>
                </div>
                <TextField value={this.state.name || this.props.sandboxName} label='Sandbox Name' fullWidth onChange={this.handleSandboxNameChange} onKeyPress={this.submitMaybe}/>
                <TextField value={this.state.description || this.props.sandboxDescription} label='Sandbox Description' onChange={this.handleSandboxDescriptionChange} fullWidth onKeyPress={this.submitMaybe}/>
                <FormControlLabel label='Allow Open FHIR Endpoint'
                                  control={<Checkbox defaultChecked={this.props.sandboxAllowOpenAccess} onChange={this.handleOpenFhirCheckboxChange}/>}/>
            </div>
            : this.state.modalToShow === MODALS.reset
                ? <div>
                    <SandboxReset toggleSampleData={this.toggleSampleData} theme={this.props.theme} sandbox={this.props.sandbox} toggleReset={this.toggleReset} onClose={() => this.toggleModal()}/>
                </div>
                : this.state.modalToShow === MODALS.delete
                    ? <div>
                        <DeleteSandbox toggleDelete={this.toggleDelete} theme={this.props.theme} sandbox={this.props.sandbox} onClose={() => this.toggleModal()}/>
                    </div>
                    : <span/>;

        return [actions, content];
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.updateSandboxHandler(event);
    };

    resetSandbox = () => {
        this.props.clearSearchResults();
        this.props.resetCurrentSandbox(this.state.addSampleData);
        this.toggleModal();
    };

    deleteSandbox = () => {
        this.props.deleteCurrentSandbox(this.props.history);
        this.toggleModal();
    };

    toggleSampleData = (addSampleData) => {
        this.setState({addSampleData});
    };

    toggleReset = (toggleReset) => {
        this.setState({toggleReset});
    };

    toggleDelete = (_, toggleDelete) => {
        this.setState({toggleDelete});
    };

    toggleModal = (type) => {
        this.setState({modalToShow: type, addSampleData: false, toggleReset: false, toggleDelete: false});
    };

    updateSandboxHandler = (event) => {
        event.preventDefault();

        const details = {
            name: this.state.name || this.props.sandboxName,
            description: this.state.description,
            allowOpenAccess: this.state.allowOpen
        };

        this.props.updateSandbox(details);
        this.toggleModal();
    };

    handleSandboxNameChange = (event) => {
        this.setState({name: event.target.value, updateDone: true});
    };

    handleSandboxDescriptionChange = (event) => {
        this.setState({description: event.target.value});
    };

    handleOpenFhirCheckboxChange = (_e, allowOpen) => {
        this.setState({allowOpen, updateDone: true})
    };
}

const mapStateToProps = state => {
    let sandbox = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
    let sandboxName = sandbox ? sandbox.name : '';
    let sandboxId = sandbox ? sandbox.sandboxId : '';
    let sandboxDescription = sandbox ? sandbox.description : '';
    let sandboxAllowOpenAccess = sandbox ? !!sandbox.allowOpenAccess : false;
    let metadata = state.fhir.meta || {software: {}};
    let sandboxVersion = state.sandbox.sandboxApiEndpointIndex
        ? state.sandbox.sandboxApiEndpointIndexes.find(i => i.index === state.sandbox.sandboxApiEndpointIndex)
        : {name: 'unknown'};

    return {
        sandboxName, sandboxId, sandboxDescription, sandboxAllowOpenAccess, sandboxVersion, sandbox, metadata,
        user: state.users.user,
        serviceUrl: state.fhir.smart.data.server && state.fhir.smart.data.server.serviceUrl,
        resetting: state.sandbox.resetting,
        deleting: state.sandbox.deleting
    };
};
const mapDispatchToProps = dispatch => bindActionCreators({updateSandbox, resetCurrentSandbox, deleteCurrentSandbox, clearSearchResults}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(SandboxDetails)))
