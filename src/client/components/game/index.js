/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

import React, { Component }     from 'react';
import { Announcement }         from './announcement';
import { Pile, genHand }        from './pile';
require('./game.css');

/*************************************************************************/

const PlayerProfile = ({ username, score, size, top, left }) => (
    <div className="player-info" style={{ top: top, left: left }}>
        <span>
            <div>{username}</div>
            <div>Points: {score}</div>
       </span>
    </div>
);

class PlayerPile extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.props.onClick ?
            this.props.onClick :
            this.onClick.bind(this);
    }

    onClick(ev) {
        //console.log(`Default click handler called: ${ev.target.id}`);
    }

    render() {
        const style = {
            left: `${this.props.left}%`,
            top: `${this.props.top}%`
        };
        let pTop = 0;
        let pLeft = 0;
        // Move the profile info
        switch(this.props.profile) {
            case 'bottom:flat': pTop = '21%'; break;
            case 'top': pTop = '-7%'; break;
            case 'top:flat': pTop = '-7%'; break;
        }
        // Gen cards if necessary
        const cards = typeof(this.props.user.cards) === 'object' ? this.props.user.cards : genHand(this.props.user.cards);
        return <div className="player-pile" style={style}>
            <PlayerProfile
                username={this.props.user.name}
                score={this.props.user.points}
                size={this.props.profileSize}
                top={pTop}
                left={pLeft}
            />
            <Pile
                cards={cards}
                horizontal={this.props.horizontal}
                up={this.props.up}
                onClick={this.onClick}
            />
        </div>;
    }
}
PlayerPile.propTypes = {
    user:       React.PropTypes.object.isRequired,
    onClick:    React.PropTypes.func,
    horizontal: React.PropTypes.bool,
    spacing:    React.PropTypes.number,
    selected:   React.PropTypes.arrayOf(React.PropTypes.number),
    up:         React.PropTypes.bool,
    top:        React.PropTypes.number,
    left:       React.PropTypes.number,
};
PlayerPile.defaultProps = {
    horizontal:   true,
    spacing:      40,
    selected:     [],
    up:           true,
    top:          0,
    left:         0,
    profileSize:  30,
    profileBelow: false
};


export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loadingMessage: "Loading",
            errorMessage: undefined,
            maxSelected: 0
        };
        this.onCardClick = this.onCardClick.bind(this);
        this.onAnnouncement = this.onAnnouncement.bind(this);
    }

    fetchState() {
        let self=this;
        $.ajax({
            method: 'GET',
            url: `/v1/game/${this.props.params.id}`,
            success: data => {
              let myGame=data.state[0];
                // What action are we on?
                switch(myGame.action) {
                    case 'pass:left':
                    case 'pass:right':
                    case 'pass:across':
                        this.setState({ maxSelected: 3 });
                        break;
                    case 'round:play':
                        this.setState({ maxSelected: 1 });
                        break;
                    case 'round:wait':
                        setTimeout(function(){
                           self.onAnnouncement();
                        }, 1000);
                        break;
                    case 'complete':
                        this.setState({ maxSelected: 0 });
                        break;
                    case 'pass:hold':
                    case 'round:done':
                }
                this.setState(myGame);
                this.setState({ loaded: true });
            },
            error: ({ responseJSON }) => {
                this.setState({ loadingMessage: responseJSON.error });
            }
        });
    }

    componentDidMount() {
        //so the get /v1/state/game is called when the component is mounted...
        this.fetchState();
    }

    onCardClick(ev) {


        let target = ev.target.id.split(':');
        // Is there a suitable card?
        let index = this.state.player1.cards.findIndex(card => {
            return card.suit === target[0] && card.value == target[1]
        });
        // Did we find a card?
        if (index !== -1) {
            let card = this.state.player1.cards[index];
            // Need to make sure maxSelected isn't exceeded
            const count = this.state.player1.cards.reduce((acc, card) => card.selected ? acc + 1 : acc, 0);
            if (card.selected) {
                card.selected = false;
                this.setState({
                    player1: {
                        name: this.state.player1.name,
                        points: this.state.player1.points,
                        cards: this.state.player1.cards
                    }
                });
            }
            else if (count < this.state.maxSelected) {
                card.selected = true;
                this.setState({
                    player1: {
                        name: this.state.player1.name,
                        points: this.state.player1.points,
                        cards: this.state.player1.cards
                    }
                });
            }
        }
    }

    onAnnouncement() {
        let self=this;
        let data = {
            cards: this.state.player1.cards.filter(card => card.selected).map(card => {
                return {
                    value: card.value,
                    suit: card.suit
                }
            })
        };
        // Ajax the data to push the state

        //updating the game...
        //every time the announcement is clicked...
        $.ajax({
            url: `/v1/game/${this.props.params.id}`,
            method: 'PUT',
            data: data,
            success: state => {
                this.setState(state);
                if(state.action=='round:wait'){
                    setTimeout(function(){
                        self.onAnnouncement();
                    }, 1000);
                }
            },
            error: err => {
                this.setState({ errorMessage: err.responseJSON.error });
                console.log(err.responseJSON);
            }
        });
    }

    render() {
        return this.state.loaded ?
            <div className="card-base">
                <PlayerPile
                    top={4}
                    left={25}
                    user={this.state.player3}
                    profile={'top:flat'}
                    up={false}
                />
                <PlayerPile
                    top={10}
                    left={2}
                    user={this.state.player2}
                    profile={'top'}
                    horizontal={false}
                    up={false}
                />
                <Pile
                    top={30}
                    left={28}
                    cards={this.state.pile}
                    maxCards={4}
                    spacing={12}
                />
                <Announcement
                    top={55}
                    action={this.state.action}
                    selected={this.state.player1.cards.reduce((acc, card) => card.selected ? acc + 1 : acc, 0)}
                    onClick={this.onAnnouncement}
                    error={this.state.errorMessage}
                />
                <PlayerPile
                    top={10}
                    left={90}
                    user={this.state.player4}
                    profile={'top'}
                    horizontal={false}
                    up={false}
                />
                <PlayerPile
                    top={70}
                    left={25}
                    user={this.state.player1}
                    profile={'bottom:flat'}
                    onClick={this.onCardClick}
                />
            </div> :
            <div>{this.state.loadingMessage}</div>;
    }
}
