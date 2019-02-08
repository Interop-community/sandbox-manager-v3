import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { getMetadata, lookupPersonasStart, fetchPersonas, getPersonasPage, getResourcesForPatient } from '../../../../../redux/action-creators';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { Card, CardTitle, Dialog, ListItem, RaisedButton, List, IconButton } from 'material-ui';
import Remove from 'material-ui/svg-icons/content/remove';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import Validate from 'material-ui/svg-icons/av/playlist-add-check';
import Folder from 'material-ui/svg-icons/file/folder';
import PersonaList from '../../../Persona/List';

import './styles.less';

class TreeBrowser extends Component {

    constructor (props) {
        super(props);

        this.state = {
            selectedPersona: undefined,
            patientSelectVisible: false,
            toggledItems: {
                patient: true
            }
        };
    }

    componentDidMount () {
        this.props.getMetadata && this.props.getMetadata(false);
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let click = selectedPersona => {
            selectedPersona && this.setState({ selectedPersona });
            this.toggleModal();

            //Build a list of resources that can point to the patient
            let resourceList = [];
            this.props.metadata && this.props.metadata.rest[0].resource.map(res => {
                res.searchParam.map(param => {
                    param.name === 'patient' && resourceList.push({ type: res.type });
                })
            });

            this.props.getResourcesForPatient(resourceList, selectedPersona.id);
        };

        let props = {
            type: 'Patient', click, personaList: this.props.personas, modal: true, theme: palette, lookupPersonasStart: this.props.lookupPersonasStart,
            search: this.props.fetchPersonas, loading: this.props.personaLoading, close: this.toggleModal, pagination: this.props.pagination, fetchPersonas: this.props.fetchPersonas,
            next: () => this.props.getNextPersonasPage(this.state.type, this.props.pagination), prev: () => this.props.getPrevPersonasPage(this.state.type, this.props.pagination)
        };

        return <Fragment>
            <Card>
                <CardTitle className='card-title' style={{ color: palette.primary2Color }}>
                    Browse linked resources
                </CardTitle>
                <div className='card-content big'>
                    <div className='tree-input-wrapper'>
                        {!this.state.selectedPersona && !this.state.patientSelectVisible && <RaisedButton label='Select a patient' primary onClick={this.toggleModal}/>}
                        {!this.state.selectedPersona && this.state.patientSelectVisible &&
                        <Dialog open={this.state.patientSelectVisible} modal={false} onRequestClose={this.toggleModal} contentClassName='patient-select-dialog'>
                            <PersonaList {...props} titleLeft/>
                        </Dialog>}
                        {this.state.selectedPersona && this.getTree()}
                    </div>
                </div>
            </Card>
            <div>
            </div>
        </Fragment>
    }

    toggleModal = () => {
        this.setState({ patientSelectVisible: !this.state.patientSelectVisible });
    };

    getTree = () => {
        let persona = this.state.selectedPersona;
        let ownProps = Object.keys(persona).map(key => {
            let item = persona[key];
            let id = 'ownProps.' + key;
            if (['string', 'number', 'boolean'].indexOf(typeof (item)) !== -1) {
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item.toString()}</span></span>} leftIcon={<Remove/>}/>;
            } else {
                return <ListItem key={id} primaryText={<span>{key}</span>} leftIcon={this.getIcon(id)} primaryTogglesNestedList={true} nestedItems={this.getNested(item, id)}
                                 onNestedListToggle={() => this.toggleItem(id)}/>;
            }
        });
        let references = this.props.loadingResources ? [] : this.getReferences();
        let props = [
            <ListItem key={2} primaryText="Own props" leftIcon={this.getIcon('ownProps')} primaryTogglesNestedList={true} nestedItems={ownProps}
                      onNestedListToggle={() => this.toggleItem('ownProps')}/>,
            <ListItem key={3} primaryText="References" leftIcon={this.getIcon('references')} primaryTogglesNestedList={true} nestedItems={references}
                      onNestedListToggle={() => this.toggleItem('references')}/>
        ];

        return <List className='tree-list'>
            <ListItem primaryText="Patient" leftIcon={this.getIcon('patient')} initiallyOpen={true} primaryTogglesNestedList={true} onNestedListToggle={() => this.toggleItem('patient')}
                      nestedItems={props} rightIconButton={<IconButton onClick={() => this.validate(persona)} style={{ marginRight: '10px' }} tooltip="Validate"><Validate/></IconButton>}/>
        </List>
    };

    getReferences = () => {
        return Object.keys(this.props.patientResources).map(resource => {
            if (this.props.patientResources[resource].total > 0) {
                let id = 'references.' + this.props.patientResources[resource].id;
                let list = [];
                this.props.patientResources[resource].entry.map(item => {
                    list.push(item.resource);
                });
                return <ListItem key={id} primaryText={<span>{resource} <span className='bold'>({this.props.patientResources[resource].total})</span></span>} leftIcon={this.getIcon(id)}
                                 primaryTogglesNestedList={true} nestedItems={this.getNested(list, id, true)} onNestedListToggle={() => this.toggleItem(id)}/>;
            }
        });
    };

    toggleItem = (item) => {
        let toggledItems = Object.assign({}, this.state.toggledItems);
        if (toggledItems[item]) {
            Object.keys(toggledItems).map(key => {
                if (key.indexOf(item) !== -1) {
                    delete toggledItems[key];
                }
            });
        } else {
            toggledItems[item] = true
        }
        this.setState({ toggledItems });
    };

    getIcon = (item) => {
        return this.state.toggledItems[item] ? <FolderOpen/> : <Folder/>;
    };

    getNested = (object, parentId, isRootLevel) => {
        if (object.map) {
            return object.map((listItem, index) => {
                if (['string', 'number', 'boolean'].indexOf(typeof (listItem)) !== -1) {
                    let id = `${parentId}.${listItem}`;
                    return <ListItem key={id} primaryText={<span><span className='bold'>{listItem}</span></span>} leftIcon={<Remove/>}/>;
                } else {
                    let id = `${parentId}.${index}`;
                    return <ListItem key={id} primaryText={<span>{index}{listItem.id ? ` [${listItem.id}]` : ''}</span>} leftIcon={this.getIcon(id)} primaryTogglesNestedList={true}
                                     nestedItems={this.getNested(listItem, id)} onNestedListToggle={() => this.toggleItem(id)}
                                     rightIconButton={isRootLevel ?
                                         <IconButton onClick={() => this.validate(listItem)} style={{ marginRight: '10px' }} tooltip="Validate"><Validate/></IconButton> : undefined}/>;
                }
            });
        } else {
            return this.buildItem(object, parentId);
        }
    };

    buildItem = (object, parentId) => {
        return Object.keys(object).map(key => {
            let item = object[key];
            let id = `${parentId}.${key}`;
            if (typeof (item) === 'string') {
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item}</span></span>} leftIcon={<Remove/>}/>;
            } else if (typeof (item) === 'boolean') {
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item.toString()}</span></span>} leftIcon={<Remove/>}/>;
            } else {
                return <ListItem key={id} primaryText={<span>{key}</span>} leftIcon={this.getIcon(id)} primaryTogglesNestedList={true} nestedItems={this.getNested(item, id)}
                                 onNestedListToggle={() => this.toggleItem(id)}/>;
            }
        })
    };

    validate = (item) => {
        this.props.onValidate && this.props.onValidate(`${item.resourceType}/${item.id}`);
    };
}

const mapStateToProps = state => {

    return {
        metadata: state.fhir.metadata,
        loadingResources: state.patient.loadingResources,
        patientResources: state.patient.resources,
        metadataCounts: state.fhir.metadataCounts,
        personas: state.persona.patients,
        personaLoading: state.persona.loading,
        pagination: state.persona.patientsPagination,
        patientsPagination: state.persona.patientsPagination,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    getMetadata, lookupPersonasStart, fetchPersonas, getResourcesForPatient,
    getNextPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'next'),
    getPrevPersonasPage: (type, pagination) => getPersonasPage(type, pagination, 'previous')
}, dispatch);

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(TreeBrowser)));
