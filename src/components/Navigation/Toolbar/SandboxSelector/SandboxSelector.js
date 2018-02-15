import React, { Component } from 'react';
import * as  actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../../axiox';

import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';



class SandboxSelector extends Component {
    state = {
        value: 'Sandboxes',
        open: false
    };


    handleChange = (event, index, value) => {
        this.setState({value});
        if(this.state.value !== 'Sandboxes' && this.state.value !== 'CreateNew'){
            this.props.selectSandbox(this.state.value);
        }
    };

    handleClick = (event) => {
        // This prevents ghost click.
        event.preventDefault();

            this.setState({
              open: true,
              anchorEl: event.currentTarget,
            });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render () {
        const sandboxes = this.props.sandboxes.map( (sandbox) => {
            return (
                <MenuItem key={sandbox.id} value={sandbox.sandboxId} primaryText={sandbox.name} style={menuItemStyles}/>
            )});

        const buttonStyle = {
            fontFamily: '"Open Sans", sans-serif',
            textAlign: 'left',
            paddingLeft: 10,
            color: '#ffffff',
            width: '100%',
            marginBottom: '10px'
        };

        const popStyle = {
            fontFamily: '"Open Sans", sans-serif',
            marginLeft: 10,
        };

        const chevronStyle = {
            fontSize: 14
        };

        const menuItemStyles = {
            fontFamily: '"Open Sans", sans-serif'
        };


        return(
          <div>
            <FlatButton
              onClick={this.handleClick}
              style={buttonStyle}
              hoverColor="none"
              rippleColor="none"
            >
                Sandboxes &nbsp;&nbsp; <i class="fa fa-chevron-down" style={chevronStyle}></i>
            </FlatButton>
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              style={popStyle}
            >
              <Menu>
                <MenuItem primaryText="Sample Sandbox" style={menuItemStyles}/>
                {sandboxes}
                <hr/>
                <MenuItem primaryText="+ Create Sandbox" style={menuItemStyles}/>
              </Menu>
            </Popover>
          </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        sandboxes : state.sandbox.sandboxes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectSandbox: (sandboxId) => dispatch( actions.selectSandbox(sandboxId) )
    };
};


export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( SandboxSelector, axios ) );
