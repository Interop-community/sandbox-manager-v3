import React, { Component } from 'react';

import Help from "./Help";
import Logo from '../../Logo';
import User from '../Toolbar/User';
import SandboxTitle from './SandboxTitle';
import Notification from "./Notification";
import SandboxSelector from './SandboxSelector';
import SideNavToggle from "../SideNav/SideNavToggle";
import { withTheme } from '@material-ui/styles';

import './styles.less';

class Toolbar extends Component {
    render() {
        let bgColor = this.props.theme.p2;
        return <div>
            <header className='toolbar' style={{ backgroundColor: bgColor }}>
                {!this.props.isDashboard && this.props.showSideNav && <SideNavToggle click={this.props.click} />}
                <Logo isDashboard={this.props.isDashboard || !this.props.showSideNav} history={this.props.history} />
                {this.props.sandbox && !this.props.isDashboard && <SandboxSelector {...this.props} />}
                {this.props.isDashboard && <SandboxTitle sandbox={this.props.sandbox} />}
                <User {...this.props} />
                <Notification {...this.props} />
                <Help {...this.props} />
            </header>
        </div>
    };
}

export default withTheme(Toolbar);
