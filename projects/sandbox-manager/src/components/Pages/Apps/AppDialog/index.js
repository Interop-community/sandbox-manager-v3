import React, {Component} from 'react';
import {MenuItem, Select, Button, Paper, TextField, Dialog, Switch, IconButton, Fab, withTheme, DialogActions, FormControlLabel} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "svg-react-loader?name=Patient!../../../../assets/icons/baseline-info.svg";
import ContentCopy from '@material-ui/icons/FileCopy';
import './styles.less';

class AppDialog extends Component {
    constructor(props) {
        super(props);

        let clientJSON = props.app && props.app.clientJSON && JSON.parse(props.app.clientJSON);
        let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
        let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');
        let manifest = props.manifest;

        let app = {
            clientName: props.app ? props.app.clientName : (manifest ? manifest.client_name : ''),
            launchUri: props.app ? props.app.launchUri : (manifest ? manifest.launch_url : ''),
            samplePatients: props.app && props.app.samplePatients ? props.app.samplePatients : (manifest ? manifest.samplePatients : ''),
            redirectUris: redirectUris ? redirectUris : (manifest ? manifest.redirect_uris.join(',') : ''),
            scope: scope ? scope : (manifest ? manifest.scope : ''),
            logoUri: props.app ? props.app.logoUri : (manifest ? manifest.logo_uri : ''),
            briefDescription: props.app ? props.app.briefDescription : (manifest ? manifest.briefDescription : ''),
            tokenEndpointAuthMethod: clientJSON && clientJSON.tokenEndpointAuthMethod || 'NONE',
            clientJSON: props.app ? clientJSON : {},
            patientScoped: true,
            offlineAccess: false,
            copyType: props.app ? props.app.copyType : 'MASTER',
        };

        let isReplica = app.copyType === 'REPLICA';

        this.state = {
            value: 'PublicClient',
            modalOpen: false,
            clone: false,
            changes: [],
            app,
            originalApp: Object.assign({}, app),
            isReplica
        }
    }

    componentDidMount() {
        this.props.manifest && this.state.app.logoUri && this.loadImageFromWeb();
        setTimeout(() => {
            let defaulInput = document.getElementById('appName');
            defaulInput && defaulInput.focus();
        }, 200);
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.app && !this.props.app.clientJSON && nextProps.app.clientJSON) ||
            (this.props.app && this.props.app.clientJSON && nextProps.app.clientJSON && this.props.app.clientJSON.length !== nextProps.app.clientJSON.length)) {
            let clientJSON = nextProps.app && nextProps.app.clientJSON && JSON.parse(nextProps.app.clientJSON);
            let redirectUris = clientJSON && clientJSON.redirectUris && clientJSON.redirectUris.join(',');
            let scope = clientJSON && clientJSON.scope && clientJSON.scope.join(' ');

            let app = Object.assign({}, this.state.app, {scope, redirectUris, clientJSON});

            this.setState({app});
        }
    }

    render() {
        let clientId = null;
        let clientSecret = null;
        let theme = this.props.theme;
        let iconStyle = {color: theme.p3, fill: theme.p3, width: '24px', height: '24px'};

        if (this.props.app && !this.state.clone) {
            clientId = <div className='label-value'>
                <span>Client Id: </span>
                <span>{this.props.app.clientId}</span>
                <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(this.props.app.clientId)}/>
            </div>;

            clientSecret = this.state.app.clientJSON && this.state.app.clientJSON.clientSecret
                ? <div className='label-value'>
                    <span>Client Secret: </span>
                    <span>{this.state.app.clientJSON.clientSecret}</span>
                    <ContentCopy className='copy-button' onClick={() => this.props.copyToClipboard(this.state.app.clientJSON.clientSecret)}/>
                </div>
                : null;
        }

        let saveEnabled = this.checkSaveEnabled();
        let actions = [
            <Button key={1} variant='contained' color='primary' onClick={this.save} disabled={!saveEnabled} data-qa='app-modal-save-button'>
                Save
            </Button>
        ];

        this.props.app && !this.state.clone && actions.push(<Button key={2} variant='contained' style={{backgroundColor: theme.p4, color: theme.p5}} onClick={this.delete}>
            Delete
        </Button>);
        this.props.app && !this.state.clone && actions.unshift(<Button key={3} variant='contained' color='primary' onClick={this.clone}>
            Clone
        </Button>);
        this.props.app && actions.unshift(<Button key={4} variant='contained' onClick={this.createManifest}>
            Download manifest
        </Button>);

        let paperClasses = 'app-dialog' + (this.props.app ? ' small' : '');

        return <Dialog classes={{paper: paperClasses}} open={!!this.props.open} onClose={this.props.onClose}>
            <Paper className='paper-card' data-qa='create-app-modal-wrapper'>
                <IconButton style={{color: theme.p5}} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h3>{this.props.app ? 'Registered App Details' : 'App Details'}</h3>
                <div className='paper-body'>
                    <TextField label='App Name*' fullWidth value={this.state.app.clientName} placeholder='Human Readable Name for Your App e.g.: Growth Chart' disabled={this.state.isReplica}
                               onChange={e => this.onChange('clientName', e.target.value)} id='appName' onKeyPress={this.submitMaybe}/>
                    <br/>
                    <div className='margin-top'>
                        <div className='label'>Client Type</div>
                        <Select value={this.state.app.tokenEndpointAuthMethod} onChange={(e) => this.onChange('tokenEndpointAuthMethod', e.target.value)} disabled={this.state.isReplica}>
                            <MenuItem value='NONE'>
                                Public Client
                            </MenuItem>
                            <MenuItem value='SECRET_BASIC'>
                                Confidential Client
                            </MenuItem>
                        </Select>
                    </div>
                    {clientId}
                    {clientSecret}
                    <TextField multiline label='Description' value={this.state.app.briefDescription || ''} fullWidth disabled={this.state.isReplica && !this.props.manifest} data-qa='description-input'
                               onChange={e => this.onChange('briefDescription', e.target.value)} onKeyPress={this.submitMaybe} className='margin-top'/>
                    <TextField label='App Launch URI*' value={this.state.app.launchUri} fullWidth onChange={e => this.onChange('launchUri', e.target.value)}
                               placeholder='e.g.: https://mydomain.com/growth-chart/launch.html' className='margin-top'
                               onBlur={this.launchBlur} disabled={this.state.isReplica} data-qa='launch-uri-input' onKeyPress={this.submitMaybe}/>
                    <TextField value={this.state.app.redirectUris} fullWidth label='App Redirect URIs*' className='margin-top'
                               disabled={this.state.isReplica} data-qa='redirect-uris-input' onKeyPress={this.submitMaybe}
                               onChange={e => this.onChange('redirectUris', e.target.value)} placeholder='e.g.: https://mydomain.com/growth-chart/index.html'/>
                    <span className='subscript'>
                        Note: If you provide one or more redirect URIs, your client code must send one of the provided values when performing OAuth2 authorization or you will receive an 'Invalid redirect' error.
                    </span>
                    <TextField fullWidth label='Scopes' value={this.state.app.scope} onChange={e => this.onChange('scope', e.target.value)} disabled={this.state.isReplica}
                               placeholder='eg: launch patient/*.* openid profile' onKeyPress={this.submitMaybe} className='margin-top'/>
                    <span className='subscript'>
                        Space separated list of scopes. Note: If you do not provide scopes, defaults will be set.
                    </span>
                    <div className='scopes-info'>
                        <a href='http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/' target='_blank'>
                            <InfoIcon className='column-item-icon no-vertical-align' style={iconStyle}/>
                            <div>About SMART Scopes</div>
                        </a>
                    </div>
                    <TextField fullWidth label='Sample Patients' placeholder='e.g.: Patient?_id=SMART-1032702,SMART-621799'
                               disabled={this.state.isReplica && !this.props.manifest} onKeyPress={this.submitMaybe} className='margin-top'
                               value={this.state.app.samplePatients} onChange={e => this.onChange('samplePatients', e.target.value)}/>
                    {this.props.app && <span className='subscript'>This is a FHIR query to limit the Patient Picker on launch.</span>}
                    {!this.props.app && <div className='toggle-wrapper'>
                        <FormControlLabel control={<Switch checked={this.state.app.offlineAccess} onChange={e => this.onChange('offlineAccess', e.target.checked)}/>} label='Allow offline access'/>
                        <FormControlLabel control={<Switch checked={this.state.app.patientScoped} onChange={e => this.onChange('patientScoped', e.target.checked)}/>} label='Patient Scoped App'/>
                    </div>}
                    <div className='image-form margin-top'>
                        <div className='image-button-wrapper'>
                            <Button variant='contained' onClick={() => this.refs.image.click()} disabled={this.state.isReplica}>
                                Select Image
                            </Button>
                            <div>
                                <span className='subscript'>(Display size 300px W X 200px H)</span>
                            </div>
                            <div>
                                <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                            </div>
                        </div>
                        <div className='image-wrapper'>
                            <input ref='image' type='file' style={{'display': 'none'}} onChange={this.onFileInput}/>
                            {this.state.app.logoUri
                                ? <img src={this.state.app.logoUri}/>
                                : <img style={{height: '100%', width: '100%'}} src={app.logoUri || 'https://content.interop.community/app.png'} alt='App Logo'/>
                            }
                        </div>
                        {this.state.app.logoUri &&
                        <Fab onClick={this.removeImage} size='small' className='remove-image-button' disabled={this.state.isReplica} style={{backgroundColor: theme.p4, color: theme.p5}}>
                            <DeleteIcon/>
                        </Fab>}
                    </div>
                </div>
            </Paper>
            <DialogActions className='app-dialog-actions-wrapper'>
                {actions}
            </DialogActions>
        </Dialog>
    }

    checkSaveEnabled = () => {
        let sApp = this.state.app;

        return (this.props.app && !this.state.clone)
            ? this.state.changes.length > 0
            : sApp.clientName.length > 2 && sApp.launchUri.length > 2 && sApp.redirectUris.length > 2;
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.checkSaveEnabled() && this.save();
    };

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.onChange('logoUri');
        let app = Object.assign({}, this.state.app);
        delete app.logoFile;
        this.setState({app});
    };

    createManifest = () => {
        let clientJSON = JSON.parse(this.props.app.clientJSON);
        let manifest = {
            software_id: this.props.app.softwareId,
            client_name: this.props.app.clientName,
            client_uri: this.props.app.clientUri,
            logo_uri: this.props.app.logoUri,
            launch_url: this.props.app.launchUri,
            redirect_uris: clientJSON.redirectUris,
            scope: clientJSON.scope.join(' '),
            token_endpoint_auth_method: clientJSON.tokenEndpointAuthMethod,
            grant_types: clientJSON.grant_types,
            fhirVersions: this.props.app.fhirVersions,
            briefDescription: this.props.app.briefDescription,
            samplePatients: this.props.app.samplePatients
        };

        let element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest)));
        element.setAttribute('download', `${this.props.app.clientName}.manifest.json`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    clone = () => {
        let app = Object.assign({}, this.state.app);
        app.clientName = `Copy of ${app.clientName}`;
        this.setState({clone: true, isReplica: false, app});
        this.loadImageFromWeb();
    };

    launchBlur = () => {
        let app = Object.assign({}, this.state.app);
        if (this.state.app.launchUri.substring(0, 4) === 'http' && app.redirectUris.length === 0) {
            let pathArray = this.state.app.launchUri.split('/');
            let protocol = pathArray[0];
            let host = pathArray[2];
            let url = protocol + '//' + host;
            app.redirectUris = url;
            this.setState({app});
        } else if (app.redirectUris.length === 0) {
            let pathArray = this.state.app.launchUri.split('/');
            app.redirectUris = pathArray[0];
            this.setState({app});
        }
    };

    handleLaunch = () => {
        this.setState({modalOpen: true});
    };

    handleClose = () => {
        this.setState({modalOpen: false});
        this.props.onClose();
    };

    delete = () => {
        this.props.onDelete && this.props.onDelete();
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                let app = Object.assign({}, this.state.app);
                app.logoUri = e.target.result;
                app.logoFile = input.files[0];
                let changes = this.state.changes.slice();
                changes.indexOf('logo') === -1 && changes.push('image');
                this.setState({app, changes})
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    loadImageFromWeb = () => {
        let request = new XMLHttpRequest();
        request.responseType = "blob";
        request.onload = () => {
            let app = Object.assign({}, this.state.app);
            app.logoFile = request.response;
            this.setState({app});
        };

        request.open("GET", this.state.app.logoUri);
        request.send();
    };

    onChange = (prop, val) => {
        let app = this.state.app || this.props.app || {};
        app[prop] = val;

        let changes = this.state.changes.slice();
        let index = changes.indexOf(prop);

        if (index >= 0) {
            changes.splice(index, 1);
        }

        if (this.props.app && this.state.originalApp[prop] !== val) {
            changes.push(prop);
            prop === 'logoUri' && changes.push('image');
        }

        this.setState({app, changes});
    };

    save = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.app, this.state.changes, this.state.clone);
    };
}

export default withTheme(AppDialog);
