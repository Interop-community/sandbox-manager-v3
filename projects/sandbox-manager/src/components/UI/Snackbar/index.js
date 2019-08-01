import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import './index.less';

class Snackbar extends Component {
    render () {
        return <div className='error-message-wrapper'>
            <span className='custom-snack' style={{ margin: '0 auto', backgroundColor: this.props.theme.palette.p4, color: this.props.theme.palette.p5 }}>
                {this.parseMessage(this.props.message).toString()}
                <IconButton className='error-close-button' onClick={this.props.onClose}>
                    <CloseIcon color={this.props.theme.palette.p5}/>
                </IconButton>
            </span>
        </div>;
    }

    parseMessage = (message) => {
        try {
            message = JSON.parse(message);
            if (message.resourceType !== undefined && message.resourceType !== null) {
                if (message.resourceType === "OperationOutcome") {
                    message = message.issue[0].diagnostics;
                }
            } else {
                message = message.message;
            }
        } catch(e) {
            // do nothing
        }

        return message || 'Unknown error';
    }
}

export default Snackbar;
