import React, { Component } from 'react';
import SandboxDetails from './SandboxDetails';
import SandboxReset from './SandboxReset';
import DeleteSandbox from './DeleteSandbox';
import { app_setScreen, resetCurrentSandbox, deleteCurrentSandbox } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { bindActionCreators } from "redux";
import { CircularProgress, Tab, Tabs } from 'material-ui';

import './styles.less';

class Settings extends Component {

    componentWillMount () {
        this.props.app_setScreen('settings');
    }


    render () {
        return <div className='settings-wrapper'>
            {!this.props.resetting
                ? <Tabs className='settings-tabs' contentContainerClassName='settings-tabs-container'>
                    <Tab label="Sandbox Details" className='sandbox-details-tab'>
                        <SandboxDetails sandbox={this.props.sandbox} />
                    </Tab>
                    <Tab label="Sandbox Reset">
                        <SandboxReset sandbox={this.props.sandbox} resetCurrentSandbox={this.props.resetCurrentSandbox} />
                    </Tab>
                    <Tab label="Sandbox Delete">
                        <DeleteSandbox sandbox={this.props.sandbox} deleteCurrentSandbox={this.props.deleteCurrentSandbox} />
                    </Tab>
                </Tabs>
                : <div className='loader-wrapper'>
                    <p>
                        Resetting sandbox settings
                    </p>
                    <CircularProgress size={80} thickness={5} />
                </div>}
        </div>;
    };
}


const mapStateToProps = state => {
    return {
        sandbox: state.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId),
        resetting: state.sandbox.resetting
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, resetCurrentSandbox, deleteCurrentSandbox }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Settings));
