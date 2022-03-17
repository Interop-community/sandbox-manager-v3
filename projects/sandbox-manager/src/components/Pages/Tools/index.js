import React, {Component} from 'react';
import {Tabs, Tab} from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validate, validateExisting, loadProfilesBySD, loadQueryObject, getDefaultUserForSandbox, doLaunch, fetchPersonas
} from '../../../redux/action-creators';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import ThirdPartyTools from "./ThirdPartyTools";
import Validation from "./Validation";

import './styles.less';

class Tools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'validation'
        };
    }

    componentDidMount() {
        this.props.app_setScreen('tools');
        this.props.getDefaultUserForSandbox(sessionStorage.sandboxId);
        this.props.fetchPersonas('Patient');
    }

    render() {
        return <div className='tools page-content-wrapper'>
            <Tabs className='tools-tabs' value={this.state.activeTab} onChange={(_e, activeTab) => this.setState({activeTab})}>
                <Tab label='Validation' id='validation' value='validation'/>
                <Tab label='Other tools' id='tools' value='tools'/>
            </Tabs>
            {this.state.activeTab === 'tools' && <ThirdPartyTools serviceUrl={this.props.serviceUrl} isOpen={this.props.isOpen} name={this.props.sandboxName} apps={this.props.apps}
                                                                  launch={this.props.doLaunch} user={this.props.defaultUser} patient={this.props.patient} tools={this.props.tools}/>}
            {this.state.activeTab === 'validation' && <Validation {...this.props}/>}
        </div>
    }
}

const mapStateToProps = state => {
    let sandbox = state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId);
    let isOpen = sandbox ? !!sandbox.allowOpenAccess : false;
    return {
        isOpen,
        apps: state.apps.apps,
        sandboxName: sandbox.name,
        defaultUser: state.sandbox.defaultUser,
        profiles: state.fhir.profilesByDefinition,
        profilesLoading: state.fhir.profilesLoading,
        patient: state.persona.patients[0],
        validationExecuting: state.fhir.validationExecuting,
        validationResults: state.fhir.validationResults,
        loadProfilesBySD: state.fhir.loadProfilesBySD,
        queryObject: state.fhir.queryObject,
        fetchingProfilesByDefinition: state.fhir.fetchingProfilesByDefinition,
        serviceUrl: state.fhir.smart.data.server && state.fhir.smart.data.server.serviceUrl,
        tools: state.config.xsettings.data.tools
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    app_setScreen, loadRelativeProfiles, loadResource, loadProfiles, validateExisting, validate, loadProfilesBySD, loadQueryObject,
    getDefaultUserForSandbox, doLaunch, fetchPersonas
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Tools));
