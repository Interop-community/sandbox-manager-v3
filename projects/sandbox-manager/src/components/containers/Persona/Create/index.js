import React, { Component } from 'react';
import { RaisedButton, TextField, Dialog, RadioButtonGroup, RadioButton, Paper, IconButton } from 'material-ui';

import './styles.less';
import PersonaList from "../List";
import PersonaInputs from "../Inputs";

export default class CreatePersona extends Component {

    constructor (props) {
        super(props);

        this.state = {
            date: undefined,
            name: '',
            fName: '',
            birthDate: '',
            suffix: '',
            gender: ''
        };
    }

    render () {
        let createEnabled = this.props.type === PersonaList.TYPES.patient
            ? this.state.name.length >= 1 && this.state.fName.length >= 1 && this.state.gender.length >= 1 && moment(this.state.birthDate, 'YYYY-MM-DD', true).isValid()
            : this.props.type === PersonaList.TYPES.practitioner
                ? this.state.name.length >= 1 && this.state.fName.length >= 1
                : this.state.username && this.state.username.length >= 1 && this.state.password && this.state.password.length >= 1;

        return <div>
            <Dialog bodyClassName='create-persona-dialog' open={this.props.open} onRequestClose={this.props.close}
                    actions={[<RaisedButton label='Create' onClick={this.create} primary disabled={!createEnabled}/>]}>
                {this.props.type === PersonaList.TYPES.persona && <IconButton style={{ color: this.state.selectedForCreation ? this.props.theme.primary5Color : this.props.theme.primary3Color }}
                                                                              className="close-button" onClick={this.props.close}>
                    <i className="material-icons">close</i>
                </IconButton>}
                {this.props.type !== PersonaList.TYPES.persona && this.getDefaultContent()}
                {this.props.type === PersonaList.TYPES.persona && this.getPersonaContent()}
            </Dialog>
        </div>
    }

    getPersonaContent = () => {
        let pagination = this.props.personaType === PersonaList.TYPES.practitioner ? this.props.practitionersPagination : this.props.patientsPagination;

        return this.state.selectedForCreation
            ? <div className='persona-inputs'>
                <PersonaInputs persona={this.state.selectedForCreation} sandbox={sessionStorage.sandboxId} onChange={(username, password) => this.setState({ username, password })}
                               theme={this.props.theme}/>
            </div>
            : <PersonaList click={selectedForCreation => this.setState({ selectedForCreation })} type={this.props.personaType} key={this.props.personaType} personaList={this.props.personas}
                           next={() => this.props.getNextPersonasPage(this.props.personaType, pagination)} modal theme={this.props.theme} pagination={pagination}
                           prev={() => this.props.getPrevPersonasPage(this.props.personaType, pagination)} search={this.props.search}/>
    };

    getDefaultContent = () => {
        let underlineFocusStyle = { borderColor: this.props.theme.primary2Color };
        let floatingLabelFocusStyle = { color: this.props.theme.primary2Color };

        return <Paper className='paper-card'>
            <IconButton style={{ color: this.props.theme.primary5Color }} className="close-button" onClick={this.props.close}>
                <i className="material-icons">close</i>
            </IconButton>
            <h3>Create {this.props.type.toLowerCase().charAt(0).toUpperCase() + this.props.type.toLowerCase().slice(1)}</h3>
            <div className='paper-body'>
                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                           floatingLabelText='First/middle name*' fullWidth value={this.state.name} onChange={(_, name) => this.setState({ name })}/>
                <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                           floatingLabelText='Family name*' fullWidth value={this.state.fName} onChange={(_, fName) => this.setState({ fName })}/>

                {this.props.type === PersonaList.TYPES.patient &&
                <div>
                    <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                               floatingLabelText="Birth date*" hintText='YYYY-MM-DD' fullWidth value={this.state.birthDate}
                               onChange={(_, birthDate) => this.setState({ birthDate })} onBlur={this.checkBirthDate} errorText={this.state.birthDateError}/>
                    <h4>Gender*</h4>
                    <RadioButtonGroup name="gender" valueSelected={this.state.gender} onChange={(_, gender) => this.setState({ gender })}>
                        <RadioButton value="male" label="Male"/>
                        <RadioButton value="female" label="Female"/>
                    </RadioButtonGroup>
                </div>}
                {this.props.type === PersonaList.TYPES.practitioner &&
                <div>
                    <TextField underlineFocusStyle={underlineFocusStyle} floatingLabelFocusStyle={floatingLabelFocusStyle}
                               floatingLabelText="Suffix" hintText='MD ...' fullWidth value={this.state.suffix} onChange={(_, suffix) => this.setState({ suffix })}/>
                </div>}
            </div>
        </Paper>
    };

    checkBirthDate = () => {
        let isValid = moment(this.state.birthDate, 'YYYY-MM-DD', true).isValid();
        let birthDateError = isValid || this.state.birthDate.length === 0 ? undefined : 'Invalid birth date. Needs to be in format: YYYY-MM-DD';
        this.setState({ birthDateError });
    };

    create = () => {
        let data = this.state.selectedForCreation
            ? this.state.selectedForCreation
            : {
                "active": true,
                "resourceType": this.props.type,
                "name": [{ "given": [this.state.name], "family": [this.state.fName], "text": `${this.state.name} ${this.state.fName}` }]
            };
        if (this.props.type === PersonaList.TYPES.patient) {
            data.birthDateTime = `${this.state.birthDate}T00:00:00.000Z`;
            data.gender = this.state.gender;
            data.birthDate = this.state.birthDate;
        } else if (this.props.type === PersonaList.TYPES.practitioner) {
            this.state.suffix && (data.name[0].suffix = [this.state.suffix]);
        } else {
            data.userId = this.state.username;
            data.password = this.state.password;
        }

        if (this.props.type === PersonaList.TYPES.persona) {
            this.props.create && this.props.create(this.props.personaType, data);
            this.props.close();
        } else {
            this.props.create && this.props.create(data);
            this.props.close();
        }
    };
}
