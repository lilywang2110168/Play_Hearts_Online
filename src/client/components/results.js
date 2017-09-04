/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component } from 'react';
import { Link }             from 'react-router';

/*************************************************************************/

export class Results extends Component {
    constructor(props) {
        super(props);
        this.state={game: null}
    }


    componentDidMount() {
        $.ajax({
            url: `/v1/game/${this.props.params.id}`,
            method: "get",
            success: data => {
                this.setState({ game: data });
            },
            error: err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            }
        });
    }

    render() {

        if (this.state.game == null) {
            return null;

        } else {
            let start=new Date(this.state.game.startDate);
            let end=new Date(this.state.game.endDate);
            let dif = end.getTime() -start.getTime();
            let seconds = dif / 1000;
            let index=this.state.game.state.length+1;

            let moves = this.state.game.state.map(state => {
                index--;
                let start=new Date(state.startDate);
                let end=new Date(state.endDate);
                let dif = end.getTime() -start.getTime();
                let seconds = Math.abs(dif / 1000);
                if(seconds=='NaN'){seconds=1.002;}
                let player=state.turn;
                let playerName="/profile/"+state[player].name;
                return <tr key={index}>
                    <th>{index}</th>
                    <th>{seconds} seconds</th>
                    <th><Link to={playerName} >{state[player].name}</Link></th>
                    <th>{state.action}</th>
                </tr>;
            });

            return <div className="row">
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <div className="col-xs-2"><h4>Game Detail</h4></div>
                <div className="col-xs-10">
                    <div className="row">
                        <div className="col-xs-3 text-right">
                            <p><b>Duration:</b></p>
                            <p><b>Number of Moves:</b></p>
                            <p><b>Points:</b></p>
                            <p><b>Cards Remaining:</b></p>
                            <p><b>Able to Move:</b></p>
                        </div>
                        <div className="col-xs-6">
                            <p>{seconds} seconds</p>
                            <p>{this.state.game.state.length}</p>
                            <p>{this.state.game.state[0].player1.points}</p>
                            <p>{this.state.game.state[0].player1.cards.length}</p>
                            <p>{this.state.game.state[0].status? "True" : "False"}</p>

                        </div>
                    </div>
                    <div className="row">
                        <table id="gameTable" className="col-xs-12 table">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Duration</th>
                                <th>Player</th>
                                <th>Move Details</th>
                            </tr>
                            </thead>
                            <tbody>{moves}</tbody>
                        </table>
                    </div>
                </div>
            </div>;
        }
    }
}
