/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

import React, { Component }     from 'react';
require('./announcement.css');

/*************************************************************************/

export class Announcement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            ready: false
        };
    }

    componentDidMount() {
        this.setContent(this.props.action, this.props.selected);
    }

    componentWillReceiveProps(nextProps) {
        this.setContent(nextProps.action, nextProps.selected);
    }

    setContent(action, count) {
        console.log("hello I am in setContent");
        let content = "", ready = false;
        switch(action) {
            case 'pass:left':
                content = "Pass three cards to the player on your left";
                ready = count === 3;
                break;
            case 'pass:right':
                content = "Pass three cards to the player on your right";
                ready = count === 3;
                break;
            case 'pass:across':
                content = "Pass three cards to the player across from you";
                ready = count === 3;
                break;
            case 'pass:hold':
                content = "You will hold onto all your cards this round";
                ready = true;
                break;
            case 'round:play':
                content = "Select a card to play";
                ready = count === 1;
                break;
            case 'round:wait': content = ""; break;
            case 'round:done':
                content = "Click OK to move to the next round";
                ready = true;
                break;
            case 'complete':
                content ="Game over";
                ready=true;
            break;
        }
        this.setState({
            content: content,
            ready: ready
        });
    }

    render() {
        const style = {
            top: `${this.props.top}%`,
            left: `${this.props.left}%`
        };
        style.display = this.state.content !== "" ? "inherit" : "none";
        return <div className="announcement" style={style}>
            <div>{this.props.errorMsg ? this.props.errorMsg : undefined}</div>
            <p>{this.state.content}</p>
            <button disabled={!this.state.ready} onClick={this.props.onClick}>Ok</button>
        </div>;
    }
}
Announcement.propTypes = {
    action:     React.PropTypes.string.isRequired,
    onClick:    React.PropTypes.func.isRequired,
    selected:   React.PropTypes.number.isRequired,
    top:        React.PropTypes.number,
    left:       React.PropTypes.number,
    errorMsg:   React.PropTypes.string
};
Announcement.defaultProps = {
    top:    0,
    left:   35
};