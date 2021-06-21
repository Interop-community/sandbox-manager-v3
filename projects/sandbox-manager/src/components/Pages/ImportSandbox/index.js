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
            showZipWarning: false,
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
        return <div><Dialog classes={{paper: 'import-sandbox-dialog'}} open={this.props.open} onClose={this.handleCancel}>
            <div className='import-sandbox-wrapper' data-qa='import-sandbox-dialog'>
                <Paper className='paper-card'>
                    <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.handleCancel}>
                        <i className="material-icons" data-qa="modal-close-button">close</i>
                    </IconButton>
                    <h3>
                        Import Sandbox
                    </h3>
                    {this.state.showZipWarning ? <div className='paper-body'>
                            <div>
                                Only zip files are allowed!
                            </div>
                            <Button variant='contained' color='primary' onClick={this.handleCancel}>
                                Ок
                            </Button>
                        </div>
                        :<div className='paper-body'>
                            <div>Please upload a zip file to import from</div>
                            <Button variant='contained' color='primary' onClick={() => this.refs.fileZip.click()}>
                                Upload Zip
                            </Button>
                            {/* <input accept='application/x-bzip application/x-bzip2 application/gzip application/x-rar-compressed application/x-tar application/zip application/x-7z-compressed' type='file' id='fileZip'
                                ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/> */}
                        </div>
                    }
                </Paper>
                <div style={{clear: 'both'}}/>
            </div>
            {/* <DialogActions>
                {actions}
            </DialogActions> */}
        </Dialog>
        <input accept='application/x-bzip application/x-bzip2 application/gzip application/x-rar-compressed application/x-tar application/zip application/x-7z-compressed' type='file' id='fileZip' ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/>
        </div>
    }

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.props.importSandbox(this.refs.fileZip.files[0]);
            this.props.onCancel && this.props.onCancel();
        } else {
            this.toggleWarningModal();
        }
    };

    toggleWarningModal = () => {
        this.setState({showZipWarning: !this.state.showZipWarning});
    };

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
        importSandbox: (file) => dispatch(actions.importSandbox(file))
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Index))));
