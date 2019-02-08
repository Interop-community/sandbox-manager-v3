import React, { Component } from 'react';
import { RaisedButton, Tabs, Tab, CircularProgress, List, ListItem } from 'material-ui';
import ReactJson from 'react-json-view';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ListIcon from 'material-ui/svg-icons/action/list';

import './styles.less';

export default class Profiles extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'data'
        };
    }

    componentDidMount () {
        this.props.clearResults();
        this.props.loadProfiles();
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let data = this.state.activeTab === 'data';

        return <div className='profiles-wrapper'>
            <Tabs className='profiles-tabs' contentContainerClassName='profiles-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}>
                <Tab label={<span><ListIcon style={{ color: data ? palette.primary5Color : palette.primary3Color }}/> Data</span>} className={'data tab' + (data ? ' active' : '')}
                     onActive={() => this.setActiveTab('data')}>
                    <div className='import-button'>
                        <input type='file' id='fileZip' ref='fileZip' style={{ display: 'none' }} onChange={this.loadZip}/>
                        <RaisedButton label='Load Profile (zip file)' primary onClick={() => this.refs.fileZip.click()}/>
                    </div>
                    <div className='url-list-wrapper'>
                        {this.props.profiles && this.getList()}
                    </div>
                </Tab>
                <Tab label={<span><CodeIcon style={{ color: !data ? palette.primary5Color : palette.primary3Color }}/> Results</span>} className={'result tab' + (!data ? ' active' : '')}
                     onActive={() => this.setActiveTab('result')} ref='results'>
                    {this.props.results && this.state.input.length > 0 && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.dataImporting && <div className='loader-wrapper' style={{ paddingTop: '200px' }}><CircularProgress size={80} thickness={5}/></div>}
                </Tab>
            </Tabs>
        </div>;
    }

    getList = () => {
        let profiles = Object.keys(this.props.profiles);
        return <List>
            {profiles.map((profile, key) => {
                //Group the items
                let grouping = {};
                this.props.profiles[profile].map(item => {
                    !grouping[item.resourceType] && (grouping[item.resourceType] = []);
                    grouping[item.resourceType].push(item);
                });

                //Build child components
                let nestedItems = Object.keys(grouping).map((i, k) => {
                    return <ListItem key={k} className='profile-list-item' primaryText={i} initiallyOpen={false} primaryTogglesNestedList  hoverColor='transparent'
                                     nestedItems={grouping[i].map(q => <ListItem className='profile-list-item' key={q.id} primaryText={q.title} hoverColor='transparent'/>)}/>
                });

                return <ListItem key={key} className='profile-list-item' primaryText={profile} initiallyOpen={false} primaryTogglesNestedList nestedItems={nestedItems} hoverColor='transparent'/>;
            })}
        </List>
    };

    loadZip = () => {
        this.props.uploadProfile(this.refs.fileZip.files[0]);
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };

    import = () => {
        this.props.importData && this.props.importData(this.state.input);
        this.refs.results.handleClick();
    };
}
