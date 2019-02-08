import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import * as glib from 'sandbox-manager-lib/utils/';
import * as lib from '../../lib';
import * as actionCreators from '../../redux/action-creators';

import * as React from 'react';
import * as PropTypes from 'prop-types';
import Layout from 'sandbox-manager-lib/components/Layout';
import CreateSandbox from '../containers/CreateSandbox';

import Init from '../Init/';

import './style.less';
import { CircularProgress, Dialog, RaisedButton } from "material-ui";
import Snackbar from '../UI/Snackbar';

class App extends React.Component {
    constructor (props) {
        super(props);

        if (props.location.pathname !== "/launchApp") {
            if (props.fhir.smart.data.server) {
                let smart = FHIR.client(props.fhir.smart.data.server);
                let split = smart.server.serviceUrl.split('/');
                let isCorrectServer = split ? split.indexOf(sessionStorage.sandboxId) >= 0 : true;
                if (sessionStorage.sandboxId && !isCorrectServer && props.history.location.search.indexOf('?code=') === -1) {
                    let newSmart = Object.assign({}, smart);
                    window.fhirClient = smart;
                    newSmart.server.serviceUrl = smart.server.serviceUrl.replace(split[3], sessionStorage.sandboxId);
                    props.selectSandbox(props.sandbox.sandboxes.find(i => i.sandboxId === sessionStorage.sandboxId));
                }
            }
        }

        if (props.location.search && props.location.search.indexOf('id=') >= 0) {
            const cookieUrl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
            const date = new Date();
            let split = props.location.search.split('?')[1].split('id=')[1].split('&')[0];
            document.cookie = `hspc-invitation-id=${split}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
        }

        this.state = {};
    }

    componentDidUpdate () {
        this.setSandboxId();
    }

    componentDidMount () {
        this.setSandboxId();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize);
    }

    render () {
        let showLoader = this.props.selecting || this.props.resetting || this.props.deleting;
        let loaderText = this.props.deleting ? 'Deleting sandbox' : this.props.resetting ? 'Resetting sandbox data' : 'Loading sandbox data';
        let theme = getMuiTheme(this.props.ui.theme);
        return this.props.ui && <MuiThemeProvider muiTheme={theme}>
            <Layout path={this.props.history.location.pathname} selectSandbox={this.props.selectSandbox} onAuthInit={this.props.init} settings={this.props.config.xsettings.data}
                    signOut={this.props.signOut} updateSandboxInvite={this.props.updateSandboxInvite} CreateSandbox={CreateSandbox} hideNotification={this.props.hideNotification}
                    markAllNotificationsSeen={this.props.markAllNotificationsSeen}>
                <Init {...this.props} />
                {!this.props.selecting && this.props.config.xsettings.status === 'ready' && <div className='app-root' ref={this.refStage()}>
                    <div className='stage' style={{ marginBottom: this.props.ui.footerHeight }}>
                        {!this.getCheck() && this.props.children}
                    </div>
                </div>}
                {!showLoader && this.props.location.pathname !== "/" && <div className='feedback-button'>
                    <RaisedButton onClick={() => window.open('https://groups.google.com/a/hspconsortium.org/forum/#!forum/developer', '_blank')} secondary overlayStyle={{ padding: '0 16px' }}>
                        <span style={{ position: 'relative', top: '-5px', marginRight: '10px', color: 'white' }}>Submit feedback</span><FeedbackIcon style={{ color: 'white', marginTop: '5px' }}/>
                    </RaisedButton>
                </div>}
                {showLoader && <Dialog className='loader-wrapper' modal open={showLoader}>
                    <p>{loaderText}</p>
                    <CircularProgress size={80} thickness={5}/>
                </Dialog>}
                {!!this.props.errorToShow && <Snackbar message={this.props.errorToShow} theme={theme} onClose={() => this.props.resetGlobalError()}/>}
            </Layout>
        </MuiThemeProvider>;
    }

    getLayoutProps = (theme) => {
        let path = this.props.history.location.pathname;
        let isRoot = path === '/';
        let isDashboard = path === '/dashboard';
        let sideNavVisible = !isRoot && !isDashboard && !!this.props.selectedSandbox;

        let onHomeClick = () => this.props.history.push('/dashboard');
        let signOut = this.props.signOut;
        let invitations = this.props.sandbox.userInvites;
        let navigationItems = this.props.selectedSandbox ? this.getNavigationItems(theme) : [];

        let props = {
            additionalLogoMargin: isDashboard,
            onAuthInit: this.props.init,
            updateSandboxInvite: this.props.updateSandboxInvite,
            sideNavVisible, onHomeClick, signOut, invitations, navigationItems
        };

        let sandboxSelector = this.props.selectedSandbox && !isDashboard &&
            <SandboxSelector {...this.props} theme={theme} sandboxes={this.props.sandbox.sandboxes} currentTitle={this.props.selectedSandbox.name}/>;
        sandboxSelector && (props.componentAfterLogo = sandboxSelector);

        props.title = isDashboard ? strings.defaultSandboxTitle : '';

        return props;
    };

    getNavigationItems = (theme) => {
        let ehrUrl = this.props.config.xsettings.data.sandboxManager
            ? this.props.config.xsettings.data.sandboxManager.ehrSimulator
            : '';
        let ehrSimulatorUrl = this.props.selectedSandbox && window.fhirClient ? ehrUrl : undefined;
        let ehrStyle = { borderBottom: `1px solid ${theme.palette.primary7Color}` };
        let iconStyle = { color: theme.palette.primary3Color, marginRight: '24px' };

        let list = [<NavigationItem key={1} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/apps'} icon={AppsIcon} text={<span>{strings.navigation.apps}</span>}/>,
            <NavigationItem key={2} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/launch'} icon={LaunchIcon} text={<span>{strings.navigation.launchScenarios}</span>}/>,
            <NavigationItem key={3} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/personas'} icon={ContactsIcon} text={<span>{strings.navigation.personas}</span>}/>,
            <NavigationItem key={4} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/patients'} icon={Patient} text={<span>{strings.navigation.patients}</span>}/>,
            <NavigationItem key={5} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/practitioners'} icon={<i className='fa fa-user-md fa-lg'/>}
                            text={<span>{strings.navigation.practitioners}</span>}/>,
            <NavigationItem key={6} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/data-manager'} icon={StorageIcon} text={<span>{strings.navigation.dataManager}</span>}/>,
            <NavigationItem key={7} theme={theme} link={'/' + this.props.selectedSandbox.sandboxId + '/settings'} active={this.props.screen === 'settings'} icon={SettingsIcon}
                            text={<span>{strings.navigation.settings}</span>}/>];
        this.props.selectedSandbox && list.unshift(<li key={0} className={'navigation-item bigger' + (!this.props.sandbox.defaultUser ? ' disabled' : '')} style={ehrStyle}>
            <a href={!this.props.sandbox.defaultUser ? undefined : ehrSimulatorUrl} target='_blank' style={{ color: theme.palette.primary3Color }} onClick={ehrSimulatorUrl ? this.openEHR : undefined}>
                <Desktop style={iconStyle}/>
                <span>{strings.navigation.ehrSimulator}</span>
            </a>
            <a className='warning' style={{ color: theme.palette.primary3Color }}>
                <Warning style={Object.assign({}, iconStyle, { color: theme.palette.primary4Color })}/>
                <span>Persona needed</span>
            </a>
        </li>);

        return list;
    };

    openEHR = () => {
        const cookieUrl = window.location.host.split(":")[0].split(".").slice(-2).join(".");
        const date = new Date();

        let sandboxApiUrl = this.props.config.xsettings.data.sandboxManager && this.props.config.xsettings.data.sandboxManager.sandboxManagerApiUrl;
        sandboxApiUrl && sandboxApiUrl.indexOf('//') >= 0 && (sandboxApiUrl = sandboxApiUrl.split('//')[1]);

        const token = { sandboxId: this.props.selectedSandbox.sandboxId, sandboxApiUrl, refApi: window.fhirClient.server.serviceUrl.split('/')[2], token: window.fhirClient.server.auth.token };

        date.setTime(date.getTime() + (3 * 60 * 1000));
        document.cookie = `hspc-launch-token=${JSON.stringify(token)}; expires=${date.getTime()}; domain=${cookieUrl}; path=/`;
    };

    setSandboxId = () => {
        let check = this.getCheck();
        check && (sessionStorage.sandboxId = window.location.pathname.split('/')[1]);
        check && (localStorage.setItem('sandboxId', window.location.pathname.split('/')[1]));
        check && sessionStorage.sandboxId && this.forceUpdate();
    };

    getCheck = () => {
        return !sessionStorage.sandboxId && window.location.pathname.split('/')[1] && window.location.pathname.split('/')[1] !== 'dashboard' && window.location.pathname.split('/').length >= 2;
    };

    // Event handlers ----------------------------------------------------------
    onResize = () => this.forceUpdate();

    // Refs --------------------------------------------------------------------
    refStage = () => (el) => {
        if (el && this.props.ui.clientWidth !== el.clientWidth) {
            this.props.ui_SetClientWidth(el.clientWidth);
        }
    }
}

App.propTypes = {
    fhir: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return { ...state, ...lib, ...glib, selecting: state.sandbox.selecting, resetting: state.sandbox.resetting, deleting: state.sandbox.deleting, errorToShow: state.app.errorToShow }
};
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actionCreators }, dispatch);

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedComponent };
export default withRouter(connectedComponent);
