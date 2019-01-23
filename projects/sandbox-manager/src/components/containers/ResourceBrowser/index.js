import React, { Component, Fragment } from 'react';
import { List, Subheader, ListItem, Card, CardTitle, DatePicker, TextField } from 'material-ui';
import { bindActionCreators } from 'redux';
import { getMetadata, app_setScreen, fetchResources } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';

import './styles.less';

const TMP_DEFINITION = {
    "resourceType": "AllergyIntolerance",
    "identifier": ["{ Identifier }"],
    "clinicalStatus": "{ CodeableConcept }",
    "verificationStatus": "{ CodeableConcept }",
    "type": "<code>",
    "category": ["<code>"],
    "criticality": "<code>",
    "code": "{ CodeableConcept }",
    "patient": "{ Reference(Patient) }",
    "encounter": "{ Reference(Encounter) }",
    "onsetDateTime": "<dateTime>",
    "onsetAge": "{ Age }",
    "onsetPeriod": "{ Period }",
    "onsetRange": "{ Range }",
    "onsetString": "<string>",
    "recordedDate": "<dateTime>",
    "recorder": "{ Reference(Practitioner|PractitionerRole|Patient|RelatedPerson) }",
    "asserter": "{ Reference(Patient|RelatedPerson|Practitioner| PractitionerRole) }",
    "lastOccurrence": "<dateTime>",
    "note": ["{ Annotation }"],
    "reaction": [{
        "substance": "{ CodeableConcept }",
        "manifestation": ["{ CodeableConcept }"],
        "description": "<string>",
        "onset": "<dateTime>",
        "severity": "<code>",
        "exposureRoute": "{ CodeableConcept }",
        "note": ["{ Annotation }"]
    }]
};

class ResourceBrowser extends Component {
    constructor (props) {
        super(props);

        this.state = {};
    }

    componentDidMount () {
        this.props.app_setScreen('resource-browser');
        this.props.getMetadata();
    }

    componentWillUpdate (nextProps, nextState) {
        nextState.selectedType !== this.state.selectedType && this.props.fetchResources(nextState.selectedType.type);
    }

    render () {
        return <div className='resource-browser'>
            <div className='resources-wrapper card-with-border'>
                <Card>
                    <CardTitle className='card-title'>
                        Resources
                    </CardTitle>
                    <List className='scrollable'>
                        {this.props.metadata && this.props.metadata.rest[0].resource.map(item => {
                            let text = item.type + (this.props.metadataCounts ? ` (${this.props.metadataCounts[item.type]})` : '');
                            return <ListItem key={item.type} primaryText={text} onClick={() => this.setState({ selectedType: item })}/>
                        })}
                    </List>
                </Card>
            </div>
            <div className='content-wrapper'>
                <div className='resource-search-wrapper'>
                    <Card className='card-with-border'>
                        <CardTitle className='card-title'>
                            Search criteria
                        </CardTitle>
                        <div className='search-crit-wrapper'>
                            {this.state.selectedType && this.state.selectedType.searchParam.map(param => {
                                return <div key={param.name} style={{ width: '300px', display: 'inline-block', overflow: 'hidden' }}>
                                    {param.type === 'date' && <DatePicker id={param.name} hintText={param.name}/>}
                                    {param.type !== 'date' && <TextField className='search-crit-field' id={param.name} floatingLabelText={param.name} hintText={param.documentation}/>}
                                </div>
                            })}
                        </div>
                    </Card>
                </div>
                <div className='resource-results-wrapper'>
                    <Card className='definition-wrapper card-with-border'>
                        <CardTitle className='card-title'>
                            Resource definition
                        </CardTitle>
                        <ReactJson className='scrollable' src={TMP_DEFINITION} name={false}/>
                    </Card>
                    <div className='resource-wrapper'>
                        <Card className='card-with-border'>
                            <CardTitle className='card-title'>
                                Resource(s)
                            </CardTitle>
                            <div className='resource-object-wrapper'>
                                {this.props.resources && this.props.resources.map(resource => {
                                    return <div key={resource.resource.id} className='resource-item-wrapper'>
                                        {this.getResourceView(resource)}
                                    </div>
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>;
    }

    getResourceView = (resource) => {
        if (resource.resource.text) {
            return <Fragment>
                <div className='title' dangerouslySetInnerHTML={{ __html: resource.resource.text.div }}/>
                <div className='id subscript'>
                    ID: {resource.resource.id}
                </div>
            </Fragment>
        }
    }
}

const mapStateToProps = state => {
    let resources = state.fhir.resources && state.fhir.resources.entry;
    return {
        metadata: state.fhir.metadata,
        metadataCounts: state.fhir.metadataCounts,
        resources
    }
};
const mapDispatchToProps = dispatch => bindActionCreators({ getMetadata, app_setScreen, fetchResources }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ResourceBrowser));