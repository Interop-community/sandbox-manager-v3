import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { getMetadata, lookupPersonasStart, fetchPersonas, getPersonasPage, getResourcesForPatient } from '../../../../redux/action-creators';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux';
import withErrorHandler from 'sandbox-manager-lib/hoc/withErrorHandler';
import { Dialog, ListItem, RaisedButton, List } from 'material-ui';
import Remove from 'material-ui/svg-icons/content/remove';
import Folder from 'material-ui/svg-icons/file/folder';
import Description from 'material-ui/svg-icons/action/description';
import PersonaList from '../../Persona/List';
import { getPatientName } from "sandbox-manager-lib/utils/fhir";

import './styles.less';

class TreeBrowser extends Component {

    constructor (props) {
        super(props);

        this.state = {
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
            selectedPersona && this.props.selectPatient(selectedPersona);
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

        return <div className='tree-browser'>
            <div className='tab-title'>Browse linked resources</div>
            <div className='tree-input-wrapper'>
                {!this.props.selectedPersona && !this.state.patientSelectVisible && <RaisedButton label='Select a patient' primary onClick={this.toggleModal}/>}
                {this.props.selectedPersona && !this.state.patientSelectVisible && <RaisedButton label='Change patient' primary onClick={() => {
                    this.props.selectPatient();
                    this.toggleModal();
                }}/>}
                {!this.props.selectedPersona && this.state.patientSelectVisible &&
                <Dialog open={this.state.patientSelectVisible} modal={false} onRequestClose={this.toggleModal} contentClassName='patient-select-dialog'>
                    <PersonaList {...props} titleLeft/>
                </Dialog>}
                {this.props.selectedPersona && this.getTree()}
            </div>
        </div>
    }

    toggleModal = () => {
        this.setState({ patientSelectVisible: !this.state.patientSelectVisible });
        // this.props.cleanResults && this.props.cleanResults();
    };

    getTree = () => {
        let persona = this.props.selectedPersona;
        let ownProps = Object.keys(persona).map(key => {
            let item = persona[key];
            let id = 'ownProps.' + key;
            if (['string', 'number', 'boolean'].indexOf(typeof (item)) !== -1) {
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item.toString()}</span></span>} leftIcon={<Remove/>}/>;
            } else {
                return <ListItem key={id} primaryText={<span>{key}</span>} leftIcon={<Folder/>} primaryTogglesNestedList={true} nestedItems={this.getNested(item, id)}
                                 onNestedListToggle={() => this.toggleItem(id)}/>;
            }
        });
        let references = this.props.loadingResources ? [] : this.getReferences();
        let props = [
            <ListItem key={`2-${persona.id}`} primaryText="Own props" leftIcon={<Folder/>} primaryTogglesNestedList={true} nestedItems={ownProps}
                      onNestedListToggle={() => this.toggleItem('ownProps')} className='list-item'/>,
            <ListItem key={`3-${persona.id}`} primaryText="References" leftIcon={<Folder/>} primaryTogglesNestedList={true} nestedItems={references}
                      onNestedListToggle={() => this.toggleItem('references')} className='list-item'/>
        ];
        let id = `${persona.resourceType}/${persona.id}`;
        let classes = `list-item ${this.props.query === id ? 'active' : ''}`;

        return <List className='tree-list' key={persona.id} id={persona.id}>
            <ListItem primaryText={`${getPatientName(persona)}`} leftIcon={<Description />} initiallyOpen={true} onNestedListToggle={() => this.toggleItem('patient')}
                      nestedItems={props} className={classes} onClick={() => this.toggle(id)}/>
        </List>
    };

    toggle = (selectedResource) => {
        this.props.onToggle && this.props.onToggle(selectedResource);
        // this.props.cleanResults && this.props.cleanResults();
    };

    getReferences = () => {
        return Object.keys(this.props.patientResources).map(resource => {
            if (this.props.patientResources[resource].total > 0) {
                let id = 'references.' + this.props.patientResources[resource].id;
                let list = [];
                this.props.patientResources[resource].entry.map(item => {
                    list.push(item.resource);
                });
                return <ListItem key={id} primaryText={<span>{resource} <span className='bold'>({this.props.patientResources[resource].total})</span></span>} leftIcon={<Folder/>}
                                 primaryTogglesNestedList={true} nestedItems={this.getNested(list, id, true)} onNestedListToggle={() => this.toggleItem(id)} className='list-item'/>;
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
        // this.props.cleanResults && this.props.cleanResults();
    };

    getNested = (object, parentId, isRootLevel) => {
        if (object.map) {
            return object.map((listItem, index) => {
                if (['string', 'number', 'boolean'].indexOf(typeof (listItem)) !== -1) {
                    let id = `${parentId}.${listItem}`;
                    return <ListItem key={id} primaryText={<span><span className='bold'>{listItem}</span></span>} leftIcon={<Remove/>}/>;
                } else {
                    let id = `${parentId}.${index}`;
                    let checked = `${listItem.resourceType}/${listItem.id}`;
                    let classes = `list-item ${this.props.query === checked ? 'active' : ''}`;

                    return <ListItem key={id} primaryText={<span>{index}{listItem.id ? ` [${listItem.id}]` : ''}</span>} leftIcon={<Description />} className={classes}
                                     nestedItems={this.getNested(listItem, id)} onNestedListToggle={() => this.toggleItem(id)} onClick={() => this.toggle(checked)}/>;
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
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item}</span></span>} leftIcon={<Remove/>} className='list-item'/>;
            } else if (typeof (item) === 'boolean') {
                return <ListItem key={id} primaryText={<span>{key}: <span className='bold'>{item.toString()}</span></span>} leftIcon={<Remove/>} className='list-item'/>;
            } else {
                return <ListItem key={id} primaryText={<span>{key}</span>} leftIcon={<Folder/>} primaryTogglesNestedList={true} nestedItems={this.getNested(item, id)}
                                 onNestedListToggle={() => this.toggleItem(id)} className='list-item'/>;
            }
        })
    };
}

const mapStateToProps = state => {

    return {
        sds: state.fhir.sds,
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
