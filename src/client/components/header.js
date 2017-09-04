/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { Link, browserHistory } from 'react-router';
import { Gravitar }             from './gravitar';

/*************************************************************************/

export class Header extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { username } = this.props.user.getUser();
        browserHistory.push(`/profile/${username}`);
    }

    render() {
        const user = this.props.user.getUser();
        const right = user.username !== '' ?
            <div className="header">
                <Link to="/logout">Log Out</Link>
                <Gravitar email={user.primary_email} size={40} onClick={this.onClick}/>
            </div>:
            <div className="col-xs-4 right-nav">
                <Link to="/login">Log In</Link>
                <Link to="/register">Register</Link>
            </div>;
        return <nav className="navbar navbar-default navbar-static-top">
            <div className="col-xs-8">
                <h2>Graham's Solitaire</h2>
            </div>
            {right}
        </nav>
    }
}
