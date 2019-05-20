import React, { Component } from 'react';
import { Tabs, Tab, TextField, RaisedButton } from 'material-ui';
import ListIcon from 'material-ui/svg-icons/action/list';
import TreeBrowser from '../TreeBrowser';

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
            <RaisedButton className='validate-button' label='Validate' primary onClick={this.validate} disabled={validateDisabled}/>
        </div>
    }

    setActiveTab = (tab) => {
        this.props.cleanValidationResults();
        this.setState({ activeTab: tab, query: '', manualJson: '', fileJson: '', file: '', selectedPersona: undefined });
    };

    selectPatient = (selectedPersona) => {
        this.setState({ selectedPersona });
    };
}

export default Validation;
