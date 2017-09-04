/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';

/*************************************************************************/

export class Logout extends Component {
    componentWillMount() {
        $.ajax({
            url: "/v1/session",
            method: "delete",
            success: () => {
                this.props.route.user.logOut();
            }
        });
    }

    render() {
        return <div/>;
    }
}
