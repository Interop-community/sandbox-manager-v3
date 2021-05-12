import React, {Component, Fragment} from 'react';
import {Popover, Menu, Badge, MenuItem, IconButton, Button, CircularProgress} from '@material-ui/core';
import {Notifications, OpenInNew, Delete} from "@material-ui/icons";
import './styles.less';

export default class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: null,
            showDropdown: false,
            anchorEl: undefined
        }
    }

    render() {
        let notifications = this.props.notifications || [];
        let pendingInvitations = this.props.invitations.filter(i => i.status === "PENDING");
        let unseenNotifications = notifications.filter(i => !i.seen);
        let icon = <a className={this.state.showDropdown ? 'active' : ''} onClick={this.showDropdown} data-qa='header-notifications-button'>
            <Notifications style={{fill: this.props.theme.p8}}/>
        </a>;

        let badge = pendingInvitations.length || unseenNotifications.length
            ? <Badge badgeContent={pendingInvitations.length + unseenNotifications.length} onClick={this.showDropdown} className='badge'>
                {icon}
            </Badge>
            : icon;
        let classes = 'notification-wrapper' + (pendingInvitations.length > 0 ? '' : ' no-badge');

        return <div className={classes}>
            <div className='right'>
                <span className='anchor' ref='anchor'/>
                {badge}
            </div>
            {this.state.showDropdown &&
            <div className='notification-popover-wrapper'>
                {this.getPopoverContent(pendingInvitations, notifications)}
            </div>}
        </div>;
    };

    getPopoverContent = (pendingInvitations, notifications) => {
        return <Fragment>
            <CircularProgress className={`notifications-loader${this.props.loading ? ' active' : ''}`} size={30} thickness={3}/>
            {pendingInvitations.length > 0 || notifications.length > 0
                ? <Menu className='notification-menu' open anchorEl={this.state.anchorEl} onClose={this.showDropdown}>
                    {pendingInvitations.length > 0 &&
                    <Fragment>
                        <MenuItem className='notification-menu-item title' disabled key='first'>
                            <div>Invitations</div>
                        </MenuItem>
                        {pendingInvitations.map((p, key) =>
                            <MenuItem className='notification-menu-item' key={key}>
                                <div>
                                    <div>
                                        <span className='bold'>{p.invitedBy.name} / {p.invitedBy.email}</span><br/>has invited you to join <span className='bold'>{p.sandbox.name}</span> Sandbox.
                                    </div>
                                    <div className='actions'>
                                        <Button variant='contained' style={{marginRight: '10px'}} color='primary' onClick={() => this.props.updateSandboxInvite(p, 'ACCEPTED')}>
                                            Accept
                                        </Button>
                                        <Button variant='contained' color='secondary' onClick={() => this.props.updateSandboxInvite(p, 'REJECTED')}>
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </MenuItem>
                        )}
                    </Fragment>}
                    {notifications.length > 0 &&
                    <Fragment>
                        <MenuItem className='notification-menu-item title' disabled key='second'>
                            <div>Notifications</div>
                        </MenuItem>
                        {notifications.map((p, key) =>
                            <MenuItem className='notification-menu-item' key={key}>
                                <div>
                                    <div>
                                        <span className='bold' style={{textAlign: 'center'}}>{p.newsItem.title}</span><br/><span>{p.newsItem.description}</span>
                                    </div>
                                    <div className='actions'>
                                        <IconButton tooltip='Open' onClick={() => window.open(p.newsItem.link, '_blank')}>
                                            <OpenInNew/>
                                        </IconButton>
                                        <IconButton tooltip='Remove' onClick={() => this.props.hideNotification(p)}>
                                            <Delete/>
                                        </IconButton>
                                    </div>
                                </div>
                            </MenuItem>
                        )}
                    </Fragment>
                    }
                </Menu>
                : <Menu className='notification-menu no-padding' data-qa='notifications-menu-popover' open anchorEl={this.state.anchorEl} onClose={this.showDropdown}>
                    <MenuItem className='notification-menu-item title' disabled key='first'>
                        <div>No notifications<br/>to show</div>
                    </MenuItem>
                </Menu>}
        </Fragment>
    };

    showDropdown = (e) => {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();

        let notifications = this.props.notifications || [];
        let unseenNotifications = notifications.filter(i => !i.seen);
        if (!this.state.showDropdown && unseenNotifications.length > 0) {
            this.props.markAllNotificationsSeen();
        }

        this.setState({
            showDropdown: !this.state.showDropdown,
            anchorEl: e.currentTarget
        });
    };
}
