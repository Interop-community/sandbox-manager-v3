import React, {Component} from 'react';
import {FormControl, FormHelperText, Paper, TextField} from '@material-ui/core';
import {parseNames} from '../../../../lib/utils/fhir';

import './styles.less';

export default class PersonaInputs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            password: ''
        }
    }

    render() {
        return <Paper className='paper-card persona-inputs-wrapper'>
            <h3>Persona Information</h3>
            <div className='actions'>
                {this.props.actions}
            </div>
            <div className='paper-body'>
                <div className='persona-info-row'>
                    <span>Display Name</span>
                    <span>{parseNames(this.props.persona)[0].val}</span>
                </div>
                <div className='persona-info-row high'>
                    <span>User Id</span>
                    <div>
                        <FormControl error={!!this.props.userIdDuplicate} fullWidth>
                            <TextField fullWidth id='user-id' value={this.state.userId} onChange={e => this.update('userId', e.target.value.replace(/[^a-z0-9]/gi, ''))}
                                       onKeyPress={this.props.submitMaybe}/>
                            {!!this.props.userIdDuplicate && <FormHelperText>ID already in use</FormHelperText>}
                        </FormControl>
                        {!this.props.userIdDuplicate && <span className='additional-info'>Your persona userId will be {this.state.userId}{this.state.userId && `@${this.props.sandbox}`}</span>}
                    </div>
                </div>
                <div className='persona-info-row high'>
                    <span>Password</span>
                    <TextField fullWidth id='password' onChange={e => this.update('password', e.target.value)} value={this.state.password}
                               onKeyPress={this.props.submitMaybe}/>
                </div>
                <div className='persona-info-row'>
                    <span>FHIR Resource URL</span>
                    <span>{`${this.props.persona.resourceType}/${this.props.persona.id}`}</span>
                </div>
            </div>
        </Paper>;
    }

    update = (field, value) => {
        let state = {};
        state[field] = value;
        if (field === 'userId') this.props.onInputUserPersonaId(value);
        this.setState(state, () => this.props.onChange && this.props.onChange(this.state.userId.length >= 1 ? `${this.state.userId}@${this.props.sandbox}` : '', this.state.password));
    };
}
