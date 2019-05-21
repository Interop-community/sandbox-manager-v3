import React, { Component } from 'react';
import { CircularProgress, IconButton, Paper, TextField } from 'material-ui';
import Page from 'sandbox-manager-lib/components/Page';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Modal from './Modal';

import './styles.less';
import HelpButton from '../../../UI/HelpButton';

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
            ? <div className='card-content import-button left-padding'>
                <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                    {this.getList(this.props.palette)}
                </div>
            </div>
            : <Page title='Loaded Profiles' helpIcon={<HelpButton style={{ marginLeft: '10px' }} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
                <div className='card-content import-button left-padding'>
                    <Modal {...this.props} {...this.state} selectResource={this.selectResource}/>
                    <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                        {this.getList(this.props.palette)}
                    </div>
                    <div className='white-shadow'/>
                </div>
            </Page>;
    }

    getList = (palette) => {
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div>
            <TextField id='profile-filter' hintText='Filter profiles by name' onChange={(_, value) => this.filter(value)}
                       underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
            <div className='profiles-list'>
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
                    return <Paper zDepth={1} key={key} className={classes} onClick={() => this.toggleProfile(profile.profileId)}>
                        <span>{profile.profileName}</span>
                        {!this.props.modal && <IconButton tooltip='DELETE' onClick={() => this.props.deleteDefinition(profile.id)}>
                            <DeleteIcon color={palette.primary4Color}/>
                        </IconButton>}
                        {preActive && <div className='profile-content' onClick={e => this.selectResource(e)}>
                            {this.props.profileSDsLoading && <CircularProgress className='loader' size={40} thickness={5}/>}
                            {!!this.props.profileResources && this.props.profileResources.map(res =>
                                <Paper zDepth={1} key={res.relativeUrl} className='profile-res-list-item' onClick={e => this.selectResource(e, res)}>
                                    <span>{res.relativeUrl}</span>
                                </Paper>
                            )}
                        </div>}
                    </Paper>;
                })}
                {this.props.profilesLoading && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                    <CircularProgress size={40} thickness={5}/>
                </div>}
            </div>
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
        }
    };

    filter = () => {
    };
}

export default Manage;
