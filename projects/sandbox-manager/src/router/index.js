import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import App from '../components/App/';
import Apps from '../components/containers/Apps';
import Persona from '../components/containers/Persona';
import LaunchScenarios from '../components/containers/LaunchScenarios';
import LaunchApp from '../components/containers/LaunchApp';
import Settings from '../components/containers/Settings';
import EHRIntegration from '../components/containers/EHRIntegration';
import UserManagement from '../components/containers/UserManagement';
import Dashboard from '../components/containers/Dashboard';
import Start from '../components/containers/Start';
import AfterAuth from '../components/containers/AfterAuth';
import ResourceBrowser from '../components/containers/ResourceBrowser';
import CreateSandbox from '../components/containers/CreateSandbox';
import DataManager from '../components/containers/DataManager';

export default <Router>
    <App>
        <Switch>
            <Route path='/:sandboxId/apps' component={Apps} />
            <Route path='/:sandboxId/launch' component={LaunchScenarios} />
            <Route path='/launchApp' component={LaunchApp} />
            <Route path='/:sandboxId/patients' component={Persona} />
            <Route path='/:sandboxId/practitioners' component={Persona} />
            <Route path='/:sandboxId/personas' component={Persona} />
            <Route path='/:sandboxId/data-manager' component={DataManager} />
            <Route path='/:sandboxId/resource-browser' component={ResourceBrowser} />
            <Route path='/:sandboxId/user-management' component={UserManagement} />
            <Route path='/:sandboxId/integration' component={EHRIntegration} />
            <Route path='/:sandboxId/settings' component={Settings} />
            <Route exact path='/after-auth' component={AfterAuth} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/start' component={Start} />
            <Route path='/:sandboxId/create-sandbox' component={CreateSandbox} />
            <Route exact path="/:sandboxId" render={({ match }) => (
                <Redirect to={`/${match.params.sandboxId}/apps`} />
            )} />
            <Route path='/' component={Start} />
        </Switch>
    </App>
</Router>;
