import React, { Component } from 'react';
import { CircularProgress, Dialog, Toggle } from 'material-ui';
import Manage from '../../Manage';
import ReactJson from 'react-json-view';
import ResultsTable from '../../ResultsTable';

class ValidationModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            screen: 'profiles'
        };
    }

    render () {
        return <Dialog modal={false} open onRequestClose={this.props.close}>
            {this.getContent()}
        </Dialog>;
    }

    getContent = () => {
        let typeButton = <Toggle className='view-toggle' label='Show as table' labelPosition='right' toggled={this.state.resultsView} thumbStyle={{ backgroundColor: this.props.palette.primary5Color }}
                                 trackStyle={{ backgroundColor: this.props.palette.primary7Color }} thumbSwitchedStyle={{ backgroundColor: this.props.palette.primary2Color }}
                                 trackSwitchedStyle={{ backgroundColor: this.props.palette.primary2Color }} onToggle={() => this.setState({ resultsView: !this.state.resultsView })}/>;

        switch (this.state.screen) {
            case 'profiles':
                return <Manage {...this.props} modal onProfileSelected={this.onProfileSelected}/>;
            case 'results':
                return <div>
                    <span>Validation result {this.props.validationResults && typeButton}</span>
                    <div className='validate-result-wrapper'>
                        {!this.state.resultsView && this.props.validationResults && <ReactJson src={this.props.validationResults} name={false}/>}
                        {this.state.resultsView && this.props.validationResults && <ResultsTable results={this.props.validationResults}/>}
                        {this.props.validationExecuting && <div className='loader-wrapper'><CircularProgress size={60} thickness={5}/></div>}
                    </div>
                </div>;
        }
    };

    onProfileSelected = (profile) => {
        this.setState({ selectedProfile: profile, screen: 'results' });
        this.props.loadProfileSDs(profile.id);
        this.props.onValidate && this.props.onValidate(profile);
    }
}

export default ValidationModal;
