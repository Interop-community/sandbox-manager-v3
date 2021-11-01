import React, { Component } from 'react';
import { Divider, Typography, Menu, MenuItem, Button, Paper, Dialog } from '@material-ui/core';
import ActionHelp from "@material-ui/icons/Help";

import './styles.less';

export default class Help extends Component {
    constructor(props) {
        super(props);

        this.state = {
            help: null,
            showHelpDropdown: false,
            showTerms: false,
            anchorEl: undefined
        }
    }

    render() {
        return <div className='help-wrapper'>
            <Dialog open={this.state.showTerms} onClose={this.toggleTerms} contentClassName='terms-dialog' actionsContainerClassName='terms-dialog-actions'
                actions={[<Button variant='outlined' primary label='View PDF' onClick={this.openPDF} />, <Button variant='outlined' secondary label='Close' onClick={this.toggleTerms} />]}>
                <Paper className='paper-card'>
                    <h3>Terms of Use & Privacy Statement</h3>
                    {this.props.terms && <div className='paper-body' dangerouslySetInnerHTML={{ __html: this.props.terms.value }} />}
                </Paper>
            </Dialog>
            <div className='right'>
                <a className={this.state.showHelpDropdown ? 'active' : ''} onClick={this.handleUserDropdown} data-qa='header-help-button'>
                    <ActionHelp style={{ fill: this.props.theme.p9 }} />
                </a>
                <div className='anchor' ref='anchor' />
            </div>
            {this.state.showHelpDropdown && !!this.state.anchorEl &&
                <Menu className='help-menu' width='200px' open={true} anchorEl={this.state.anchorEl} onClose={this.handleUserDropdown}>
                    {/* <a href='https://www.developers.interop.community/' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://www.developers.interop.community/')}>
                            Developers Portal
                        </MenuItem>
                    </a> */}
                    <Divider />
                    <MenuItem className='help-menu-item disabled' disabled>
                        Documentation
                    </MenuItem>
                    <a href='https://github.com/Interop-community/meld-documentation' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://github.com/Interop-community/meld-documentation')}>
                            Meld Sandbox Docs
                        </MenuItem>
                    </a>
                    {/* <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')}>
                            Code Samples
                        </MenuItem>
                    </a>
                    <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')}>
                            Tutorials
                        </MenuItem>
                    </a>
                    <a href='http://hl7.org/fhir/' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('http://hl7.org/fhir/')}>
                            HL7 FHIR
                        </MenuItem>
                    </a>
                    <a href='#' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item'
                            onClick={() => {
                                this.props.history.push('/' + sessionStorage.sandboxId + '/integration');
                                this.handleUserDropdown();
                            }}>
                            EHR Integration Guide
                        </MenuItem>
                    </a> */}
                    <Divider />
                    <MenuItem className='help-menu-item disabled' disabled>
                        Support
                    </MenuItem>
                    <a href='https://github.com/Interop-community/meld-documentation/wiki/Frequently-Asked-Questions' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://github.com/Interop-community/meld-documentation/wiki/Frequently-Asked-Questions')}>
                            FAQ
                        </MenuItem>
                    </a>
                    <a href='https://interopcommunity.slack.com/join/shared_invite/zt-xru6oe6d-6EZmaSylTokCwmpBJLpY~Q#/shared-invite/email' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://interopcommunity.slack.com/join/shared_invite/zt-xru6oe6d-6EZmaSylTokCwmpBJLpY~Q#/shared-invite/email')}>
                            Slack
                        </MenuItem>
                    </a>
                    {/* <a href='https://groups.google.com/a/interop.community/forum/#!forum/developer' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://groups.google.com/a/interop.community/forum/#!forum/developer')}>
                            Developer Forum
                        </MenuItem>
                    </a> */}
                    <a href='https://github.com/Interop-community/meld-documentation/wiki/Help-Desk-Information' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://github.com/Interop-community/meld-documentation/wiki/Help-Desk-Information')}>
                            Help Desk
                        </MenuItem>
                    </a>
                    {/* <a href='https://healthservices.atlassian.net/wiki/spaces/HSM/overview' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSM/overview')}>
                            Maintenance Info
                        </MenuItem>
                    </a> */}
                    <a href='#' onClick={e => e.preventDefault()} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MenuItem className='help-menu-item' onClick={this.toggleTerms}>
                            Terms of Use & Privacy Statement
                        </MenuItem>
                    </a>
                </Menu>}
        </div>;
    };

    openLink = (link) => {
        window.open(link, '_blank');
        this.handleUserDropdown();
    };

    handleUserDropdown = (event = {}) => {
        this.setState({
            showHelpDropdown: !this.state.showHelpDropdown,
            anchorEl: event.currentTarget
        });
    };

    toggleTerms = () => {
        !this.state.showTerms && this.props.loadTerms();
        this.setState({ showTerms: !this.state.showTerms });
    };
}
