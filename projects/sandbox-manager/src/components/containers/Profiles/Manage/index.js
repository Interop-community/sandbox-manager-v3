import React, { Component } from 'react';
import { CircularProgress, IconButton, Paper, RaisedButton, List, ListItem, Tab, Tabs, Chip } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Tree, { TreeNode } from 'rc-tree';
import ProfilesIcon from 'material-ui/svg-icons/action/spellcheck';
import Modal from './Modal';

import './styles.less';
import DownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Filters from './Filters';
import moment from 'moment';
import ReactJson from 'react-json-view';

class Manage extends Component {
    constructor (props) {
        super(props);

        this.state = {
            profileId: '',
            resourceId: '',
            profileName: ''
        };
    }

    render () {
        return <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
            {!this.props.modal && <Modal {...this.props} toggleProfileToBrowse={this.toggleProfileToBrowse}/>}
            {this.getList()}
        </div>
    }

    getList = () => {
        return <div className='profiles-list'>
            <div className='wrapper'>
                <Filters {...this.props} onFilter={this.onFilter}/>
                {(this.state.selectedResource || this.state.selectedProfile) &&
                <div className='nav'>
                    <div>
                        <Chip onRequestDelete={() => this.toggleProfile()}>
                            {this.state.selectedProfile}
                        </Chip>
                    </div>
                    <div>
                        {this.state.selectedResource && <Chip onRequestDelete={() => this.selectResource()}>
                            {this.state.selectedResource.relativeUrl}
                        </Chip>}
                    </div>
                </div>}
            </div>
            {(!this.state.selectedResource && !this.state.selectedProfile)
                ? <List className='profiles'>
                    {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                        return <ListItem key={key} onClick={() => this.toggleProfile(profile.profileId)} primaryText={profile.profileName} leftAvatar={<ProfilesIcon className='avatar'/>}/>
                    })}
                </List>
                : !!this.state.selectedResource
                    ? <Tabs className='resource-tabs' contentContainerClassName='resource-tabs-container' inkBarStyle={{ backgroundColor: this.props.palette.primary2Color }}>
                        <Tab label="Info" className='info tab'>
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
                                <div className="label-value big">
                                    <span>Text: </span>
                                    <span dangerouslySetInnerHTML={{ __html: this.props.profileResource.text.div }}/>
                                </div>
                            </div>}
                        </Tab>
                        <Tab label="Tree" className='tree tab'>
                            {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                <CircularProgress size={40} thickness={5}/>
                            </div>}
                            {this.props.profileResource && <Tree defaultExpandAll={false} selectable={true} autoExpandParent showLine onSelect={this.expand} checkedKeys={[]}>
                                <TreeNode title={this.props.profileResource.name}>
                                    {this.buildTree(this.props.profileResource)}
                                </TreeNode>
                            </Tree>}
                        </Tab>
                        <Tab label="JSON" className='json tab'>
                            {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                <CircularProgress size={40} thickness={5}/>
                            </div>}
                            {this.props.profileResource && <ReactJson src={this.props.profileResource} name={false}/>}
                        </Tab>
                    </Tabs>
                    : <List className='profiles'>
                        {this.getNestedItems(true)}
                    </List>}
            {this.props.profilesLoading && <div className='loader-wrapper'>
                <CircularProgress size={40} thickness={5}/>
            </div>}
        </div>
    };

    expand = (_, e) => {
        // console.log(e);
        e.node.selectHandle.previousSibling.click()
        return [];
    };

    buildTree = (res) => {
        let keys = Object.keys(res);
        let nodes = [];
        keys.map(k => {
            let val = res[k];
            if (typeof (val) !== 'object') {
                nodes.push(<TreeNode title={<span>{k} <b>{val}</b></span>}/>);
            } else {
                nodes.push(<TreeNode title={<span>{k}</span>}>
                    {this.buildTree(res[k])}
                </TreeNode>);
            }
        });

        return nodes;
    };

    getNestedItems = (isOpen) => {
        return !this.props.profileResources || !isOpen
            ? [<ListItem key={1}>
                <CircularProgress size={40} thickness={5}/>
            </ListItem>]
            : this.props.profileResources.map(res => {
                return <ListItem key={res.relativeUrl} primaryText={res.relativeUrl} onClick={() => this.selectResource(res)}/>
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
        this.setState({ selectedProfile, selectedResource: undefined });

        if (selectedProfile) {
            let profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileResources(profile.id);
            this.props.onProfileSelected && this.props.onProfileSelected(profile);
        }
    };

    toggleProfileToBrowse = (id) => {
        let profileToBrowse = this.state.profileToBrowse === id ? undefined : id;
        this.props.cleanValidationResults();

        this.setState({ profileToBrowse });
    };

    filter = () => {
    };
}

export default Manage;
