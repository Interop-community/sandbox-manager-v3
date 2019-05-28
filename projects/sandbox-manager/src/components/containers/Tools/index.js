import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui';
import Page from 'sandbox-manager-lib/components/Page';
import HelpButton from '../../UI/HelpButton';
import { app_setScreen } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { bindActionCreators } from 'redux';

import './styles.less';

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
        link: 'https://inferno.healthit.gov/inferno/'
    },
    {
        title: 'Crucible',
        description: 'Testing suit to test for conformance to the FHIR standard.',
        image: '/img/crucible_logo.png',
        link: 'https://projectcrucible.org/'
    },
    {
        title: 'CDS Hooks Sandbox',
        description: 'Test harness for CDS Hook-based services',
        image: '/img/cds_hooks_logo.png',
        link: 'https://sandbox.cds-hooks.org/'
    }
];

class Tools extends Component {
    componentDidMount () {
        this.props.app_setScreen('tools');
    }

    render () {
        let titleStyle = { backgroundColor: 'rgba(0,87,120, 0.75)' };

        return <Page title='Third Party Tools' helpIcon={<HelpButton style={{ marginLeft: '10px' }}/>}>
            <a ref='openLink' target='_blank'/>
            <div className='tools'>
                {TOOLS.map(t =>
                    <Card title={t.title} className='tool-card' onClick={() => this.openLink(t.link)} key={t.link}>
                        <CardMedia className='media-wrapper'>
                            <img className='tool-icon' src={t.image}/>
                        </CardMedia>
                        <CardTitle className='card-title' style={titleStyle}>
                            <h3 className='tool-name'>{t.title}</h3>
                            <div className='tool-description'>{t.description}</div>
                        </CardTitle>
                    </Card>
                )}
            </div>
        </Page>
    }

    openLink = (link) => {
        let openLink = this.refs.openLink;
        openLink.href = link;
        openLink.click();
    }
}

const mapStateToProps = state => {
    return {}
};
const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(muiThemeable()(Tools)));
