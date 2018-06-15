import React, { Component } from 'react';
import AvailableSandboxes from './AvailableSandboxes';
import CreateSandbox from '../CreateSandbox';
import withErrorHandler from '../../../../../../lib/hoc/withErrorHandler';
import { app_setScreen, fetchSandboxes, loadTerms, loadInvites } from '../../../redux/action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './styles.less';
import Footer from "../../../../../../lib/components/Navigation/Footer";

class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            open: false
        }
    }

    componentDidMount () {
        this.props.app_setScreen('dashboard');
        this.props.loadInvites();
    }

    render () {
        let dialog = this.state.open
            ? <CreateSandbox onCancel={this.toggle} open={this.state.open} />
            : null;

        return <div className='dashboard-wrapper'>
            {dialog}
            <AvailableSandboxes onToggleModal={this.toggle} />
            <Footer loadTerms={this.props.loadTerms} terms={this.props.terms} />
        </div>;
    }

    toggle = () => {
        this.setState({ open: !this.state.open });
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ app_setScreen, fetchSandboxes, loadTerms, loadInvites }, dispatch);

export default connect(undefined, mapDispatchToProps)(withErrorHandler(Dashboard));