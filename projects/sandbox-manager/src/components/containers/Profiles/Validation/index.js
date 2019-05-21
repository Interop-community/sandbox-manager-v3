import React, { Component } from 'react';
import { Tabs, Tab, TextField, RaisedButton } from 'material-ui';
import ListIcon from 'material-ui/svg-icons/action/list';
import TreeBrowser from '../TreeBrowser';
import Modal from './Modal';

import './styles.less';

class Validation extends Component {
    constructor (props) {
        super(props);

        this.state = {
            query: '',
            activeTab: 'browse'
        }
    }

    render () {
        let palette = this.props.palette;
        let tab = this.state.activeTab;
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        let styleProps = { underlineFocusStyle, floatingLabelFocusStyle };
        let validateDisabled = (this.state.activeTab === 'browse' && this.state.query.length <= 5)
            || (this.state.activeTab === 'existing' && this.state.query.length <= 5)
            || (this.state.activeTab === 'file' && !this.state.file)
            || (this.state.activeTab === 'json-input' && this.state.manualJson.length <= 5);
        let iconStyle = { color: palette.primary3Color, position: 'relative', top: '7px' };

        return <div className='validation-wrapper'>
            <Tabs className='validation-tabs' contentContainerClassName={`validation-tabs-container ${this.state.activeTab === 'browse' ? 'no-padding' : ''}`}
                  inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }} value={this.state.activeTab}>
                <Tab label={<span><ListIcon style={iconStyle}/> Browse</span>}
                     className={'manual-input tab' + (tab === 'browse' ? ' active' : '')} onActive={() => this.setActiveTab('browse')} value='browse'>
                    <TreeBrowser selectedPersona={this.state.selectedPersona} query={this.state.query} onToggle={query => this.toggleTree(query)}
                                 selectPatient={this.selectPatient} cleanResults={this.props.cleanValidationResults}/>
                </Tab>
                <Tab label={<span><ListIcon style={iconStyle}/> URI</span>}
                     className={'manual-input tab' + (tab === 'existing' ? ' active' : '')} onActive={() => this.setActiveTab('existing')} value='existing'>
                    <div>
                        <div className='tab-title'>Existing resource uri</div>
                        <TextField fullWidth id='query' {...styleProps} onChange={(_, query) => this.setState({ query, manualJson: '', file: '', fileJson: '' })}
                                   hintText='Patient/smart-613876' value={this.state.query}/>
                    </div>
                </Tab>
                <Tab label={<span><ListIcon style={iconStyle}/> File</span>}
                     className={'manual-input tab' + (tab === 'file' ? ' active' : '')} onActive={() => this.setActiveTab('file')} value='file'>
                    <div>
                        <input value='' type='file' id='file' ref='file' style={{ display: 'none' }} onChange={this.readFile} accept='application/json'/>
                        <div className='tab-title'>Validate resource from file</div>
                        <div style={{ textAlign: 'center' }}>
                            <RaisedButton label='Select file' primary onClick={() => this.refs.file.click()}/>
                        </div>
                        {this.state.file && <div><span className='subscript'>File: {this.state.file}</span></div>}
                    </div>
                </Tab>
                <Tab label={<span><ListIcon style={iconStyle}/> JSON</span>}
                     className={'manual-input tab' + (tab === 'json-input' ? ' active' : '')} onActive={() => this.setActiveTab('json-input')} value='json-input'>
                    <div>
                        <span className='tab-title'>JSON</span>
                        <div style={{ textAlign: 'center' }}>
                            <RaisedButton className='clear-json-button' disabled={!this.state.manualJson} label='CLEAR' primary onClick={() => this.setState({ manualJson: '' })}/>
                        </div>
                        <TextField className='manual-input' hintText='Paste fhir resource json here' {...styleProps} multiLine fullWidth value={this.state.manualJson}
                                   onChange={(_, manualJson) => this.setState({ query: '', file: '', fileJson: '', manualJson })}/>
                    </div>
                </Tab>
            </Tabs>
            {this.state.validationModalVisible && <Modal {...this.props} close={this.toggleValidationModal}/>}
            <RaisedButton className='validate-button' label='Validate' primary onClick={this.toggleValidationModal} disabled={validateDisabled}/>
        </div>
    }

    toggleValidationModal = () => {
        this.setState({ validationModalVisible: !this.state.validationModalVisible });
    };

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab, query: '', manualJson: '', fileJson: '', file: '', selectedPersona: undefined });
    };

    selectPatient = (selectedPersona) => {
        this.setState({ selectedPersona });
    };

    toggleTree = (query) => {
        query = this.state.query !== query ? query : '';
        this.setState({ query, manualJson: '', file: '', fileJson: '' });
    };

    readFile = () => {
        let fr = new FileReader();
        let file = this.refs.file.files.item(0);

        fr.onload = (e) => {
            let fileJson = e.target.result;
            this.setState({ query: '', manualJson: '', fileJson, file: file.name });
        };

        fr.readAsText(file);
    };

    validate = () => {
        let manualJSON = this.state.fileJson || this.state.manualJson;
        manualJSON && (manualJSON = this.prepareJSON(JSON.parse(manualJSON)));
        manualJSON && this.props.validate(manualJSON);
        !manualJSON && this.state.query && this.props.validateExisting(this.state.query, this.state.selectedProfile);
        this.state.activeTab === 'browse' && this.setState({ query: '' });
    };

    prepareJSON = (json) => {
        if (!json.resourceType) {
            this.props.setGlobalError('No "resourceType" found in the provided object!');
            return;
        }

        if (this.state.selectedProfile) {
            let type = json.resourceType;
            let SD = this.props.sds.find(i => i.profileType === type);

            if (!SD) {
                this.props.setGlobalError(`Unable to validate resource "${type}" against this profile.`);
                return;
            }

            !json.meta && (json.meta = {});
            json.meta.profile = [SD.fullUrl];
        }
        return json;
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}

export default Validation;

{
    /*<Page title={<span>Profiles</span>}>
        <div className='profiles-wrapper'>
            <Card className='card profile-list-wrapper'>
                <CardTitle className='card-title'>
                    <span>Profiles</span>
                </CardTitle>
            </Card>
            <Card className='card validate-card'>
                <CardTitle className='card-title'>
                    <span>Validation target</span>
                </CardTitle>
            </Card>
            <Card className='card result-card'>
                <CardTitle className='card-title'>
                    <span>Validation result {this.props.validationResults && typeButton}</span>
                    <span className='validate-by-title'>
                                {this.props.validationResults && <span>Validated <strong>{this.props.validationResults.validatedObject}</strong> </span>}
                        {this.props.validationResults && this.props.validationResults.validatedProfile
                            ? <span>against <strong>{profile.profileName}</strong></span>
                            : ''}
                            </span>
                </CardTitle>
                <div className='validate-result-wrapper'>
                    {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                    {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                    {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
                </div>
            </Card>
        </div>
    </Page>*/
}
