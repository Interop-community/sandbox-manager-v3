import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Checkbox, Button, Paper, TextField, Select, MenuItem, IconButton, Dialog, FormControlLabel, FormControl, InputLabel, withTheme, DialogActions, Input, FormHelperText} from '@material-ui/core';
import * as  actions from '../../../redux/action-creators';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {withRouter} from 'react-router';
import './styles.less';

const NOT_ALLOWED_SANDBOX_IDS = ['test'];

class Index extends Component {
    constructor(props) {
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

    componentDidMount() {
        setTimeout(() => {
            let defaulInput = document.getElementById('name');
            defaulInput && defaulInput.focus();
        }, 200);
    }

    render() {
        let notAllowed = this.checkAllowedId();
        let submittable = this.checkSubmittable();

        let actions = [
            <Button variant='contained' key={1} disabled={!submittable} className='button' onClick={this.handleCreateSandbox} data-qa='sandbox-submit-button' color='primary'>
                Create
            </Button>
        ];

        return <Dialog classes={{paper: 'create-sandbox-dialog'}} open={this.props.open} onClose={this.handleCancel}>
            <div className='create-sandbox-wrapper' data-qa='create-sandbox-dialog'>
                <Paper className='paper-card'>
                    <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.handleCancel}>
                        <i className="material-icons" data-qa="modal-close-button">close</i>
                    </IconButton>
                    <h3>
                        Create Sandbox
                    </h3>
                    <div className='paper-body'>
                        <form>
                            <TextField id='name' label='Sandbox Name*' value={this.state.name} onChange={this.sandboxNameChangedHandler} className='margin-top' data-qa='sandbox-create-name'
                                       onKeyPress={this.submitMaybe}/>
                            <div className='subscript'>Must be fewer than 50 characters. e.g., NewCo Sandbox</div>
                            <FormControl error={!!notAllowed} className='margin-top'>
                                <InputLabel htmlFor="id">Sandbox Id*</InputLabel>
                                <Input id='id' value={this.state.sandboxId} onChange={this.sandboxIdChangedHandler} onKeyPress={this.submitMaybe}/>
                                {!!notAllowed && <FormHelperText error>ID not allowed or already in use</FormHelperText>}
                            </FormControl>
                            <div className='subscript'>Letters and numbers only. Must be fewer than 20 characters.</div>
                            <div className='subscript'>Your sandbox will be available at {window.location.origin}/{this.state.sandboxId}</div>
                            <FormControl style={{minWidth: '200px', marginTop: '20px'}}>
                                <InputLabel htmlFor="age-simple">FHIR version</InputLabel>
                                <Select data-qa='sandbox-version' value={this.state.apiEndpointIndex || ''} onChange={e => this.sandboxFhirVersionChangedHandler('apiEndpointIndex', e.target.value)}
                                        inputProps={{name: 'age', id: 'age-simple'}} className='fhirVersion'>
                                    <MenuItem value='8' data-qa='fhir-dstu2'>
                                        FHIR DSTU2 (v1.0.2)
                                    </MenuItem>
                                    <MenuItem value='9' data-qa='fhir-stu3'>
                                        FHIR STU3 (v3.0.2)
                                    </MenuItem>
                                    <MenuItem value='10' data-qa='fhir-r4'>
                                        FHIR R4 (v4.0.1)
                                    </MenuItem>
                                    <MenuItem value='11' data-qa='fhir-r5'>
                                        FHIR R5 (v4.5.0)
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <div className='subscript'>Choose a version of the FHIR Standard</div>
                            <br/>
                            <div className='checkboxes'>
                                <div>
                                    <FormControlLabel control={<Checkbox onChange={this.allowOpenChangeHandler} value='open' color='primary'/>} label='Allow Open FHIR Endpoint' className='checkbox'/>
                                </div>
                                {(!this.state.apiEndpointIndex || this.state.apiEndpointIndex !== '11') &&
                                <div>
                                    <FormControlLabel control={<Checkbox defaultChecked onChange={this.applyDefaultChangeHandler} value='open' color='primary'/>} label='Import sample patients and practitioners'
                                                      className='checkbox'/>
                                </div>}
                                {(!this.state.apiEndpointIndex || this.state.apiEndpointIndex !== '11') &&
                                <div>
                                    <FormControlLabel control={<Checkbox defaultChecked onChange={this.applyDefaultAppsChangeHandler} value='open' color='primary'/>} label='Import sample applications'
                                                      className='checkbox'/>
                                </div>}
                            </div>
                            <TextField id='description' label='Description' onChange={this.sandboxDescriptionChange} data-qa='sandbox-create-description' onKeyPress={this.submitMaybe}/><br/>
                            <div className='subscript'>e.g., This sandbox is the QA environment for NewCo.</div>
                        </form>
                    </div>
                </Paper>
                <div style={{clear: 'both'}}/>
            </div>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    }

    checkSubmittable = () => {
        let allowed = this.checkAllowedId();

        return !this.state.createDisabled && !allowed && !!this.state.apiEndpointIndex;
    };

    checkAllowedId = () => {
        return this.props.sandboxes.find(i => i.sandboxId.toLowerCase() === this.state.sandboxId.toLowerCase()) || NOT_ALLOWED_SANDBOX_IDS.indexOf(this.state.sandboxId.toLowerCase()) >= 0;
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.checkSubmittable() && this.handleCreateSandbox(event);
    };

    sandboxDescriptionChange = (_e, description) => {
        this.setState({description});
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
        this.setState({applyDefaultDataSet: !this.state.applyDefaultDataSet});
    };

    applyDefaultAppsChangeHandler = (_, applyDefaultApps) => {
        this.setState({applyDefaultApps});
    };

    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    sandboxIdChangedHandler = (event) => {
        let value = event.target.value.replace(/[^a-z0-9]/gi, '');
        if (value.length > 20) {
            value = value.substring(0, 20);
        }
        this.setState({sandboxId: value, createDisabled: value === 0})
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
        this.setState({name: value, sandboxId: cleanValue, createDisabled: value === 0});
    };

    sandboxFhirVersionChangedHandler = (prop, val) => {
        let sandbox = this.state || this.props || {};
        sandbox[prop] = val;

        this.setState({sandbox});
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Index))));
