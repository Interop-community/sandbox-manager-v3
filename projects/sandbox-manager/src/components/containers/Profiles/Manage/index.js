import React, { Component, Fragment } from 'react';
import { Chip, CircularProgress, Dialog, FloatingActionButton, IconButton, List, ListItem, Menu, MenuItem, Paper, Popover, RaisedButton, TextField } from 'material-ui';
import Page from 'sandbox-manager-lib/components/Page';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ContentAdd from 'material-ui/svg-icons/content/add';

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

class Manage extends Component {
    timer = null;

    constructor (props) {
        super(props);

        this.state = {
            project: '',
            profileName: '',
            profileId: '',
            simplifireProjectName: '',
            canFit: 2,
            showZipWarning: false,
            menuActive: false,
            simplifierInputVisible: false,
            profileInputModalVisible: false
        };
    }

    render () {
        return <Page title='Loaded Profiles'>
            <div className='card-content import-button left-padding'>
                {this.getModals()}
                <div className='file-load-wrapper'>
                    <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
                    {/*<RaisedButton label='Import profile' primary onClick={this.toggleInputModal}/>*/}
                    <FloatingActionButton onClick={this.startAdd} className='add-button'>
                        <ContentAdd/>
                    </FloatingActionButton>
                </div>
                <div className='loaded-profiles-wrapper' ref='loaded-profiles-wrapper'>
                    {this.getList(this.props.palette)}
                </div>
                <div className='white-shadow'/>
            </div>
        </Page>;
    }

    startAdd = () => {
        this.setState({ profileName: '', profileId: '' }, () => {
            this.refs.fileZip.value = [];
            this.refs.fileZip.click();
        });
    };

    getModals = () => {
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
                <RaisedButton label='Load' primary onClick={this.loadRemoteFile} disabled={!this.state.project || (this.state.project === 'manual' && this.state.simplifireProjectName.length < 2)}/>
            </div>
        ];
        !this.state.simplifierInputVisible && inputModalActions.shift();
        let closeInputModal = () => this.setState({ profileInputModalVisible: false });


        this.state.showZipWarning &&
        modals.push(<Dialog open={this.state.showZipWarning} modal={false} onRequestClose={this.toggleWarningModal} actions={actions} contentStyle={{ width: '350px' }} key={1}>
            <div className='sandbox-edit-modal'>
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
                <IconButton style={{ color: this.props.palette.primary5Color }} className="close-button" onClick={this.toggleInputModal}>
                    <i className="material-icons">close</i>
                </IconButton>
                {this.getModalContent(palette)}
            </Paper>
        </Dialog>);

        this.state.profileInputModalVisible &&
        modals.push(<Dialog open={this.state.profileInputModalVisible} modal={false} onRequestClose={closeInputModal} actions={inputActions} contentStyle={{ width: '412px' }} key={3}>
            <div className='sandbox-edit-modal'>
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

        return modals;
    };

    setProfileName = (_, profileName) => {
        let profileId = profileName.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (profileId.length > 20) {
            profileId = value.substring(0, 20);
        }
        this.setState({ profileName, profileId });
    };

    getModalContent = (palette) => {
        let title = this.state.simplifierInputVisible ? 'Import profile from Simplifier.net' : 'Import profile';
        let content = !this.state.simplifierInputVisible
            ? <div className='buttons-wrapper'>
                {/*<RaisedButton label='Simplifier.net' primary onClick={() => this.setState({ simplifierInputVisible: true })}/>*/}
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
                {this.state.project === 'manual' && <TextField value={this.state.simplifireProjectName} onChange={(_, simplifireProjectName) => this.setState({ simplifireProjectName })}
                                                               id='simplifireProjectName' floatingLabelText='Simplifier.net Project ID' className='project-name'/>}
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

    toggleInputModal = () => {
        this.setState({ inputModalVisible: !this.state.inputModalVisible, simplifierInputVisible: false });
    };

    loadRemoteFile = () => {
        let project = this.state.project !== 'manual' ? this.state.project : this.state.simplifireProjectName;
        this.props.loadProject(project, this.state.canFit);
        this.toggleInputModal();
    };

    saveProfile = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0], this.state.canFit, this.state.profileName, this.state.profileId);
        this.setState({ profileInputModalVisible: false });
    };

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.setState({ profileInputModalVisible: true })
        } else {
            this.toggleWarningModal();
        }
    };

    toggleWarningModal = () => {
        this.setState({ showZipWarning: !this.state.showZipWarning });
    };

    getList = (palette) => {
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };

        return <div>
            <TextField id='profile-filter' hintText='Filter profiles by name' onChange={(_, value) => this.delayFiltering(value)}
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
                    let classes = 'profile-list-item' + (this.state.selectedProfile === profile.profileId ? ' active' : '');
                    return <Paper zDepth={1} key={key} className={classes} onClick={() => this.toggleProfile(profile.profileId)}>
                        <span>{profile.profileName}</span>
                        <IconButton tooltip='DELETE' onClick={() => this.props.deleteDefinition(profile.id)}>
                            <DeleteIcon color={palette.primary4Color}/>
                        </IconButton>
                    </Paper>;
                })}
                {this.props.profilesLoading && <div className='loader-wrapper' style={{ height: '110px', paddingTop: '20px', margin: 0 }}>
                    <CircularProgress size={40} thickness={5}/>
                </div>}
            </div>
        </div>
    };

    toggleProfile = (id) => {
        let selectedProfile = this.state.selectedProfile === id ? undefined : id;
        this.setState({ selectedProfile });
        this.props.cleanValidationResults();
        if (selectedProfile) {
            let profile = this.props.profiles.find(i => i.profileId === id);
            profile && this.props.loadProfileSDs(profile.id);
        }
    };

    delayFiltering = (value) => {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.filter(value);
            this.timer = null;
        }, 500);
    };

    filter = (value) => {
        this.props.loadProfiles(this.state.canFit, value);
    };
}

export default Manage;

{/*<Page title={<span>Profiles</span>}
      helpIcon={<HelpButton style={{ marginLeft: '10px' }} url='https://healthservices.atlassian.net/wiki/spaces/HSPC/pages/431685680/Sandbox+Profiles'/>}>
    <div className='profiles-wrapper'>
        <Card className='card profile-list-wrapper'>
            <CardTitle className='card-title'>
                <span>Profiles</span>
            </CardTitle>
        </Card>
        <Card className='card validate-card'>
            <CardTitle className='card-title'>
                <span>Validation target</span>
            </CardTitle>
        </Card>
        <Card className='card result-card'>
            <CardTitle className='card-title'>
                <span>Validation result {this.props.validationResults && typeButton}</span>
                <span className='validate-by-title'>
                            {this.props.validationResults && <span>Validated <strong>{this.props.validationResults.validatedObject}</strong> </span>}
                    {this.props.validationResults && this.props.validationResults.validatedProfile
                        ? <span>against <strong>{profile.profileName}</strong></span>
                        : ''}
                        </span>
            </CardTitle>
            <div className='validate-result-wrapper'>
                {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
            </div>
        </Card>
    </div>
</Page>*/
}
