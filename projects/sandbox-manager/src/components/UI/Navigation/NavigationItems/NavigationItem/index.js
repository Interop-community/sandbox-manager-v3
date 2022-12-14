import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './styles.less';

export default class NavigationItem extends Component {
    render () {
        let color = this.props.theme.p3;
        let icon = React.isValidElement(this.props.icon) ? this.props.icon : React.createElement(this.props.icon, {style: {color, fill: color, marginRight: '24px'}});
        return <li className='navigation-item' data-qa={this.props['data-qa']}>
            <NavLink to={this.props.link} activeStyle={{color: this.props.theme.st }} style={{ color: this.props.theme.p3 }}>
                {icon}{this.props.text}
            </NavLink>
        </li>
    };
}
