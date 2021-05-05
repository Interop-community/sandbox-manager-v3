import React, { Component } from 'react';

import { IconButton } from '@material-ui/core';

import './styles.less';

class SandboxReset extends Component {

    render () {
        let titleStyle = {
            backgroundColor: this.props.theme.p4,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <div className='reset-wrapper'>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onClose}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h1 style={titleStyle}>RESET SANDBOX</h1>
            </div>
            <div className='reset-content'>
                <p>Sorry, but the reset function is temporarily unavailable. Please see <a href="https://groups.google.com/a/interop.community/forum/#!topic/developer/9ogbORZLCn4" target="_blank">this announcement</a> for more information.</p>
                {/*<p>Resetting the sandbox will delete:</p>*/}
                {/*<ul>*/}
                    {/*<li>All FHIR data</li>*/}
                    {/*<li>Launch scenarios</li>*/}
                    {/*<li>Personas</li>*/}
                {/*</ul>*/}
                {/*<p>This is NOT reversible!</p>*/}
                {/*<p>Unaffected:</p>*/}
                {/*<ul>*/}
                    {/*<li>Registered apps</li>*/}
                    {/*<li>Sandbox members</li>*/}
                {/*</ul>*/}
                {/*<Checkbox label='Import sample patients and practitioners' onCheck={(_e, defaultData) => this.props.toggleSampleData(defaultData)} labelStyle={{ color: this.props.theme.p2 }}*/}
                          {/*iconStyle={{fill: this.props.theme.p2}}/>*/}
                {/*{this.props.sandbox &&*/}
                {/*<Checkbox label={'Are you sure you want to reset sandbox ' + this.props.sandbox.name + '?'} iconStyle={{fill: this.props.theme.p2}}*/}
                          {/*onCheck={(_e, reset) => this.props.toggleReset(reset)} labelStyle={{ color: this.props.theme.p2 }} />}*/}
            </div>
        </div>;
    }
}


export default SandboxReset;
