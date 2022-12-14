import React, {Component, Fragment} from 'react';
import {TextField, LinearProgress, Button} from '@material-ui/core';

import './styles.less';
import ExportIcon from "@material-ui/icons/ImportExport";

// There are stored in a table at the BE but are not changed so I've hardcoded them
// until we have time to build an algorithm to suggest based on the FHIR implementation
const SUGGESTIONS = [
    "Patient", "Patient?name=s", "Patient?_id=SMART-1288992&_revinclude=*", "Patient?birthdate=>2010-01-01&birthdate=<2011-12-31", "Observation",
    "Observation?category=vital-signs", "Observation?date=>2010-01-01&date=<2011-12-31", "Condition", "Condition?onset=>2010-01-01&onset=<2011-12-31",
    "Condition?code:text=diabetes", "Procedure", "Procedure?date=>2010-01-01&date=<2011-12-31", "AllergyIntolerance", "AllergyIntolerance?date=>1999-01-01&date=<2011-12-31"
];

export default class Export extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            activeTab: 'data'
        };
    }

    componentDidMount() {
        this.props.clearResults();
    }

    render() {
        let status = this.props.exportStatus;

        let totalItemCount = 0;
        let exportedItemsCount = 0;
        let allDone = !!status.content;
        if (status.loading) {
            status.details && Object.keys(status.details).map(key => {
                let detail = status.details[key];
                totalItemCount += detail.total || 5000;
                detail.loading && (allDone = false);
            });
            status.content && Object.keys(status.content).map(key => {
                let detail = status.content[key];
                exportedItemsCount += detail.length;
            });
        }

        return <div className='export-wrapper'>
            <div className='controls-wrapper'>
                <div className='input-wrapper'>
                    <TextField id='query' value={this.state.query} fullWidth label='FHIR Query' onChange={e => this.setState({query: e.target.value})}/>
                </div>
                <Button variant='contained' color='primary' onClick={() => this.props.export(this.state.query)} style={{marginTop: '10px', verticalAlign: 'bottom'}}>
                    <ExportIcon/> {this.state.query.length > 0 ? 'Export query to file' : 'Export all to file'}
                </Button>
                <div className='exporting-status-wrapper'>
                    {status.loading && status.resourceList.length !== 0 && status.content && allDone &&
                    <Button variant='contained' className='button' color='secondary' onClick={() => this.downloadFile(status)}>
                        <ExportIcon/> Download file
                    </Button>}

                    {status.loading && status.resourceList.length === 0 && this.state.query.length > 0 && <span>Counting total objects to export. </span>}

                    {status.loading && status.resourceList.length !== 0 && !status.content && <span>Counting total objects to export. </span>}

                    {status.loading && status.resourceList.length !== 0 && status.content && !allDone && <Fragment>
                        <span>Object loaded: {exportedItemsCount} / {totalItemCount}</span>
                        <LinearProgress mode="determinate" max={totalItemCount} value={exportedItemsCount}/>
                    </Fragment>}

                </div>
                {status.loading && !allDone && status.content &&
                <div className='exporting-status-wrapper'>
                    <div>Do not close your browser or you will lose your progress.</div>
                    <br/>
                    <Button variant='contained' className='button' onClick={() => this.props.cancelDownload()} style={{color: this.props.theme.p5, backgroundColor: this.props.theme.p4}}>
                        Cancel download
                    </Button>
                </div>}

            </div>
        </div>;
    }

    downloadFile(status) {
        let a = document.createElement("a");
        let entry = [];
        let content = status.content;
        if (status.content.entry) {
            content = {"any": status.content.entry};
        }
        Object.keys(content).map(key => {
            if (content[key] > 1 || Object.keys(content).length > 1) {
                content[key].map(item => {
                    item && item.resource && entry.push({
                        "resource": item.resource,
                        "request": {
                            "method": "PUT",
                            "url": item.resource.resourceType + "/" + item.resource.id
                        }
                    })
                })
            } else {
                entry.push(content[key])
            }
        });
        let blob;
        if (entry.length === 1 && entry[0].length === 1) {
            blob = new Blob([JSON.stringify(entry[0][0])],
                {type: 'text/json'}
            );
        } else {
            blob = new Blob(
                [JSON.stringify({
                    "resourceType": "Bundle",
                    "type": "transaction",
                    "entry": entry
                }, undefined, 2)],
                {type: 'text/json'}
            );
        }


        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'sandbox-export.json');
        } else {
            let e = document.createEvent('MouseEvents');
            let a = document.createElement('a');

            a.download = 'sandbox-export.json';
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    }

    resetResults() {
        this.props.resetResults();
    }

}
