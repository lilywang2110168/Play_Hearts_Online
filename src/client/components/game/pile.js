/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

import React, { Component }     from 'react';
require('./pile.css');


function mapCardToPath(card) {
    switch(card.value) {
        case 'A': return `/images/ace_of_${card.suit}.png`;
        case 'K': return `/images/king_of_${card.suit}.png`;
        case 'Q': return `/images/queen_of_${card.suit}.png`;
        case 'J': return `/images/jack_of_${card.suit}.png`;
        default: return `/images/${card.value}_of_${card.suit}.png`;
    }
}

export const genHand = count => {
    let hand = [];
    for (let i = 0; i < count; ++i) hand.push({ suit: 'hearts', value: 'A'});
    return hand;
};

/*************************************************************************/

export const Card = ({ card, up, top, left, onClick }) => {
    const source = up ? mapCardToPath(card) : "/images/face_down.jpg";
    const style = {left: `${left}%`, top: `${top}%`};
    const id = `${card.suit}:${card.value}`;
    return <img
        id={id}
        onClick={onClick}
        className="card"
        style={style}
        src={source}
    />;
};

export class Pile extends Component {
    render() {
        const offset = (this.props.maxCards - this.props.cards.length) * 2;
        const cards = this.props.cards.map((card, index) => {
            let top = this.props.horizontal ? 0 : index * this.props.spacing + offset;
            let left = this.props.horizontal ? index * this.props.spacing + offset : 0;
            if (card.selected && this.props.horizontal) {
                top = -3;
            }
            return <Card
                key={index}
                card={card}
                up={this.props.up}
                top={top}
                left={left}
                onClick={this.props.onClick}
            />;
        });
        const style = {
            left: `${this.props.left}%`,
            top: `${this.props.top}%`
        };
        return <div className="card-pile" style={style}>
            {cards}
        </div>;
    }
}
Pile.propTypes = {
    cards:      React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onClick:    React.PropTypes.func,
    horizontal: React.PropTypes.bool,
    spacing:    React.PropTypes.number,
    maxCards:   React.PropTypes.number,
    up:         React.PropTypes.bool,
    top:        React.PropTypes.number,
    left:       React.PropTypes.number
};
Pile.defaultProps = {
    horizontal: true,       // Layout horizontal?
    spacing:    4,          // In percent
    maxCards:   13,         // Centers based on this number
    up:         true,       // Are cards face-up?
    top:        0,
    left:       0
};
