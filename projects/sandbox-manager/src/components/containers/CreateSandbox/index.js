import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, RaisedButton, Paper, TextField, SelectField, MenuItem, IconButton, Dialog } from 'material-ui';
import * as  actions from '../../../redux/action-creators';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from "material-ui/styles/muiThemeable";
import { withRouter } from 'react-router';
import './styles.less';

class Index extends Component {
    constructor (props) {
        super(props);

        this.state = {
            sandboxId: '',
            name: '',
            version: '',
            allowOpen: false,
            applyDefaultDataSet: true,
            applyDefaultApps: true,
            description: '',
            createDisabled: true,
            apiEndpointIndex: undefined
        };
    }

    render () {
        let duplicate = this.props.sandboxes.find(i => i.sandboxId.toLowerCase() === this.state.sandboxId.toLowerCase());

        let actions = [
            <RaisedButton key={1} label='Create' disabled={this.state.createDisabled || !!duplicate || !this.state.apiEndpointIndex} className='button' primary onClick={this.handleCreateSandbox}/>
        ];

        let underlineFocusStyle = { borderColor: this.props.muiTheme.palette.primary2Color };
        let floatingLabelFocusStyle = { color: this.props.muiTheme.palette.primary2Color };

        return <Dialog paperClassName='create-sandbox-dialog' open={this.props.open} actions={actions} autoScrollBodyContent onRequestClose={this.handleCancel}>
            <div className='create-sandbox-wrapper'>
                <Paper className='paper-card'>
                    <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleCancel}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h3>
                        Create Sandbox
                    </h3>
                    <div className='paper-body'>
                        <form>
                            <TextField id='name' floatingLabelText='Sandbox Name*' value={this.state.name} onChange={this.sandboxNameChangedHandler}
                                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/> <br/>
                            <div className='subscript'>Must be fewer than 50 characters. e.g., NewCo Sandbox</div>
                            <TextField id='id' floatingLabelText='Sandbox Id*' value={this.state.sandboxId} onChange={this.sandboxIdChangedHandler}
                                       errorText={duplicate ? 'ID already in use' : undefined} underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/><br/>
                            <div className='subscript'>Letters and numbers only. Must be fewer than 20 characters.</div>
                            <div className='subscript'>Your sandbox will be available at {window.location.origin}/{this.state.sandboxId}</div>
                            <SelectField value={this.state.apiEndpointIndex} onChange={(_e, _k, value) => this.sandboxFhirVersionChangedHandler('apiEndpointIndex', value)}
                                          className='fhirVersion' floatingLabelText='FHIR version'>
                                <MenuItem value='8' primaryText='FHIR DSTU2 (v1.0.2)'/>
                                <MenuItem value='9' primaryText='FHIR STU3 (v3.0.1)'/>
                                <MenuItem value='10' primaryText='FHIR R4 (v4.0.0)'/>
                            </SelectField>
                            <div className='subscript'>Choose a version of the FHIR Standard</div>
                            <br/>
                            <div className='checkboxes'>
                                <Checkbox label='Allow Open FHIR Endpoint' className='checkbox' onCheck={this.allowOpenChangeHandler}/>
                                <Checkbox label='Import sample patients and practitioners' className='checkbox' defaultChecked onCheck={this.applyDefaultChangeHandler}/>
                                <Checkbox label='Import sample applications' className='checkbox' defaultChecked onCheck={this.applyDefaultAppsChangeHandler}/>
                            </div>
                            <TextField id='description' floatingLabelText='Description' onChange={this.sandboxDescriptionChange}
                                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/><br/>
                            <div className='subscript'>e.g., This sandbox is the QA environment for NewCo.</div>
                        </form>
                    </div>
                </Paper>
                <div style={{ clear: 'both' }}/>
            </div>
        </Dialog>
    }

    sandboxDescriptionChange = (_e, description) => {
        this.setState({ description });
    };

    handleCreateSandbox = (event) => {
        event.preventDefault();
        let createRequest = {
            createdBy: this.props.user,
            name: this.state.name.length === 0 ? this.state.sandboxId : this.state.name,
            sandboxId: this.state.sandboxId,
            description: this.state.description,
            dataSet: this.state.applyDefaultDataSet ? 'DEFAULT' : 'NONE',
            apps: this.state.applyDefaultApps ? 'DEFAULT' : 'NONE',
            apiEndpointIndex: this.state.apiEndpointIndex,
            allowOpenAccess: this.state.allowOpen,
            users: [this.props.user]
        };
        this.props.createSandbox(createRequest);
        this.props.onCancel && this.props.onCancel();
    };

    allowOpenChangeHandler = () => {
        this.setState((oldState) => {
            return {
                allowOpen: !oldState.checked,
            };
        });
    };

    applyDefaultChangeHandler = () => {
        this.setState({ applyDefaultDataSet: !this.state.applyDefaultDataSet });
    };

    applyDefaultAppsChangeHandler = (_, applyDefaultApps) => {
        this.setState({ applyDefaultApps });
    };

    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    sandboxIdChangedHandler = (event) => {
        let value = event.target.value.replace(/[^a-z0-9]/gi, '');
        if (value.length > 20) {
            value = value.substring(0, 20);
        }
        this.setState({ sandboxId: value, createDisabled: value === 0 })
    };

    sandboxNameChangedHandler = (event) => {
        let value = event.target.value;
        if (value.length > 50) {
            value = value.substring(0, 50);
        }
        let cleanValue = value.replace(/[^a-z0-9]/gi, '');
        if (cleanValue.length > 20) {
            cleanValue = cleanValue.substring(0, 20);
        }
        this.setState({ name: value, sandboxId: cleanValue, createDisabled: value === 0 });
    };

    sandboxFhirVersionChangedHandler = (prop, val) => {
        let sandbox = this.state || this.props || {};
        sandbox[prop] = val;

        this.setState({ sandbox });
    };

}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        sandboxes: state.sandbox.sandboxes
    };
};


const mapDispatchToProps = dispatch => {
    return {
        createSandbox: (sandboxDetails) => dispatch(actions.createSandbox(sandboxDetails))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Index))));
