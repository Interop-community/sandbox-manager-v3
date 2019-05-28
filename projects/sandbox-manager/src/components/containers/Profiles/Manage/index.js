import React, { Component } from 'react';
import { CircularProgress, IconButton, Paper, RaisedButton } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ProfilesIcon from 'material-ui/svg-icons/action/spellcheck';
import Modal from './Modal';

import './styles.less';
import DownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Filters from './Filters';
import moment from 'moment';

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
        return this.props.modal
            ? <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                {this.getList(this.props.palette)}
            </div>
            : <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                {this.getList(this.props.palette)}
            </div>
    }

    getList = () => {
        let stats = {};
        !!this.props.profileResources && this.props.profileResources.map(res => {
                stats[res.relativeUrl.split('/')[0]] = stats[res.relativeUrl.split('/')[0]] || [];
                stats[res.relativeUrl.split('/')[0]].push(<Paper key={res.relativeUrl} className='profile-res-list-item' onClick={e => this.selectResource(e, res)}>
                    <span>{res.relativeUrl}</span>
                </Paper>);
            }
        );

        return <div className='profiles-list'>
            <Modal {...this.props} {...this.state} selectResource={this.selectResource} toggleProfileToBrowse={this.toggleProfileToBrowse}/>
            <Filters {...this.props} onFilter={this.onFilter}/>
            {(this.props.fetchingFile || this.props.profilesUploading) && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                <CircularProgress size={40} thickness={5}/>
                {!!this.props.profilesUploadingStatus.resourceSavedCount && <div>
                    {this.props.profilesUploadingStatus.resourceSavedCount} resources processed
                </div>}
                {this.props.fetchingFile && <div>
                    Fetching project
                </div>}
            </div>}
            {!this.props.profilesUploading && !this.props.fetchingFile && this.props.profiles && this.props.profiles.map((profile, key) => {
                if (this.state.filter && profile.profileName.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1) {
                    return;
                }
                let active = this.state.selectedProfile === profile.profileId;
                let preActive = this.state.preActive === profile.profileId;
                let classes = 'profile-list-item' + (active ? ' active' : '') + (this.props.modal ? ' modal' : '');
                return <Paper key={key} className={classes} onClick={() => this.toggleProfile(profile.profileId)}>
                    <span>
                        <ProfilesIcon/>
                        {profile.profileName}
                    </span>
                    {/*{!this.props.modal && <IconButton tooltip='DELETE' onClick={() => this.props.deleteDefinition(profile.id)}>*/}
                    {/*    <DeleteIcon color={palette.primary4Color}/>*/}
                    {/*</IconButton>}*/}
                    <IconButton className='expanded-toggle'>
                        <DownIcon color={this.props.muiTheme.palette.primary3Color} style={{ width: '24px', height: '24px' }}/>
                    </IconButton>
                    <div className={'top-border' + (active ? ' active' : '')}/>
                    {preActive && <div className='profile-content' onClick={e => this.selectResource(e)}>
                        {this.props.profileSDsLoading && <CircularProgress className='loader' size={40} thickness={5}/>}
                        <RaisedButton className='browse-button' label='Browse' secondary onClick={() => this.toggleProfileToBrowse(profile)}/>
                        <div>
                            <div className='label-value'>
                                <span>Last updated: </span>
                                <span>{new moment(profile.lastUpdated).format('DD/MM/YYYY')}</span>
                            </div>
                        </div>
                        <div>
                            {Object.keys(stats).map(key => <div className="label-value" key={key}>
                                    <span>{key}: </span>
                                    <span>{stats[key].length}</span>
                                </div>
                            )}
                        </div>
                    </div>}
                </Paper>;
            })}
            {this.props.profilesLoading && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                <CircularProgress size={40} thickness={5}/>
            </div>}
        </div>
    };

    selectResource = (e, res) => {
        e && e.stopPropagation && e.stopPropagation();
        e && e.preventDefault && e.preventDefault();

        res && this.props.loadResource(res);

        this.setState({
            selectedResource: res
        });
    };

    toggleProfile = (id) => {
        let selectedProfile = this.state.selectedProfile === id ? undefined : id;

        selectedProfile && this.setState({ preActive: selectedProfile }, () => {
            this.setState({ selectedProfile });
        });

        !selectedProfile && this.setState({ selectedProfile }, () => {
            setTimeout(() => {
                this.setState({ preActive: selectedProfile });
            }, 500);
        });
        this.props.cleanValidationResults();
        if (selectedProfile) {
            let profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileResources(profile.id);
            this.props.onProfileSelected && this.props.onProfileSelected(profile);
        }
    };

    toggleProfileToBrowse = (id) => {
        let profileToBrowse = this.state.profileToBrowse === id ? undefined : id;

        this.setState({ profileToBrowse });
    };

    filter = () => {
    };
}

export default Manage;
