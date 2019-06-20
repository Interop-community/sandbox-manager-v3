import React, { Component, Fragment } from 'react';
import { RaisedButton, Paper, Dialog, IconButton, FloatingActionButton, TextField, List, Tab, Tabs, ListItem, Checkbox, Table, TableRow, TableHeader, TableHeaderColumn, TableBody, TableRowColumn, Toggle }
    from 'material-ui';
import DeleteIcon from "material-ui/svg-icons/action/delete";
import ContentAdd from 'material-ui/svg-icons/content/add';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import HooksIcon from "svg-react-loader?name=Patient!sandbox-manager-lib/icons/hooks-logo-mono.svg";
import ReactJson from 'react-json-view';

import './styles.less';

class AppDialog extends Component {
    constructor (props) {
        super(props);

        let logoURI = props.hook ? props.hook.logoUri : '';

        this.state = {
            showJSON: false,
            hasChanged: false,
            showDefinitions: false,
            activeTab: 'parsed',
            logoURI,
            contexts: {},
            selectedForManualDefinition: {}
        }
    }

    render () {
        let paperClasses = 'hook-dialog' + (this.props.hook ? '' : ' custom');
        let hasNext = this.state.currentDefinitionIndex + 1 < Object.keys(this.state.selectedForManualDefinition).length;
        let hasBack = this.state.currentDefinitionIndex - 1 >= 0;
        let nextCallback = hasNext ? () => this.setState({ currentDefinitionIndex: this.state.currentDefinitionIndex + 1 }) : this.load;
        let backCallback = hasBack
            ? () => this.setState({ currentDefinitionIndex: this.state.currentDefinitionIndex - 1 })
            : () => this.setState({ showDefinitions: false, selectedForManualDefinition: {} });

        let actions = this.props.hook
            ? undefined
            : !this.state.showDefinitions
                ? [
                    <RaisedButton key={1} label='Skip' secondary onClick={this.props.onClose}/>,
                    <RaisedButton key={0} label='Define' primary disabled={!Object.keys(this.state.selectedForManualDefinition).length} onClick={this.toggleDefinitions}/>
                ]
                : [
                    <RaisedButton key={1} label='Back' secondary onClick={backCallback}/>,
                    <RaisedButton key={0} label={hasNext ? 'Next' : 'Load'} primary onClick={nextCallback}/>
                ];

        return <Dialog paperClassName={paperClasses} modal={true} open={!!this.props.open} onRequestClose={this.props.onClose} actionsContainerClassName='app-dialog-actions-wrapper'
                       actions={actions}>
            <Paper className='paper-card'>
                <IconButton style={{ color: this.props.muiTheme.palette.primary5Color }} className="close-button" onClick={this.handleClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h3>{!!this.props.hook ? 'CDS Service Info' : 'Unsupported hooks'}</h3>
                <div className='paper-body'>
                    {this.getModalContent()}
                </div>
            </Paper>
        </Dialog>
    }

    getModalContent = () => {
        let palette = this.props.muiTheme.palette;
        let hook = Object.assign({}, this.props.hook);
        hook.id = hook.hookId;
        delete hook.hookId;
        delete hook.cdsServiceEndpointId;
        delete hook.url;
        delete hook.logoUri;

        return this.props.hook
            ? <Tabs className='info-tabs' contentContainerClassName='info-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}
                    value={this.state.activeTab}>
                <Tab label='Rendering' className={'parsed tab' + (this.state.activeTab === 'parsed' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'parsed' })} value='parsed'>
                    <Fragment>
                        <div className='hook-info-wrapper'>
                            <TextField fullWidth value={this.props.hook.hook} disabled={true} floatingLabelText='Hook'/>
                            <TextField fullWidth value={this.props.hook.title} disabled={true} floatingLabelText='Title'/>
                            <TextField fullWidth value={this.props.hook.description} disabled={true} floatingLabelText='Description'/>
                            <TextField fullWidth value={this.props.hook.hookId} disabled={true} floatingLabelText='Id'/>
                            {!!this.props.hook.prefetch && <div className='prefetch-title'>Prefetch</div>}
                            {!!this.props.hook.prefetch && Object.keys(this.props.hook.prefetch).map(key => {
                                return <TextField key={key} fullWidth value={this.props.hook.prefetch[key]} disabled={true} floatingLabelText={key}/>;
                            })}
                        </div>
                        <form className='image-form'>
                            <div className='image-button-wrapper'>
                                <RaisedButton label='Select Image' onClick={() => this.refs.image.click()}/>
                                <div>
                                    <span className='subscript'>(Display size 300px W X 200px H)</span>
                                </div>
                                <div>
                                    <span className='subscript'>For best retina experience we recommend pictures with size: 600px X 400px</span>
                                </div>
                            </div>
                            <div className='image-wrapper'>
                                <input ref='image' type='file' style={{ 'display': 'none' }} onChange={this.onFileInput}/>
                                {!this.state.logoURI && <HooksIcon className='default-hook-icon'/>}
                                {this.state.logoURI && <img style={{ height: '100%' }} src={this.state.logoURI}/>}
                            </div>
                            {this.state.logoURI &&
                            <FloatingActionButton onClick={this.removeImage} mini className='remove-image-button' backgroundColor={this.props.muiTheme.palette.primary4Color}>
                                <DeleteIcon/>
                            </FloatingActionButton>}
                        </form>
                        <div className='save-btn-wrapper'>
                            <RaisedButton className='save-btn' primary label='Save' onClick={this.save} disabled={!this.state.hasChanged}/>
                        </div>
                    </Fragment>
                </Tab>
                <Tab label='JSON' className={'json tab' + (this.state.activeTab === 'json' ? ' active' : '')} onActive={() => this.setState({ activeTab: 'json' })} value='json'>
                    <ReactJson src={hook} name={false}/>
                </Tab>
            </Tabs>
            : !this.state.showDefinitions
                ? <div className='custom-hooks-body'>
                    <p>
                        The following hooks provided by the service are not supported:
                    </p>
                    <div>
                        <List>
                            {this.props.tmpServiceState.cdsHooks.map(hook => !hook.isSupported &&
                                <ListItem key={hook.hookId} leftCheckbox={<Checkbox onCheck={() => this.toggleCustom(hook)}/>} primaryText={`${hook.title} (${hook.hookId})`} secondaryText={hook.description}/>)}
                        </List>
                    </div>
                    <p>
                        Please select the ones that you would like to define manually.
                    </p>
                </div>
                : <div className='custom-hooks-body'>
                    <div className='context-table-wrapper'>
                        {this.getActionButton()}
                        <Table selectable={false}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false} className='context-table-header'>
                                <TableRow>
                                    <TableHeaderColumn colSpan="8" className='table-title'>Contexts for {this.state.hooksToDefine[this.state.currentDefinitionIndex].title}</TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                    <TableHeaderColumn>Required</TableHeaderColumn>
                                    <TableHeaderColumn>Prefetch</TableHeaderColumn>
                                    <TableHeaderColumn>Type</TableHeaderColumn>
                                    <TableHeaderColumn colSpan="3">Description</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    Object.keys(this.state.hooksToDefine[this.state.currentDefinitionIndex].context).map(contextId => {
                                            let context = this.state.hooksToDefine[this.state.currentDefinitionIndex].context[contextId];
                                            return <TableRow key={contextId}>
                                                <TableRowColumn>
                                                    {contextId ? contextId : <TextField floatingLabelText='ID*' onChange={(_, val) => this.updateNewContext('id', val)}/>}
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <Toggle toggled={context.required} onToggle={(_, val) => !contextId && this.updateNewContext('required', val)}/>
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <Toggle toggled={context.prefetch} onToggle={(_, val) => !contextId && this.updateNewContext('prefetch', val)}/>
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    {contextId ? context.type : <TextField value={context.type} floatingLabelText='Type*' onChange={(_, val) => this.updateNewContext('type', val)}/>}
                                                </TableRowColumn>
                                                <TableRowColumn colSpan="3" className='description-value'>
                                                    {contextId ? context.description :
                                                        <TextField value={context.description} floatingLabelText='Description' onChange={(_, val) => this.updateNewContext('description', val)}/>}
                                                </TableRowColumn>
                                            </TableRow>
                                        }
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
    };

    updateNewContext = (prop, value) => {
        let contexts = this.state.hooksToDefine.slice();
        contexts[this.state.currentDefinitionIndex].context[''][prop] = value;
        this.setState({ hooksToDefine: contexts });
    };

    toggleDefinitions = () => {
        let hooksToDefine = [];
        this.props.tmpServiceState.cdsHooks.map(hook => {
            if (!hook.isSupported) {
                hook.context = {
                    userId: {
                        required: true,
                        prefetch: true,
                        type: 'string',
                        description: 'The id of the current user.'
                    },
                    patientId: {
                        required: true,
                        prefetch: true,
                        type: 'string',
                        description: 'The FHIR Patient.id of the current patient '
                    }
                };
                hooksToDefine.push(hook);
            }
        });
        this.setState({ showDefinitions: true, hooksToDefine, currentDefinitionIndex: 0 });
    };

    getActionButton = () => {
        let newContext = this.state.hooksToDefine[this.state.currentDefinitionIndex].context[''];
        let canAdd = newContext && (!newContext.id || newContext.id.length < 2 || !newContext.type || newContext.type.length < 2);
        let disabled = this.state.addingContext ? canAdd : false;

        let onClick = this.state.addingContext ? () => this.addCurrentContext() : () => this.addNewContext();

        return <FloatingActionButton className='context-action-button' disabled={disabled} onClick={onClick}>
            {this.state.addingContext
                ? <CheckIcon/>
                : <ContentAdd/>}
        </FloatingActionButton>
    };

    addCurrentContext = () => {
        let contexts = this.state.hooksToDefine.slice();
        let newContext = contexts[this.state.currentDefinitionIndex].context[''];
        let id = newContext.id;
        delete newContext.id;
        contexts[this.state.currentDefinitionIndex].context[id] = newContext;
        delete contexts[this.state.currentDefinitionIndex].context[''];
        this.setState({ addingContext: false, hooksToDefine: contexts });
    };

    addNewContext = () => {
        let contexts = this.state.hooksToDefine.slice();
        contexts[this.state.currentDefinitionIndex].context[''] = {};
        this.setState({ addingContext: true, hooksToDefine: contexts });
    };

    toggleCustom = (hook) => {
        let selectedForManualDefinition = Object.assign({}, this.state.selectedForManualDefinition);
        !!selectedForManualDefinition[hook.hookId]
            ? delete selectedForManualDefinition[hook.hookId]
            : (selectedForManualDefinition[hook.hookId] = hook);

        this.setState({ selectedForManualDefinition });
    };

    removeImage = () => {
        let input = this.refs.image;
        input.value = '';
        this.setState({ logoURI: undefined, hasChanged: true });
    };

    handleClose = () => {
        this.setState({ modalOpen: false });
        this.props.onClose();
    };

    onFileInput = () => {
        let input = this.refs.image;
        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                this.setState({ logoURI: e.target.result, hasChanged: true })
            };

            reader.readAsDataURL(input.files[0]);
        }
    };

    save = () => {
        let input = this.refs.image;
        this.props.onSubmit && this.props.onSubmit(this.props.hook.id, input.files[0]);
    };
}

export default AppDialog;
