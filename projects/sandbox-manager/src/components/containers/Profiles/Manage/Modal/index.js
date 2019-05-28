import React, { Component, Fragment } from 'react';
import { Chip, CircularProgress, Dialog, FloatingActionButton, IconButton, Menu, MenuItem, Paper, Popover, RaisedButton, Tab, Tabs, TextField } from 'material-ui';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ReactJson from 'react-json-view';
import moment from 'moment';

import './styles.less';

const PROFILES = [
    {
        title: 'US-Core',
        id: 'US-Core',
        url: 'https://simplifier.net/US-Core'
    },
    {
        title: 'QiCore',
        id: 'QiCore',
        url: 'https://simplifier.net/QiCore'
    },
    {
        title: 'Custom',
        id: 'manual',
        url: 'Manual'
    }
];

class ProfilesModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            canFit: 10,
            project: '',
            menuActive: false,
            showZipWarning: false,
            simplifierProjectName: '',
            simplifierInputVisible: false,
            profileInputModalVisible: false
        }
    }

    render () {
        let modals = [];
        let palette = this.props.palette;
        let titleStyle = {
            backgroundColor: palette.primary2Color,
            color: palette.alternateTextColor,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let actions = [
            <div className='warning-modal-action'>
                <RaisedButton label='OK' primary onClick={this.toggleWarningModal}/>
            </div>
        ];
        let inputActions = [
            <div className='warning-modal-action'>
                <RaisedButton label='OK' primary onClick={this.saveProfile}/>
            </div>
        ];
        let inputModalActions = [
            <div key={1} className='input-modal-action'>
                <RaisedButton label='Load' primary onClick={this.loadRemoteFile} disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifierProjectName.length < 2)}/>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();
        let closeInputModal = () => this.setState({ profileInputModalVisible: false });


        this.state.showZipWarning &&
        modals.push(<Dialog open={this.state.showZipWarning} modal={false} onRequestClose={this.toggleWarningModal} actions={actions} contentStyle={{ width: '350px' }} key={1}>
            <div className='profiles-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={this.toggleWarningModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Incorrect file type</h1>
                </div>
                <div>
                    <p>
                        Only zip files are allowed!
                    </p>
                </div>
            </div>
        </Dialog>);

        this.state.inputModalVisible &&
        modals.push(<Dialog open={this.state.inputModalVisible} modal={false} onRequestClose={this.toggleInputModal} actions={inputModalActions} contentStyle={{ width: '412px' }}
                            bodyClassName='project-input-modal' key={2}>
            <Paper className='paper-card'>
                <IconButton style={{ color: palette.primary5Color }} className="close-button" onClick={this.toggleInputModal}>
                    <i className="material-icons">close</i>
                </IconButton>
                {this.getModalContent(palette)}
            </Paper>
        </Dialog>);

        this.state.profileInputModalVisible &&
        modals.push(<Dialog open={this.state.profileInputModalVisible} modal={false} onRequestClose={closeInputModal} actions={inputActions} contentStyle={{ width: '412px' }} key={3}>
            <div className='profiles-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={closeInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>Profile name</h1>
                </div>
                <div>
                    <div style={{ textAlign: 'center', fontSize: '.8rem', marginTop: '5px' }}>
                        <span>{this.refs.fileZip.files[0].name}</span>
                    </div>
                    <TextField id='profileName' floatingLabelText='Name' fullWidth onChange={this.setProfileName} value={this.state.profileName}/>
                    <TextField id='profileId' floatingLabelText='Id' fullWidth disabled value={this.state.profileId}/>
                </div>
            </div>
        </Dialog>);

        this.props.profileToBrowse &&
        modals.push(<Dialog open={!!this.props.profileToBrowse} modal={false} onRequestClose={this.props.toggleProfileToBrowse} actions={inputActions} contentStyle={{ width: '90%', maxWidth: '90%' }} key={5}
                            contentClassName='resources-modal'>
            <div className='profiles-modal'>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={this.props.toggleProfileToBrowse}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>{this.props.profileToBrowse.profileName}</h1>
                </div>
                <div className='resources'>
                    {
                        this.props.profileResources.map(res =>
                            <Paper className={`${this.state.toggledRes && res.relativeUrl === this.state.toggledRes.relativeUrl ? 'active' : ''}`} key={res.relativeUrl} onClick={() => this.toggleResource(res)}>
                                {res.relativeUrl}
                            </Paper>
                        )
                    }
                </div>
                <div className={`resource ${!!this.state.toggledRes ? 'active' : ''}`}>
                    <Tabs className='resource-tabs' contentContainerClassName='resource-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }}>
                        <Tab label="Info" className={'info tab' + (this.state.activeTab === 'info' ? ' active' : '')} onActive={() => this.setActiveTab('info')}>
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
                        <Tab label="Tree" className={'tree tab' + (this.state.activeTab === 'tree' ? ' active' : '')} onActive={() => this.setActiveTab('tree')}>
                            {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                <CircularProgress size={40} thickness={5}/>
                            </div>}
                        </Tab>
                        <Tab label="JSON" className={'json tab' + (this.state.activeTab === 'json' ? ' active' : '')} onActive={() => this.setActiveTab('json')}>
                            {this.props.fetchingProfileResource && <div className='loader-wrapper-small'>
                                <CircularProgress size={40} thickness={5}/>
                            </div>}
                            {this.props.profileResource && <ReactJson src={this.props.profileResource} name={false}/>}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </Dialog>);

        this.props.selectedResource &&
        modals.push(<Dialog open={!!this.props.selectedResource} modal={false} onRequestClose={this.props.selectResource} key={4} bodyClassName='profiles-modal'>
            <div>
                <div className='screen-title' style={titleStyle}>
                    <IconButton className="close-button" onClick={closeInputModal}>
                        <i className="material-icons">close</i>
                    </IconButton>
                    <h1 style={titleStyle}>{this.props.selectedResource.relativeUrl}</h1>
                </div>
                <div className='resource-info'>

                </div>
            </div>
        </Dialog>);

        return <Fragment>
            <div className='file-load-wrapper'>
                {/*<RaisedButton label='Import profile' primary onClick={this.toggleInputModal}/>*/}
                <FloatingActionButton onClick={this.toggleInputModal} className='add-button'>
                    <ContentAdd/>
                </FloatingActionButton>
            </div>
            {modals}
            <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
        </Fragment>;
    }

    toggleResource = (res) => {
        let toggledRes = this.state.toggledRes && this.state.toggledRes.id === res.id ? undefined : res;
        this.state.toggledRes && toggledRes && this.props.loadResource(toggledRes);
        !this.state.toggledRes && toggledRes && setTimeout(() => this.props.loadResource(toggledRes), 500);
        this.setState({ toggledRes });
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    toggleInputModal = () => {
        this.setState({ inputModalVisible: !this.state.inputModalVisible, simplifierInputVisible: false });
    };

    getModalContent = (palette) => {
        let title = this.state.simplifierInputVisible ? 'Import profile from Simplifier.net' : 'Import profile';
        let content = !this.state.simplifierInputVisible
            ? <div className='buttons-wrapper'>
                <RaisedButton label='Simplifier.net' primary onClick={() => this.setState({ simplifierInputVisible: true })}/>
                <RaisedButton label='Package' primary onClick={() => this.refs.fileZip.click() || this.toggleInputModal()}/>
            </div>
            : <div style={{ padding: '20px' }}>
                <Chip className={'chip' + (this.state.menuActive ? ' active' : '')} onClick={() => this.setState({ menuActive: true })}
                      backgroundColor={this.state.menuActive ? palette.primary2Color : undefined} labelColor={this.state.menuActive ? palette.alternateTextColor : undefined}>
                    <span ref='project-menu'/>
                    <span className='title'>{this.state.project ? this.state.project : 'Select a project to import'}</span>
                    <span className='icon-wrapper'>
                        <DownIcon style={{ position: 'relative', top: '5px' }} color={!this.state.menuActive ? palette.primary3Color : 'white'}/>
                    </span>
                </Chip>
                {this.state.project !== 'manual' && this.state.project !== '' && <a href={PROFILES.find(i => i.id === this.state.project).url} target='_blank'>Browse project on Simplifier.net</a>}
                {this.state.project === 'manual' && <TextField value={this.state.simplifierProjectName} onChange={(_, simplifierProjectName) => this.setState({ simplifierProjectName })}
                                                               id='simplifierProjectName' floatingLabelText='Simplifier.net Project ID' className='project-name'/>}
                <Popover open={this.state.menuActive} anchorEl={this.refs['project-menu']} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                         targetOrigin={{ horizontal: 'left', vertical: 'top' }} className='left-margin' onRequestClose={() => this.setState({ menuActive: false })}>
                    <Menu className='type-filter-menu' width='200px' desktop autoWidth={false}>
                        {PROFILES.map(profile => <MenuItem className='type-filter-menu-item' primaryText={profile.title} onClick={() => this.setState({ menuActive: false, project: profile.id })}/>)}
                    </Menu>
                </Popover>
            </div>;

        return <Fragment>
            <h3>{title}</h3>
            <div className="client-details">
                {content}
            </div>
        </Fragment>
    };

    toggleWarningModal = () => {
        this.setState({ showZipWarning: !this.state.showZipWarning });
    };

    saveProfile = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0], this.state.canFit, this.state.profileName, this.state.profileId);
        this.setState({ profileInputModalVisible: false });
    };

    loadRemoteFile = () => {
        let project = this.state.project !== 'manual' ? this.state.project : this.state.simplifierProjectName;
        this.props.loadProject(project, this.state.canFit);
        this.toggleInputModal();
    };

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.setState({ profileInputModalVisible: true })
        } else {
            this.toggleWarningModal();
        }
    };

    setProfileName = (_, profileName) => {
        let profileId = profileName.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (profileId.length > 20) {
            profileId = value.substring(0, 20);
        }
        this.setState({ profileName, profileId });
    };
}

export default ProfilesModal;
