import React from 'react';
import {Dialog, IconButton, Button, withTheme, DialogActions} from "@material-ui/core";

import './styles.less';

class ConfirmModal extends React.Component {

    render() {
        let titleStyle = {
            backgroundColor: this.props.theme.p10,
            color: this.props.theme.p8,
            paddingLeft: '10px',
            marginLeft: '0'
        };
        let props = {onClick: this.props.onConfirm, color: 'secondary'};
        if (this.props.red) {
            delete props.color;
            props.style = {backgroundColor: this.props.theme.p4, color: this.props.theme.p5};
        }

        return <Dialog classes={{paper: 'confirm-dialog'}} open={this.props.open} onClose={this.props.onCancel}>
            <div className='screen-title' style={titleStyle}>
                <IconButton className="close-button" onClick={this.props.onCancel}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>
                <h1 style={titleStyle}>{this.props.title}</h1>
            </div>
            <div className='screen-content confirm-dialog-content'>
                {this.props.children}
            </div>
            <DialogActions>
                <Button variant='contained' {...props}>
                    {this.props.confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    }
}

export default withTheme(ConfirmModal);