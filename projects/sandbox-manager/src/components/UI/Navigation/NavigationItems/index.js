import React, {Component} from 'react';
import NavigationItem from './NavigationItem';
import StorageIcon from '@material-ui/icons/Storage';
import ContactsIcon from '@material-ui/icons/Contacts';
import LaunchIcon from '@material-ui/icons/Launch';
import ProfilesIcon from '@material-ui/icons/Spellcheck';
import AppsIcon from '@material-ui/icons/Apps';
import SettingsIcon from '@material-ui/icons/Settings';
import ToolsIcon from '@material-ui/icons/Build';
import Warning from '@material-ui/icons/Warning';
import Desktop from '@material-ui/icons/DesktopWindows';
import Patient from "svg-react-loader?name=Patient!../../../../assets/icons/patient.svg";
import HooksIcon from "svg-react-loader?name=Patient!../../../../assets/icons/hooks-logo-mono.svg";

import strings from '../../../../assets/strings';
import './styles.less';

export default class NavigationItems extends Component {
    render() {
        let ehrSimulatorUrl = this.props.sandbox && window.fhirClient ? this.props.ehrUrl : undefined;
        let ehrStyle = {borderBottom: `1px solid ${this.props.theme.p7}`};
        let iconStyle = {color: this.props.theme.p3, marginRight: '24px'};

        return <ul className='navigation-items'>
            {this.props.sandbox &&
            <li className={'navigation-item' + (!this.props.defaultUser ? ' disabled' : '')} style={ehrStyle}>
                <a href={!this.props.defaultUser ? undefined : ehrSimulatorUrl} target='_blank' style={{color: this.props.theme.p3}} onClick={ehrSimulatorUrl ? this.openEHR : undefined}>
                    <Desktop style={iconStyle}/>
                    <span>{strings.navigation.ehrSimulator}</span>
                </a>
                <a className='warning' style={{color: this.props.theme.p3}}>
                    <Warning style={Object.assign({}, iconStyle, {color: this.props.theme.p4})}/>
                    <span>Persona needed</span>
                </a>
            </li>}
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/apps'} icon={AppsIcon} text={<span>{strings.navigation.apps}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/cds-services'} icon={HooksIcon} text={<span>{strings.navigation.hooks}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/launch'} icon={LaunchIcon} text={<span>{strings.navigation.launchScenarios}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/patients'} icon={Patient} text={<span>{strings.navigation.patients}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/personas'} icon={ContactsIcon} text={<span>{strings.navigation.personas}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/practitioners'} icon={<i className='fa fa-user-md fa-lg'/>}
                            text={<span>{strings.navigation.practitioners}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/profiles'} icon={ProfilesIcon} text={<span>{strings.navigation.profiles}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/data-manager'} icon={StorageIcon} text={<span>{strings.navigation.dataManager}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/tools'} icon={ToolsIcon} text={<span>{strings.navigation.tools}</span>}/>
            <NavigationItem theme={this.props.theme} link={'/' + this.props.sandbox.sandboxId + '/settings'} active={this.props.screen === 'settings'} icon={SettingsIcon}
                            text={<span>{strings.navigation.settings}</span>} data-qa="nav-settings"/>
        </ul>
    }

    openEHR = () => {
        const cookieUrl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
        const date = new Date();
        const token = {
            sandboxId: this.props.sandbox.sandboxId, sandboxApiUrl: this.props.sandboxApiUrl,
            refApi: window.fhirClient.server.serviceUrl.split('/')[2], token: window.fhirClient.server.auth.token
        };

        date.setTime(date.getTime() + (3 * 60 * 1000));
        let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        let hooks = this.props.hooks.map(h => {
            delete h.createdBy;
            delete h.sandbox;
            delete h.createdTimestamp;
            delete h.visibility;
            delete h.lastUpdated;
            return h;
        });
        let hooksContent = JSON.stringify(hooks);
        let tokenContent = JSON.stringify(token);
        if (isIE11) {
            document.cookie = `hspc-launch-token=${tokenContent}; expires=${date.toUTCString()}; domain=${cookieUrl}; path=/`;
            document.cookie = `hspc-hooks-list=${hooksContent}; expires=${date.toUTCString()}; domain=${cookieUrl}; path=/`;
        } else {
            document.cookie = `hspc-launch-token=${tokenContent}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
            document.cookie = `hspc-hooks-list=${hooksContent}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
        }
    }
}
