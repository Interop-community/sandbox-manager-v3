import React, {Component} from 'react';
import {Divider, Typography, Menu, MenuItem, Button, Paper, Dialog} from '@material-ui/core';
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
                    <ActionHelp style={{fill: this.props.theme.p8}}/>
                </a>
                <div className='anchor' ref='anchor'/>
            </div>
            {this.state.showHelpDropdown && !!this.state.anchorEl &&
            <Menu className='help-menu' width='200px' open={true} anchorEl={this.state.anchorEl} onClose={this.handleUserDropdown}>
                <a href='https://www.developers.logicahealth.org/' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://www.developers.logicahealth.org/')}>
                        Developers Portal
                    </MenuItem>
                </a>
                <Divider/>
                <MenuItem className='help-menu-item disabled' disabled>
                    Documentation
                </MenuItem>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/64585866/HSPC+Sandbox')}>
                        Logica Sandbox Docs
                    </MenuItem>
                </a>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')}>
                        Code Samples
                    </MenuItem>
                </a>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/60555273/Samples')}>
                        Tutorials
                    </MenuItem>
                </a>
                <a href='http://hl7.org/fhir/' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('http://hl7.org/fhir/')}>
                        HL7 FHIR
                    </MenuItem>
                </a>
                <a href='#' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item'
                              onClick={() => {
                                  this.props.history.push('/' + sessionStorage.sandboxId + '/integration');
                                  this.handleUserDropdown();
                              }}>
                        EHR Integration Guide
                    </MenuItem>
                </a>
                <Divider/>
                <MenuItem className='help-menu-item disabled' disabled>
                    Support
                </MenuItem>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/61767707/FAQs' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/61767707/FAQs')}>
                        FAQ
                    </MenuItem>
                </a>
                <a href='https://groups.google.com/a/logicahealth.org/forum/#!forum/developer' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://groups.google.com/a/logicahealth.org/forum/#!forum/developer')}>
                        Developer Forum
                    </MenuItem>
                </a>
                <a href='https://help.logicahealth.org' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://help.logicahealth.org')}>
                        Help desk
                    </MenuItem>
                </a>
                <a href='https://healthservices.atlassian.net/wiki/spaces/HSM/overview' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem className='help-menu-item' onClick={() => this.openLink('https://healthservices.atlassian.net/wiki/spaces/HSM/overview')}>
                        Maintenance Info
                    </MenuItem>
                </a>
                <a href='#' onClick={e => e.preventDefault()} style={{textDecoration: 'none', color: 'inherit'}}>
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
