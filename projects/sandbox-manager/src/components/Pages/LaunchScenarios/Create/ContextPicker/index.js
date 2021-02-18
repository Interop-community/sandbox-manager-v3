import React, {Component} from 'react';
import {Button, Checkbox, CircularProgress, FormControlLabel, IconButton, Paper} from "@material-ui/core";

import './styles.less'

class ContextPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.value || {}
        };
    }

    render() {
        let theme = this.props.theme;
        return <div className='page-wrapper scroll' style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
            <div>
                <IconButton style={{color: `${theme.p5} !important`}} className="close-button" onClick={this.props.close}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
            </div>
            <div className='page-title-wrapper left'>
                <span className='page-title'>
                    Context selector
                </span>
            </div>
            <Paper style={{height: '75%', overflow: 'auto', position: 'relative'}}>
                {this.props.resourceListFetching[this.props.type]
                    ? <CircularProgress style={{color: theme.p3, fill: theme.p3, width: '18px', height: '18px', position: 'absolute', left: '49%', top: '40%'}} size={36}/>
                    : this.getList()}
            </Paper>
            <Button variant='outlined' style={{color: theme.p2, marginTop: '12px', position: 'absolute', right: '20px'}} onClick={this.save}>
                SELECT
            </Button>
        </div>;
    }

    getList = () => {
        return (this.props.type || []).map(type => {
            let data = this.props.resourceList[type.type] || {};
            let markup = data.entry
                ? data.entry.map(o => {
                    return <div className='context-item-checkbox' key={o.resource.id}>
                        <FormControlLabel control={<Checkbox checked={this.state.selected[o.resource.id] || false} onChange={() => this.toggleItem(type.type, o)} value='open' color='primary'/>}
                                          label={o.resource.id} className='checkbox'/>
                    </div>
                })
                : <div style={{textAlign: 'center', margin: '16px 0'}}>
                    No resource matching the search criteria were found!
                </div>;
            return <div key={type.type}>
                <div style={{fontWeight: 'bold', marginLeft: '16px'}}>{type.type}:</div>
                {markup}
            </div>
        });
    };

    toggleItem = (type, item) => {
        let selected = Object.assign({}, this.state.selected);
        !!selected[item.resource.id] ? delete selected[item.resource.id] : selected[item.resource.id] = `${type}/${item.resource.id}`;
        this.setState({selected});
    };

    save = () => {
        this.props.onSave && this.props.onSave(this.state.selected);
    }
}

export default ContextPicker;
