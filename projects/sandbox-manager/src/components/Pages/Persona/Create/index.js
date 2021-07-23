import React, {Component} from 'react';
import {Button, TextField, Dialog, RadioGroup, Radio, Paper, IconButton, DialogActions, FormControl, FormHelperText, FormLabel, FormControlLabel} from '@material-ui/core';

import './styles.less';
import PersonaList from "../List";
import PersonaInputs from "../Inputs";

export default class CreatePersona extends Component {

    constructor(props) {
        super(props);

        this.state = {
            date: undefined,
            name: '',
            fName: '',
            birthDate: '',
            suffix: '',
            gender: '',
            personaUserId: ''
        };
    }

    render() {
        let createEnabled = this.checkCreateEnabled();

        return <div>
            <Dialog classes={{root: 'create-dialog', paper: 'create-persona-dialog'}} open={this.props.open} onClose={this.props.close}>
                {this.props.type === PersonaList.TYPES.persona &&
                <IconButton className={`close-button${this.props.type === PersonaList.TYPES.persona && !this.state.selectedForCreation ? ' dark' : ''}`} onClick={this.props.close}>
                    <i className="material-icons" data-qa="modal-close-button">close</i>
                </IconButton>}
                {this.props.type !== PersonaList.TYPES.persona && this.getDefaultContent()}
                {this.props.type === PersonaList.TYPES.persona && this.getPersonaContent()}
                <DialogActions>
                    <Button variant='contained' onClick={this.create} color='primary' disabled={!createEnabled}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    }

    checkCreateEnabled = () => {
        return this.props.type === PersonaList.TYPES.patient
            ? this.state.name.length >= 1 && this.state.fName.length >= 1 && this.state.gender.length >= 1 && moment(this.state.birthDate, 'YYYY-MM-DD', true).isValid()
            : this.props.type === PersonaList.TYPES.practitioner
                ? this.state.name.length >= 1 && this.state.fName.length >= 1
                : this.state.username && this.state.username.length >= 1 && this.state.password && this.state.password.length >= 1 && !this.userIdDuplicate();
    };

    handleUserPersonaId = (personaUserId) => {
        this.setState({personaUserId: personaUserId})
    };

    getPersonaContent = () => {
        let pagination = this.props.personaType === PersonaList.TYPES.practitioner ? this.props.practitionersPagination : this.props.patientsPagination;

        return this.state.selectedForCreation
            ? <div className='persona-inputs'>
                <PersonaInputs persona={this.state.selectedForCreation} existingPersonas={this.props.existingPersonas} sandbox={sessionStorage.sandboxId}
                               onChange={(username, password) => this.setState({username, password})} submitMaybe={this.submitMaybe}
                               onInputUserPersonaId={this.handleUserPersonaId} theme={this.props.theme} userIdDuplicate={this.userIdDuplicate()}/>
            </div>
            : <PersonaList click={selectedForCreation => this.setState({selectedForCreation})} type={this.props.personaType} key={this.props.personaType} personaList={this.props.personas}
                           next={() => this.props.getNextPersonasPage(this.props.personaType, pagination)} modal theme={this.props.theme} pagination={pagination}
                           prev={() => this.props.getPrevPersonasPage(this.props.personaType, pagination)} search={this.props.search}/>
    };

    getDefaultContent = () => {
        return <Paper className='paper-card'>
            <IconButton style={{color: `${this.props.theme.p5} !important`}} className="close-button" onClick={this.props.close}>
                <i className="material-icons" data-qa="modal-close-button">close</i>
            </IconButton>
            <h3>Create {this.props.type.toLowerCase().charAt(0).toUpperCase() + this.props.type.toLowerCase().slice(1)}</h3>
            <div className='paper-body'>
                <TextField className='persona-info-field' fullWidth onKeyPress={this.submitMaybe} label='First/middle name*' value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
                <TextField className='persona-info-field' fullWidth onKeyPress={this.submitMaybe} label='Family name*' value={this.state.fName} onChange={e => this.setState({fName: e.target.value})}/>

                {this.props.type === PersonaList.TYPES.patient &&
                <div>
                    <FormControl error={!!this.state.birthDateError} fullWidth className='persona-info-field'>
                        <TextField onKeyPress={this.submitMaybe} label="Birth date*" placeholder='YYYY-MM-DD' fullWidth value={this.state.birthDate}
                                   onChange={e => this.setState({birthDate: e.target.value})} onBlur={this.checkBirthDate}/>
                        {!!this.state.birthDateError && <FormHelperText>{this.state.birthDateError}</FormHelperText>}
                    </FormControl>
                    <div className='persona-info-field'>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Gender*</FormLabel>
                            <RadioGroup aria-label="Gender" name="gender" value={this.state.gender} onChange={e => this.setState({gender: e.target.value})}>
                                <FormControlLabel value="female" control={<Radio color='primary'/>} label="Female"/>
                                <FormControlLabel value="male" control={<Radio color='primary'/>} label="Male"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>}
                {this.props.type === PersonaList.TYPES.practitioner &&
                <TextField className='persona-info-field' onKeyPress={this.submitMaybe} label="Suffix" placeholder='MD ...' fullWidth value={this.state.suffix}
                           onChange={e => this.setState({suffix: e.target.value})}/>}
            </div>
        </Paper>
    };

    submitMaybe = (event) => {
        [10, 13].indexOf(event.charCode) >= 0 && this.checkCreateEnabled() && this.create();
    };

    checkBirthDate = () => {
        let isValid = moment(this.state.birthDate, 'YYYY-MM-DD', true).isValid();
        let birthDateError = isValid || this.state.birthDate.length === 0 ? undefined : 'Invalid birth date. Needs to be in format: YYYY-MM-DD';
        this.setState({birthDateError});
    };

    userIdDuplicate = () => {
        return this.props.existingPersonas.find(i => i.personaUserId.toLowerCase().split('@')[0] === this.state.personaUserId.toLowerCase());
    };

    create = () => {
        let data = this.state.selectedForCreation
            ? this.state.selectedForCreation
            : {
                "active": true,
                "resourceType": this.props.type,
                "name": [{"given": [this.state.name], "family": [this.state.fName], "text": `${this.state.name} ${this.state.fName}`}]
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
