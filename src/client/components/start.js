/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { browserHistory }       from 'react-router';
require('./start.css');

/*************************************************************************/

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            human: this.props.onChange ? false : true,
            disabled: this.props.onChange ? false : true,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        // Do we need to update the name
        if (this.props.onChange)
            this.props.onChange({ id: this.props.id, value: ev.target.value });
        if (ev.target.value !== "") {
            $.ajax({
                url: `/v1/user/${ev.target.value}`,
                method: "head",
                success: () => {
                    this.setState({human: true});
                },
                error: () => {
                    this.setState({human: false});
                }
            });
        } else this.setState({ human: false });
    }

    render() {
        const playerId = `player-${this.props.id}`;
        return <div className="player">
            <label className="control-label" htmlFor={playerId}>Player {this.props.id}:</label>
            <div>
                <img src={this.state.human ? '/images/person.png' : '/images/robot.jpg'}/>
                <input className="form-control player" onChange={this.onChange} value={this.props.username} disabled={this.state.disabled}/>
            </div>
        </div>;
    };
}

const MultiPlayer = ({ players, onChange }) => {
    let objs = [<Player key={0} id={0} username={players[0]}/>];
    for (let i = 1; i < players.length; ++i) objs.push(
        <Player key={i} id={i} username={players[i]} onChange={onChange}/>
    );
    return <div className="players">
            <h4>Players:</h4>
            {objs}
        </div>;
};

/*************************************************************************/

export class Start extends Component {
    constructor(props) {
        super(props);
        const { username } = this.props.route.user.getUser();
        this.state = {
            games: ['klondyke', 'pyramid', 'canfield', 'golf', 'yukon', 'hearts'],
            selected: 'klondyke',
            players: [username, 'Computer1', 'Computer2', 'Computer3'],
            disabled: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPlayersChange = this.onPlayersChange.bind(this);
    }

    componentWillMount() {
        if (!this.props.route.user.getUser()) browserHistory.push('/login');
    }

    onPlayersChange({ id, value }) {
        let players = this.state.players;
        let disabled = false;
        players[id] = value;
        let errorEl = document.getElementById('errorMsg');
        errorEl.innerHTML = '';
        // Validate all player names are unique
        const check = new Set(players);
        if (check.size !== players.length) {
            errorEl.innerHTML = `Every player must be unique`;
            disabled = true;
        }
        // Check that all players have names
        if (players.indexOf('') !== -1) {
            errorEl.innerHTML = `Every player must have a name`;
            disabled = true;
        }
        // Set the final state
        this.setState({
            players: players,
            disabled: disabled
        });
    }

    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            game: this.state.selected,
            draw: document.getElementById('draw').value,
            color: document.getElementById('color').value,
            players: this.state.players
        };
        if (data.game === 'hearts') {
            delete data.draw;
        }
        $.ajax({
            url: "/v1/game",
            method: "post",
            data: data,
            success: (data) => {
                browserHistory.push(`/game/${data.id}`);
            },
            error: (err) => {
                console.log(err);
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            }
        });
    }

    onChange(ev) {
        if(this.state.selected !== ev.target.value) {
            this.setState({ selected: ev.target.value });
        }
    }

    render() {
        const games = this.state.games.map((game, index) => {
            return <div key={index} className="radio">
                <label>
                    <input type="radio" name="game" value={game} checked={game === this.state.selected} onChange={this.onChange}/>
                    {game}
                </label>
            </div>
        });
        // Is there a multi-player component
        const players = this.state.selected === 'hearts' ?
            <MultiPlayer players={this.state.players} onChange={this.onPlayersChange}/> :
            undefined;
        return <div className="row">
            <div className="col-xs-2"></div>
            <div className="col-xs-8">
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <h4>Create New Game</h4>
                <form className="form-horizontal" action="/start" method="post">
                    <div className="form-group col-xs-4">{games}</div>
                    <div className="form-group col-xs-8">
                        <div className="row">
                            <div className="col-xs-12">
                                <label className="control-label" htmlFor="draw">Draw:</label>
                                <select id="draw" name="draw" className="form-control" disabled={'hearts' === this.state.selected}>
                                    <option value="1">Draw 1</option>
                                    <option value="3">Draw 3</option>
                                </select>
                            </div>
                            <div className="col-xs-12">
                                <label className="control-label" htmlFor="color">Card Color:</label>
                                <select id="color" name="color" className="form-control">
                                    <option>Red</option>
                                    <option>Green</option>
                                    <option>Blue</option>
                                    <option>Magical</option>
                                </select>
                            </div>
                            <div className="col-xs-12">
                                {players}
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-xs-12">
                        <button className="btn btn-default" onClick={this.onSubmit} disabled={this.state.disabled}>Start</button>
                    </div>
                </form>
            </div>
        </div>
    }
}
