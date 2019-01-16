import React, { Component } from 'react';
import { FloatingActionButton, List, ListItem, Dialog, Paper, IconButton, AutoComplete, Tabs, Tab, CircularProgress } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CodeIcon from 'material-ui/svg-icons/action/code';
import ListIcon from 'material-ui/svg-icons/action/list';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { parseEntry } from 'sandbox-manager-lib/utils';
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

    constructor (props) {
        super(props);

        this.state = {
            showDialog: false,
            selectedEntry: undefined,
            query: '',
            activeTab: 'summary'
        };
    }

    componentDidMount () {
        this.refs.query.refs.searchTextField.input.addEventListener('keypress', this.submitMaybe);
    }

    componentWillUnmount () {
        this.refs.query.refs.searchTextField.input.removeEventListener('keypress', this.submitMaybe);
    }

    componentWillReceiveProps (nextProps) {
        nextProps.results && nextProps.results.issue && this.setState({activeTab: 'json'});
    }

    render () {
        let palette = this.props.muiTheme.palette;
        let json = this.state.activeTab === 'json';
        let underlineFocusStyle = { borderColor: palette.primary2Color };
        let floatingLabelFocusStyle = { color: palette.primary2Color };
        
        return <div className='query-browser-wrapper'>
            <Dialog paperClassName='query-result-dialog' open={this.state.showDialog} onRequestClose={this.toggle}>
                <Paper className='paper-card'>
                    <h3>
                        Details
                    </h3>
                    <IconButton className="close-button" onClick={this.toggle}>
                        <i className="material-icons">close</i>
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
                    <AutoComplete ref='query' id='query' searchText={this.state.query} fullWidth floatingLabelText='FHIR Query' onUpdateInput={query => this.setState({ query })}
                                  dataSource={SUGGESTIONS} filter={AutoComplete.caseInsensitiveFilter} onNewRequest={() => this.props.search(this.state.query)}
                                  underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}/>
                </div>
                {this.state.query.length > 0 &&
                <FloatingActionButton onClick={this.clearQuery} className='clear-query-button' mini secondary>
                    <CloseIcon/>
                </FloatingActionButton>}
                <FloatingActionButton onClick={() => this.props.search(this.state.query)} mini>
                    <SearchIcon/>
                </FloatingActionButton>
            </div>
            <Tabs className='query-tabs' contentContainerClassName='query-tabs-container' inkBarStyle={{ backgroundColor: palette.primary2Color }} style={{ backgroundColor: palette.canvasColor }}
                  value={this.state.activeTab}>
                <Tab label={<span><ListIcon style={{ color: !json ? palette.primary5Color : palette.primary3Color }}/> Summary</span>} className={'summary tab' + (!json ? ' active' : '')}
                     onActive={() => this.setActiveTab('summary')} value='summary'>
                    {this.props.results && this.props.results.entry && this.props.results.total && <span className='query-size'>
                        <span>Showing <span className='number'>{this.props.results.entry.length}</span></span>
                        <span> of <span className='number'>{this.props.results.total}</span></span>
                    </span>}
                    <div className='query-result-wrapper'>
                        {this.props.executing ?
                            <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>
                            : <List>
                                {this.props.results && this.props.results.entry && this.props.results.entry.length > 0 ? this.props.results.entry.map((e, i) => {
                                    let entry = parseEntry(e);
                                    return <ListItem key={i} onClick={() => this.setState({ showDialog: true, selectedEntry: e })} className='result-list-item'>
                                        {entry.props.map((item, index) => {
                                            return <div className='result-item' key={index}>
                                                <span>{item.label}: </span>
                                                <span>{item.value}</span>
                                            </div>
                                        })}
                                    </ListItem>
                                })
                                    : <div>{this.props.results != null && <span>No Results Found</span>}</div>}
                            </List>}
                    </div>
                </Tab>
                <Tab label={<span><CodeIcon style={{ color: json ? palette.primary5Color : palette.primary3Color }}/> JSON</span>} className={'json tab' + (json ? ' active' : '')}
                     onActive={() => this.setActiveTab('json')} value='json'>
                    {this.props.results && <ReactJson src={this.props.results} name={false}/>}
                    {this.props.executing && <div className='loader-wrapper'><CircularProgress size={80} thickness={5}/></div>}
                </Tab>
            </Tabs>
        </div>;
    }

    clearQuery = () => {
        this.setState({ query: '' });
        this.props.clearResults(null);
    };

    toggle = () => {
        let showDialog = !this.state.showDialog;
        let props = { showDialog };
        !showDialog && (props.selectedEntry = undefined);
        this.setState(props);
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.props.search(this.state.query);
    };

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    };
}
