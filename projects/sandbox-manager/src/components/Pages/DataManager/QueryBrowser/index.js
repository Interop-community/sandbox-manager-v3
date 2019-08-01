import React, {Component} from 'react';
import {TextField, Fab, List, ListItem, Dialog, Paper, IconButton, Tabs, Tab, CircularProgress} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CodeIcon from '@material-ui/icons/Code';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import {parseEntry} from '../../../../lib/utils';
import ReactJson from 'react-json-view';
import './styles.less';

// There are stored in a table at the BE but are not changed so I've hardcoded them
// until we have time to build an algorithm to suggest based on the FHIR implementation
const SUGGESTIONS = [
    "Patient", "Patient?name=s", "Patient?birthdate=>2010-01-01&birthdate=<2011-12-31", "Observation",
    "Observation?category=vital-signs", "Observation?date=>2010-01-01&date=<2011-12-31", "Condition", "Condition?onset=>2010-01-01&onset=<2011-12-31",
    "Condition?code:text=diabetes", "Procedure", "Procedure?date=>2010-01-01&date=<2011-12-31", "AllergyIntolerance", "AllergyIntolerance?date=>1999-01-01&date=<2011-12-31"
];

export default class QueryBrowser extends Component {

    constructor(props) {
        super(props);

        let query = '';

        if (props.query && Object.keys(props.query).length) {
            query = props.query.q + '&subject=' + props.query.p
        }

        this.state = {
            showDialog: false,
            selectedEntry: undefined,
            query,
            activeTab: 'summary',
            canFit: 2
        };
    }

    componentDidMount() {
        let canFit = this.calcCanFit();

        this.setState({canFit});

        // this.refs.query.refs.searchTextField.input.addEventListener('keypress', this.submitMaybe);

        let element = document.getElementsByClassName('stage')[0];
        element.addEventListener('scroll', this.scroll);

        this.state.query.length && this.search();
    }

    componentWillUnmount() {
        // this.refs.query.refs.searchTextField.input.removeEventListener('keypress', this.submitMaybe);
        let element = document.getElementsByClassName('stage')[0];
        element && element.removeEventListener('scroll', this.scroll);
    }

    componentWillReceiveProps(nextProps) {
        nextProps.results && nextProps.results.issue && this.setState({activeTab: 'json'});
    }

    render() {
        let palette = this.props.theme;
        let json = this.state.activeTab === 'json';

        return <div className='query-browser-wrapper'>
            <Dialog classes={{paper: 'query-result-dialog'}} open={this.state.showDialog} onClose={this.toggle}>
                <Paper className='paper-card'>
                    <h3>
                        Details
                    </h3>
                    <IconButton className="close-button" onClick={this.toggle}>
                        <i className="material-icons" data-qa="modal-close-button">close</i>
                    </IconButton>
                    <div className='paper-body'>
                        <div className='result-wrapper'>
                            {this.state.selectedEntry && <ReactJson src={this.state.selectedEntry.resource} name={false}/>}
                        </div>
                    </div>
                </Paper>
            </Dialog>
            <div className='fhir-query-wrapper'>
                <div className='input-wrapper'>
                    <TextField ref='query' id='query' value={this.state.query} fullWidth label='FHIR Query' onChange={e => this.setState({query: e.target.value})}/>
                    {/*dataSource={SUGGESTIONS} onNewRequest={this.search}/>*/}
                </div>
                {this.state.query.length > 0 &&
                <Fab onClick={this.clearQuery} className='clear-query-button' size='small' color='secondary'>
                    <CloseIcon/>
                </Fab>}
                <Fab onClick={this.search} size='small'>
                    <SearchIcon/>
                </Fab>
            </div>
            <Tabs className='query-tabs' style={{backgroundColor: palette.p7}} value={this.state.activeTab} onChange={(_e, activeTab) => this.setActiveTab(activeTab)}>
                <Tab label={<span><ListIcon style={{color: !json ? palette.p5 : palette.p3}}/> Summary</span>} value='summary' id='summary'/>
                <Tab label={<span><CodeIcon style={{color: json ? palette.p5 : palette.p3}}/> JSON</span>} value='json' id='json'/>
            </Tabs>
            <div className='query-tabs-container'>
                {this.state.activeTab === 'summary' && <div className={'summary tab' + (!json ? ' active' : '')}>
                    {this.props.results && this.props.results.entry && this.props.results.total && <span className='query-size'>
                        <span>Showing <span className='number'>{this.props.results.entry.length || 1}</span></span>
                        <span> of <span className='number'>{this.props.results.total}</span></span>
                    </span>}
                    <div className='query-result-wrapper'>
                        {this.props.executing ?
                            <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>
                            : <List>
                                {this.props.results && this.props.results.entry && (this.props.results.resourceType !== 'List') && this.props.results.entry.length > 0 ? this.props.results.entry.map((e, i) => {
                                        let entry = parseEntry(e);
                                        return <ListItem key={i} onClick={() => this.setState({showDialog: true, selectedEntry: e})} className='result-list-item'>
                                            {entry.props.map((item, index) => {
                                                return <div className='result-item' key={index}>
                                                    <span>{item.label}: </span>
                                                    <span>{item.value}</span>
                                                </div>
                                            })}
                                        </ListItem>
                                    })
                                    : this.props.results != null && this.props.results.total === 0 ? <span>No Results Found</span>
                                        : <div>{this.props.results != null &&
                                        <ListItem key={0} onClick={() => this.setState({showDialog: true, selectedEntry: {resource: this.props.results}})} className='result-list-item'>
                                            {parseEntry({resource: this.props.results}).props.map((item, index) => {
                                                return <div className='result-item' key={index}>
                                                    <span>{item.label}: </span>
                                                    <span>{item.value}</span>
                                                </div>
                                            })}
                                        </ListItem>}</div>}
                            </List>}
                        {this.props.gettingNextPage && <div className='loader-wrapper-small'><CircularProgress size={80} thickness={5}/></div>}
                    </div>
                </div>}
                {this.state.activeTab === 'json' && <div className={'json tab' + (json ? ' active' : '')}>
                    {this.props.results && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.executing && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                </div>}
            </div>
        </div>;
    }

    clearQuery = () => {
        this.setState({query: ''});
        this.props.clearResults(null);
    };

    toggle = () => {
        let showDialog = !this.state.showDialog;
        let props = {showDialog};
        !showDialog && (props.selectedEntry = undefined);
        this.setState(props);
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.search();
    };

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
    };

    search = () => {
        let query = this.state.query;
        if (query.indexOf('_count=') === -1) {
            query += (query.indexOf('?') >= 0 ? '&' : '?');
            query += `_count=${this.state.canFit}`;
        }
        query = encodeURI(query);
        this.props.search(query);
    };

    calcCanFit = () => {
        let containerHeight = document.getElementsByClassName('data-manager-wrapper')[0].clientHeight;
        // we calculate how much patients we can show on the screen and get just that much plus two so that we have content below the fold
        return Math.ceil((containerHeight - 210) / 100) + 2;
    };

    scroll = () => {
        let stage = document.getElementsByClassName('stage')[0];
        let dif = stage.scrollHeight - stage.scrollTop - stage.offsetHeight;

        let next = this.props.results && this.props.results.link && this.props.results.link.find(i => i.relation === 'next');
        let shouldFetch = dif <= 50 && next && !this.props.gettingNextPage;
        shouldFetch && this.props.next(next);
    };
}