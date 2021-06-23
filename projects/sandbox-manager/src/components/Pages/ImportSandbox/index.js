import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Paper, IconButton, Dialog, withTheme} from '@material-ui/core';
import * as  actions from '../../../redux/action-creators';
import withErrorHandler from '../../UI/hoc/withErrorHandler';
import {withRouter} from 'react-router';
import './styles.less';
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showZipWarning: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            let defaulInput = document.getElementById('name');
            defaulInput && defaulInput.focus();
        }, 200);
    }

    render() {
        return <div><Dialog classes={{paper: 'import-sandbox-dialog'}} open={this.props.open} onClose={this.handleCancel}>
            <div className='import-sandbox-wrapper' data-qa='import-sandbox-dialog'>
                <Paper className='paper-card'>
                    <IconButton style={{color: this.props.theme.p5}} className="close-button" onClick={this.handleCancel}>
                        <i className="material-icons" data-qa="modal-close-button">close</i>
                    </IconButton>
                    <h3>
                        Import Sandbox
                    </h3>
                    {this.state.showZipWarning ? <div className='paper-body'>
                            <div>
                                Only zip files are allowed!
                            </div>
                            <Button variant='contained' color='primary' onClick={this.handleCancel}>
                                Ок
                            </Button>
                        </div>
                        :<div className='paper-body'>
                            <div>Please upload a zip file to import sandbox</div>
                            <Button variant='contained' color='primary' onClick={() => this.refs.fileZip.click()}>
                                Upload Zip
                            </Button>
                            {/* <input accept='application/x-bzip application/x-bzip2 application/gzip application/x-rar-compressed application/x-tar application/zip application/x-7z-compressed' type='file' id='fileZip'
                                ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/> */}
                        </div>
                    }
                </Paper>
                <div style={{clear: 'both'}}/>
            </div>
            {/* <DialogActions>
                {actions}
            </DialogActions> */}
        </Dialog>
        <input accept='application/x-bzip application/x-bzip2 application/gzip application/x-rar-compressed application/x-tar application/zip application/x-7z-compressed' type='file' id='fileZip' ref='fileZip' style={{display: 'none'}} onChange={this.loadZip}/>
        </div>
    }

    loadZip = () => {
        if (this.refs.fileZip.files && this.refs.fileZip.files[0] && (this.refs.fileZip.files[0].type.indexOf('zip') > -1 || this.refs.fileZip.files[0].type.indexOf('tar') > -1)) {
            this.props.importSandbox(this.refs.fileZip.files[0]);
            this.props.onCancel && this.props.onCancel();
        } else {
            this.toggleWarningModal();
        }
    };

    toggleWarningModal = () => {
        this.setState({showZipWarning: !this.state.showZipWarning});
    };

    handleCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };
}

const mapStateToProps = state => {
    return {
        user: state.users.oauthUser,
        sandboxes: state.sandbox.sandboxes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        importSandbox: (file) => dispatch(actions.importSandbox(file))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withTheme(Index))));
