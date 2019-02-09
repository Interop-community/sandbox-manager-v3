import React, { Component } from 'react';
import { CircularProgress, Checkbox, RaisedButton, TextField, Card, CardHeader, CardText, IconButton, Dialog } from 'material-ui';
import Redo from 'material-ui/svg-icons/content/redo';
import Delete from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/image/edit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { updateSandbox, resetCurrentSandbox, deleteCurrentSandbox, clearSearchResults } from '../../../../redux/action-creators';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';

import './styles.less';
import SandboxReset from "../SandboxReset";
import DeleteSandbox from '../DeleteSandbox';

const MODALS = { edit: 'edit', reset: 'reset', delete: 'delete' };

class SandboxDetails extends Component {

    constructor (props) {
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

    componentDidMount () {
        let current = this.props.sandbox && this.props.sandbox.userRoles && this.props.sandbox.userRoles.find(r => r.user.sbmUserId === this.props.user.sbmUserId && r.role === 'ADMIN');
        current && this.setState({ currentUserIsAdmin: true });
    }

    componentWillReceiveProps (nextProps) {
        let current = (!this.props.sandbox || (this.props.sandbox && !this.props.sandbox.userRoles)) &&
            (nextProps.sandbox && nextProps.sandbox.userRoles) && nextProps.sandbox.userRoles.find(r => r.user.sbmUserId === nextProps.user.sbmUserId && r.role === 'ADMIN');
        current && this.setState({ currentUserIsAdmin: true });
    }

    render () {
        let titleStyle = { backgroundColor: this.props.theme.primary5Color };
        let [actions, content] = this.getModalContent();

        return <Card className='sandbox-details-wrapper'>
            <Dialog modal={false} open={!!this.state.modalToShow} onRequestClose={() => this.toggleModal()} actions={actions} paperClassName='settings-dialog'
                    contentStyle={{ maxWidth: '450px' }}>
                {content}
            </Dialog>
            <CardHeader className='details-header' style={titleStyle}>
                <div className='header-actions-wrapper'>
                    <IconButton tooltip='Edit' onClick={() => this.toggleModal(MODALS.edit)} disabled={!this.state.currentUserIsAdmin}>
                        <Edit color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton tooltip='Reset' onClick={() => this.toggleModal(MODALS.reset)} disabled={!this.state.currentUserIsAdmin}>
                        <Redo color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <IconButton tooltip='Delete' onClick={() => this.toggleModal(MODALS.delete)} disabled={!this.state.currentUserIsAdmin}>
                        <Delete color={this.props.theme.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                </div>
            </CardHeader>
            <CardText>
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
                </div>
            </CardText>
        </Card>;
    }

    getModalContent = () => {
        let titleStyle = {
            backgroundColor: this.props.theme.primary2Color,
            color: this.props.theme.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        let actions = this.state.modalToShow === MODALS.edit
            ? <div className='modal-bottom-actions-wrapper'>
                <RaisedButton label='Save' primary onClick={this.updateSandboxHandler}/>
            </div>
            : this.state.modalToShow === MODALS.reset
                ? <div className='modal-bottom-actions-wrapper'>
                    <RaisedButton disabled={!this.state.toggleReset} label=' Reset ' onClick={this.resetSandbox}
                                  labelColor={this.props.theme.primary5Color} backgroundColor={this.props.theme.primary4Color}/>
                </div>
                : <div className='modal-bottom-actions-wrapper'>
                    <RaisedButton labelColor={this.props.theme.primary5Color} backgroundColor={this.props.theme.primary4Color} disabled={!this.state.toggleDelete}
                                  label='Delete sandbox' onClick={this.deleteSandbox}/>
                </div>;

        let content = this.state.modalToShow === MODALS.edit
            ? <div className='sandbox-edit-modal' key={this.state.modalToShow}>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={() => this.toggleModal()}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>EDIT SANDBOX</h1>
                </div>
                <TextField value={this.state.name || this.props.sandboxName} floatingLabelText='Sandbox Name' fullWidth onChange={this.handleSandboxNameChange}/>
                <TextField value={this.state.description || this.props.sandboxDescription} floatingLabelText='Sandbox Description' onChange={(event) => this.handleSandboxDescriptionChange(event)} fullWidth/>
                <Checkbox label='Allow Open FHIR Endpoint' defaultChecked={this.props.sandboxAllowOpenAccess} onCheck={this.handleOpenFhirCheckboxChange}
                          iconStyle={{ fill: this.props.theme.primary2Color }}/>
            </div>
            : this.state.modalToShow === MODALS.reset
                ? <div>
                    <SandboxReset toggleSampleData={this.toggleSampleData} theme={this.props.theme} sandbox={this.props.sandbox} toggleReset={this.toggleReset} onClose={() => this.toggleModal()}/>
                </div>
                : this.state.modalToShow === MODALS.delete
                    ? <div>
                        <DeleteSandbox toggleDelete={this.toggleDelete} theme={this.props.theme} sandbox={this.props.sandbox} onClose={() => this.toggleModal()}/>
                    </div>
                    : null;

        return [actions, content];
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
        this.setState({ addSampleData });
    };

    toggleReset = (toggleReset) => {
        this.setState({ toggleReset });
    };

    toggleDelete = (toggleDelete) => {
        this.setState({ toggleDelete });
    };

    toggleModal = (type) => {
        this.setState({ modalToShow: type, addSampleData: false, toggleReset: false, toggleDelete: false });
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

    handleSandboxNameChange = (_e, name) => {
        this.setState({ name, updateDone: true });
    };

    handleSandboxDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    handleOpenFhirCheckboxChange = (_e, allowOpen) => {
        this.setState({ allowOpen, updateDone: true })
    };
}

const mapStateToProps = state => {
    let sandbox = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
    let sandboxName = sandbox ? sandbox.name : '';
    let sandboxId = sandbox ? sandbox.sandboxId : '';
    let sandboxDescription = sandbox ? sandbox.description : '';
    let sandboxAllowOpenAccess = sandbox ? !!sandbox.allowOpenAccess : false;
    let sandboxVersion = state.sandbox.sandboxApiEndpointIndex
        ? state.sandbox.sandboxApiEndpointIndexes.find(i => i.index === state.sandbox.sandboxApiEndpointIndex)
        : { name: 'unknown' };

    return {
        sandboxName, sandboxId, sandboxDescription, sandboxAllowOpenAccess, sandboxVersion, sandbox,
        user: state.users.user,
        serviceUrl: state.fhir.smart.data.server && state.fhir.smart.data.server.serviceUrl,
        resetting: state.sandbox.resetting,
        deleting: state.sandbox.deleting
    };
};
const mapDispatchToProps = dispatch => bindActionCreators({ updateSandbox, resetCurrentSandbox, deleteCurrentSandbox, clearSearchResults }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(SandboxDetails)))
