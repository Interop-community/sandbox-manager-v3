import React, { Component } from 'react';
import { init } from '../../../redux/action-creators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import withErrorHandler from '../../UI/hoc/withErrorHandler';

import './styles.less';

class Start extends Component {

    componentDidUpdate () {
        this.props.settings.env && this.props.onAuthInit();
    }

    render () {
        return <div className='start-page-wrapper no-padding'>
            <img style={{width: '65vw'}} src='./img/hspc-sndbx-logo.png'/>
            <CircularProgress/>
            <div>
                <span className='message'>
                    Welcome to the Sandbox, <a href=''>click here</a> if you're not redirected to the login screen.
                </span>
            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        settings: state.config.xsettings.data
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ onAuthInit: init }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Start));
