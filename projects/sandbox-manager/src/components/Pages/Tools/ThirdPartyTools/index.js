import { Button, Card, CardMedia, Dialog, DialogActions } from '@material-ui/core';
import React, { Component } from 'react';

const TOOLS = [
    {
        title: 'clinFHIR',
        description: 'Tool to create or search for FHIR-based resources and link them to tell a clinical story.',
        image: '/img/icon-fhir.png',
        link: 'http://clinfhir.com'
    },
    {
        title: 'Inferno',
        description: 'Testing suite for FHIR to help developers implement the FHIR standard.',
        image: '/img/inferno_logo.png',
        link: 'https://inferno.healthit.gov/inferno/',
        larger: true
    },
    {
        title: 'Inferno (Community Edition)',
        description: 'Testing suite for FHIR to help developers implement the FHIR standard.',
        image: '/img/inferno_community.png',
        link: 'https://inferno.healthit.gov/community',
        larger: true
    },
    {
        title: 'Crucible',
        description: 'Testing suite to test for conformance to the FHIR standard.',
        image: '/img/crucible_logo.png',
        link: 'https://projectcrucible.org/'
    },
    {
        title: 'CDS Hooks Sandbox',
        description: 'Test harness for CDS Hook-based services',
        image: '/img/cds_hooks_logo.png',
        link: 'https://sandbox.cds-hooks.org/'
    },
    {
        title: 'LEAP CMS and UI',
        description: 'Demo app to experience the leap LEAP Consent Management Service and UI',
        image: '/img/healthit-logo.png',
        link: 'https://leap-gui-yop7t2tkfq-uc.a.run.app/login'
    }

];

import './styles.less';

class ThirdPartyTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    render() {
        let titleStyle = {backgroundColor: 'rgba(71, 132, 84, 0.75)'};

        return <div>
            <Dialog open={!!this.state.showModal} onClose={() => this.setState({showModal: false})} classes={{paper: 'settings-dialog'}}>
                <div>
                    <p>The default app "CDS HOOKS" is missing from this sandbox. Instead of launching it you are being redirected to the standard CDS HOOKS SANDBOX link.</p>
                </div>
                <DialogActions>
                    <div className='modal-bottom-actions-wrapper'>
                        <Button variant='contained' color='primary' onClick={() => this.setState({showModal: false})}>
                            Close
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
            <a ref='openLink' target='_blank'/>
            <div className='third-party-tools'>
                {TOOLS.map(t =>
                    <Card title={t.title} className='tool-card' onClick={() => this.openLink(t)} key={t.link}>
                        <CardMedia className={`media-wrapper${t.larger ? ' larger' : ''}`} image={t.image}>
                            <span/>
                        </CardMedia>
                        <div className='card-title' style={titleStyle}>
                            <h3 className='tool-name'>{t.title}</h3>
                            <div className='tool-description'>{t.description}</div>
                        </div>
                    </Card>
                )}
            </div>
        </div>;
    }

    openLink = (tool) => {
        let link = tool.link;
        let isHooks = link === 'https://sandbox.cds-hooks.org/';
        let hooks = (this.props.apps || []).find(app => app.clientId === "48163c5e-88b5-4cb3-92d3-23b800caa927");

        if (isHooks && hooks) {
            this.props.launch(hooks, this.props.patient.id, this.props.user);
        } else {
            isHooks && this.setState({showModal: true});
            let url = encodeURI(this.props.serviceUrl.replace('/data', '/open/'));
            let name = encodeURI(this.props.name);
            if (tool.title === 'clinFHIR' && this.props.isOpen) {
                link = `${tool.link}/?data=${url}&conf=${url}&term=${url}&dataname=${name}&confname=${name}&termname=${name}`;
            }

            if (tool.title === 'Inferno (Community Edition)' && this.props.tools.inferno_community != '' ) {
                link = this.props.tools.inferno_community
            }

            if (tool.title === 'LEAP CMS and UI' && this.props.tools.leap_cms_ui != '' ) {
                link = this.props.tools.leap_cms_ui
            }

            let openLink = this.refs.openLink;
            openLink.href = link;
            openLink.click();
        }
    }
}

export default ThirdPartyTools;
