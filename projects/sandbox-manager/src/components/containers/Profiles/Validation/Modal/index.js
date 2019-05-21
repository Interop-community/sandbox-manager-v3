import React, { Component } from 'react';
import { Dialog } from 'material-ui';
import Manage from '../../Manage';

class ValidationModal extends Component {
    render () {
        return <Dialog modal={false} open onRequestClose={this.props.close}>
            <Manage {...this.props} modal/>
        </Dialog>;
    }
}

export default ValidationModal;
