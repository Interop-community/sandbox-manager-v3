import React, { Component } from 'react';
import { Dialog, Paper, Button } from '@material-ui/core';
import strings from '../../../../assets/strings';
import './styles.less';

export default class Footer extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showTerms: false
        };
    }

    render () {
        return <footer className='footer-wrapper'>
            <Dialog open={this.state.showTerms} onRequestClose={this.toggleTerms} contentClassName='terms-dialog' actionsContainerClassName='terms-dialog-actions'
                    actions={[<Button variant='outlined' primary label='View PDF' onClick={this.openPDF} />, <Button variant='outlined' secondary label='Close' onClick={this.toggleTerms} />]}>
                <Paper className='paper-card'>
                    <h3>Terms of Use & Privacy Statement</h3>
                    {this.props.terms && <div className='paper-body' dangerouslySetInnerHTML={{ __html: this.props.terms.value }} />}
                </Paper>
            </Dialog>
            <div>
                <div className='links-wrapper'>
                    <div>
                        <div>
                            <a href="http://hspconsortium.org" target="_blank">
                            <span>
                                <span>HSPC Official Site</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="http://gallery.hspconsortium.org/" target="_blank">
                            <span>
                                <span>HSPC Gallery</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="http://sandbox.hspconsortium.org/" target="_blank">
                            <span>
                                <span>HSPC Developer's Sandbox</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="https://healthservices.atlassian.net/wiki/" target="_blank">
                            <span>
                                <span>HSPC Confluence</span>
                            </span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                <span>Resources</span>
                            </span>
                        </div>
                        <div>
                            <a href="https://healthservices.atlassian.net/wiki/display/HSPC/For+Developers" target="_blank">
                            <span>
                                <span>HSPC Developer Resources</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="http://docs.smarthealthit.org/" target="_blank">
                            <span>
                            <span>SMART on FHIR Documenation</span>
                            </span>
                            </a>
                        </div>
                        <div>

                            <a href="https://bitbucket.org/hspconsortium/" target="_blank">
                            <span>
                                <span>HSPC BitBucket</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="http://hl7.org/fhir/" target="_blank">
                            <span>
                                <span>HL7 FHIR</span>
                            </span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div>
                        <span>
                            <span>Support</span>
                        </span>
                        </div>
                        <div>
                            <a href="https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer" target="_blank">
                            <span>
                                <span>HSPC Developers Forum</span>
                            </span>
                            </a>
                        </div>
                        <div>
                            <a href="https://healthservices.atlassian.net/secure/RapidBoard.jspa?rapidView=3&amp;view=planning" target="_blank">
                            <span>
                                <span>HSPC JIRA</span>
                            </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <span>
                        <span>HSPC Developers: Powering the Healthcare Innovation Ecosystem</span>
                    </span>
                </div>
            </div>
            <div className='footer-text'>
                <p>
                    {strings.footerLineOne}
                    • <a onClick={this.toggleTerms}>{strings.footerLineTwo}</a>
                    • <a href='https://healthservices.atlassian.net/wiki/spaces/HSM/overview' target='_blank'>{strings.footerLineThree}</a>
                </p>
            </div>
        </footer>
    }

    toggleTerms = () => {
        !this.state.showTerms && this.props.loadTerms();
        this.setState({ showTerms: !this.state.showTerms })
    };

    openPDF = () => {
        window.open('https://content.hspconsortium.org/docs/hspc/privacyterms.pdf', '_blank');
    };
}
