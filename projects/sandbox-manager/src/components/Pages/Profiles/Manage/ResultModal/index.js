import React, {Component} from 'react';
import {Dialog, IconButton, Tooltip} from "@material-ui/core";
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';

import './styles.less';

class ResultModal extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p10,
            color: this.props.theme.p7,
            paddingLeft: '10px',
            marginLeft: '0'
        };

        return <Dialog open={this.props.open} onClose={this.props.onClose} classes={{paper: 'loading-results'}}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button white" onClick={this.props.onClose}>
                    <i className="material-icons">close</i>
                </IconButton>
                <h1 style={titleStyle}>Profile loading results</h1>
            </div>
            {this.props.data && <div className='profiles-loading-results-wrapper'>
                <p>
                    Items: {this.props.data.totalCount} &emsp;
                    Items loaded: {this.props.data.resourceSavedCount} &emsp;
                    Items NOT loaded: <span style={{color: 'red'}}>{this.props.data.resourceNotSavedCount}</span>
                </p>
                <div>
                    <div>Files loaded:</div>
                    <div>
                        {Object.keys(this.props.data.resourceSaved).map((r, i) => {
                            let isActive = this.state.activeSavedResource === i;
                            let activeSavedResource = isActive ? undefined : i;
                            return <div style={{marginTop: '20px'}} key={i}>
                                <div className='resource-type' onClick={() => this.setState({activeSavedResource})}>
                                    {r}
                                    <div className={`chevron${!!isActive ? ' turn' : ''}`}>
                                        <ArrowDown/>
                                    </div>
                                </div>
                                <div className={`resource-list ${isActive ? 'open' : 'closed'}`}>
                                    {this.props.data.resourceSaved[r].map(s => <div key={s} style={{paddingLeft: '20px'}}>{s}</div>)}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div>
                    <div>Files NOT loaded:</div>
                    <div>
                        {Object.keys(this.props.data.resourceNotSaved).map((r, i) => {
                            let isActive = this.state.activeNotSavedResource === i;
                            let activeNotSavedResource = isActive ? undefined : i;
                            return <div style={{marginTop: '20px'}} key={i}>
                                <div className='resource-type' onClick={() => this.setState({activeNotSavedResource})}>
                                    {r}
                                    <div className={`chevron${!!isActive ? ' turn' : ''}`}>
                                        <ArrowDown/>
                                    </div>
                                </div>
                                <div className={`resource-list ${isActive ? 'open' : 'closed'}`}>
                                    {this.props.data.resourceNotSaved[r].map(s => <div key={s} style={{paddingLeft: '20px'}}>{s}</div>)}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>}
        </Dialog>;
    }
}

export default ResultModal;
