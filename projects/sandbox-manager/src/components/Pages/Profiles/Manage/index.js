import React, {Component, Fragment} from 'react';
import {CircularProgress, List, ListItem, Tab, Tabs, Stepper, Step, StepButton, StepConnector, IconButton, Dialog, DialogActions, Button} from '@material-ui/core';
import Tree, {TreeNode} from 'rc-tree';
import ProfilesIcon from '@material-ui/icons/Spellcheck';
import Delete from '@material-ui/icons/Delete';
import Modal from './Modal';
import Filters from './Filters';
import moment from 'moment';
import ReactJson from 'react-json-view';

import './styles.less';

const regex = /<img src="(?!h)/gi;
const replaceValue = "<img src=\"http://build.fhir.org/ig/argonautproject/provider-directory/qa/";
const regex2 = /url\(/gi;
const replaceValue2 = "url\(\"http://build.fhir.org/ig/argonautproject/provider-directory/qa/";

class Manage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                nameFilter: ''
            },
            profileId: '',
            resourceId: '',
            profileName: '',
            itemsFilter: '',
            activeTab: 'info',
            showConfirmation: false
        };
    }

    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p10,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        return <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
            <Modal {...this.props} toggleProfileToBrowse={this.toggleProfileToBrowse}/>
            <Dialog open={this.state.showConfirmation} onClose={() => this.setState({showConfirmation: false, profileToDelete: undefined})}>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button white" onClick={() => this.setState({showConfirmation: false, profileToDelete: undefined})}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Delete confirmation</h1>
                </div>
                <p style={{padding: '100px 30px 20px'}}>
                    Are you sure you want to delete the profile?
                </p>
                <DialogActions>
                    <Button variant='contained' onClick={this.deleteProfile} style={{backgroundColor: this.props.theme.p4, color: this.props.theme.p7}}>
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
            {this.getList()}
        </div>
    }

    getList = () => {
        return <div className='profiles-list'>
            <div className='wrapper'>
                <Filters {...this.props} onFilter={this.onFilter} filter={this.state.itemsFilter} showType={!this.state.selectedProfile}/>
            </div>
            {!this.props.profilesLoading && ((!this.state.selectedResource && !this.state.selectedProfile)
                ? <List className='profiles'>
                    {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                        let isNotFiltered = (!this.state.filter.nameFilter || profile.profileId.toLowerCase().indexOf(this.state.filter.nameFilter.toLowerCase()) >= 0) &&
                            (!this.props.profilesByDefinition || Object.keys(this.props.profilesByDefinition).indexOf(profile.profileName) !== -1);
                        return isNotFiltered && <ListItem key={key} onClick={() => this.toggleProfile(profile.profileId)} button>
                            <ProfilesIcon className='avatar'/>
                            <span>{profile.profileName}</span>
                            <IconButton onClick={e => this.deleteProfile(e, profile)} className='delete-button'>
                                <Delete/>
                            </IconButton>
                        </ListItem>
                    })}
                </List>
                : <div className='stepper'>
                    <Stepper activeStep={this.state.selectedProfile ? this.state.selectedResource ? 2 : 1 : 0} connector={<StepConnector className='stepper-connector'/>}>
                        <Step>
                            <StepButton onClick={() => this.toggleProfile()} icon={<span/>}>All profiles</StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.selectResource()} icon={<span/>}>{this.state.selectedProfile.profileId}</StepButton>
                        </Step>
                        {this.state.selectedResource && <Step>
                            <StepButton icon={<span/>}>{this.state.selectedResource.relativeUrl}</StepButton>
                        </Step>}
                    </Stepper>
                    <div>
                        {!!this.state.selectedResource
                            ? <Fragment>
                                <Tabs className='resource-tabs' classes={{root: 'resource-tabs-container'}} value={this.state.activeTab} onChange={(_e, activeTab) => this.setActiveTab(activeTab)}>
                                    <Tab label='Info' id='info' value='info' className='info tab'/>
                                    <Tab label='Tree' id='tree' value='tree' className='tree tab'/>
                                    <Tab label='JSON' id='json' value='json' className='json tab'/>
                                </Tabs>
                                {this.state.activeTab === 'info' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <div className='resource-info'>
                                        <div className="label-value">
                                            <span>Resource type: </span>
                                            <span>{this.props.profileResource.resourceType}</span>
                                        </div>
                                        {this.props.profileResource.type && <div className="label-value">
                                            <span>Type: </span>
                                            <span>{this.props.profileResource.type}</span>
                                        </div>}
                                        <div className="label-value">
                                            <span>Id: </span>
                                            <span>{this.props.profileResource.id}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Version: </span>
                                            <span>{this.props.profileResource.version}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Name: </span>
                                            <span>{this.props.profileResource.name}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Status: </span>
                                            <span>{this.props.profileResource.status}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Date: </span>
                                            <span>{new moment(this.props.profileResource.date).format('DD.MM.YYYY')}</span>
                                        </div>

                                        <div className="label-value">
                                            <span>fhirVersion: </span>
                                            <span>{this.props.profileResource.fhirVersion}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Publisher: </span>
                                            <span>{this.props.profileResource.publisher}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Description: </span>
                                            <span>{this.props.profileResource.description}</span>
                                        </div>
                                        <div className="label-value">
                                            <span>Url: </span>
                                            <span>{this.props.profileResource.url}</span>
                                        </div>
                                        {this.props.profileResource.text && this.props.profileResource.text.div && <div className="label-value big">
                                            <span>Text: </span>
                                            <span dangerouslySetInnerHTML={{__html: this.props.profileResource.text.div.replace(regex, replaceValue).replace(regex2, replaceValue2)}}/>
                                        </div>}
                                    </div>}
                                </Fragment>}
                                {this.state.activeTab === 'tree' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <Tree selectable autoExpandParent showLine onSelect={this.expand} checkedKeys={[]} defaultExpandedKeys={['0-0']}>
                                        <TreeNode title={this.props.profileResource.name}>
                                            {this.buildTree(this.props.profileResource)}
                                        </TreeNode>
                                    </Tree>}
                                </Fragment>}
                                {this.state.activeTab === 'json' && <Fragment>
                                    {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                        <CircularProgress size={40} thickness={5}/>
                                    </div>}
                                    {this.props.profileResource && <ReactJson src={this.props.profileResource} name={false}/>}
                                </Fragment>}
                            </Fragment>
                            : <List className='profiles'>
                                {!this.props.profilesLoading && this.getNestedItems(true)}
                            </List>}
                    </div>
                </div>)}
            {(this.props.profilesLoading || this.props.profilesUploading) && <div className='loader-wrapper-small'>
                <CircularProgress size={40} thickness={5}/>
                {!!this.props.profilesUploadingStatus.resourceSavedCount && <span className='info'>
                    {this.props.profilesUploadingStatus.resourceSavedCount} resources processed
                </span>}
            </div>}
        </div>
    };

    deleteProfile = (e, profile) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.showConfirmation) {
            this.setState({showConfirmation: true, profileToDelete: profile});
        } else {
            this.props.deleteDefinition(this.state.profileToDelete.id);
            this.setState({showConfirmation: false});
        }
    };

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };

    onFilter = (a, b) => {
        if (!this.state.selectedProfile) {
            let filter = Object.assign({}, this.state.filter);
            filter[a] = b;
            a === 'typeFilter' && !!b && this.props.loadProfilesBySD(b);
            a === 'typeFilter' && !b && this.props.clearLoadedProfilesBySD(b);
            let state = {filter};
            a !== 'typeFilter' && (state.itemsFilter = b);
            this.setState(state);
        } else if (this.state.selectedProfile && !this.state.selectedResource) {
            a !== 'typeFilter' && this.setState({itemsFilter: b});
        }
    };

    expand = (_, e) => {
        e.node.selectHandle.previousSibling.click();
        return [];
    };

    buildTree = (res) => {
        let keys = Object.keys(res);
        let nodes = [];
        keys.map((k, i) => {
            let val = res[k];
            if (typeof (val) !== 'object') {
                nodes.push(<TreeNode key={i} title={<span>{k} <b>{val}</b></span>}/>);
            } else {
                nodes.push(<TreeNode key={i} title={<span>{k}</span>}>
                    {this.buildTree(res[k])}
                </TreeNode>);
            }
        });

        return nodes;
    };

    getNestedItems = (isOpen) => {
        return !this.props.profileResources || !isOpen
            ? [<ListItem key={1}>
                <div className='loader-wrapper'>
                    <CircularProgress size={40} thickness={5}/>
                </div>
            </ListItem>]
            : this.props.profileResources.map(res => {
                let item = <ListItem key={res.relativeUrl} onClick={() => this.selectResource(res)} button>
                    {res.relativeUrl}
                </ListItem>;
                let shouldShow = (this.state.itemsFilter && res.relativeUrl.toLowerCase().indexOf(this.state.itemsFilter.toLowerCase()) >= 0) || !this.state.itemsFilter;
                return shouldShow ? item : null;
            });
    };

    selectResource = (res) => {
        res && this.props.loadResource(res);
        let state = {
            selectedResource: res
        };

        this.setState(state);
    };

    toggleProfile = (id) => {
        let selectedProfile = this.state.selectedProfile === id ? undefined : id;

        let profile = undefined;
        if (selectedProfile) {
            profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileResources(profile.id);
            this.props.onProfileSelected && this.props.onProfileSelected(profile);
        }

        this.setState({selectedProfile: profile, selectedResource: undefined, itemsFilter: '', filter: {}});
    };

    toggleProfileToBrowse = (id) => {
        let profileToBrowse = this.state.profileToBrowse === id ? undefined : id;
        this.setState({profileToBrowse});
    };
}

export default Manage;
