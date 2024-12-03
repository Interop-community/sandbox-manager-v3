import React, { Component } from 'react';
import strings from '../../../../../assets/strings';
import './styles.less';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { withTheme } from '@material-ui/styles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

class SandboxTitle extends Component {

    constructor(props) {
        super(props);

        let message = this.props.settings.announcement ? this.props.settings.announcement.message : null;
        let start = new Date(this.props.settings.announcement ? this.props.settings.announcement.startDate : null);
        let end = new Date(this.props.settings.announcement ? this.props.settings.announcement.endDate : null);
        let current = new Date();

        this.state = {
            openSnackbar: message && !isNaN(end) && end > current || message && !isNaN(start) && start <= current
        };
    }

    handleClose = () => {
        this.setState({
          openSnackbar: false
        });
      };

    render () {
        return this.state.openSnackbar ? <Snackbar open={this.state.openSnackbar} autoHideDuration={8000} anchorOrigin={{vertical:"top", horizontal:"center"}}   onClose={this.handleClose}>
                <Alert severity="info" > <div dangerouslySetInnerHTML={{ __html: this.props.settings.announcement.message }} /></Alert>
                      </Snackbar> : <div className='sandbox-title'>{strings.defaultSandboxTitle}</div>;

    }
}

export default withTheme(SandboxTitle);
