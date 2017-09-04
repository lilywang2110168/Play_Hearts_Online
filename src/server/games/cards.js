/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

const values = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K','A'];
const suits = ['spades', 'clubs', 'hearts', 'diamonds'];


function sortCards(cards) {
    // Sort by suit and then value
    return cards.sort((a, b) => {
        if (a.suit === b.suit)
            return values.indexOf(a.value) < values.indexOf(b.value) ? -1 : 1;
        else
            return suits.indexOf(a.suit) < suits.indexOf(b.suit) ? -1 : 1;
    });
}

function shuffleCards(jokers = false) {
    /* Return an array of 52 cards (if jokers is false, 54 otherwise). */
    let cards = [];
    suits.forEach(suit => {
        values.forEach(value => {
            cards.push({ suit: suit, value: value });
        });
    });
    // Add in jokers here
    if (jokers) { /* TODO: Not implemented for this game */}
    // Now shuffle
    let deck = [];
    while (cards.length > 0) {
        // Find a random number between 0 and cards.length - 1
        const index = Math.floor((Math.random() * cards.length));
        deck.push(cards[index]);
        cards.splice(index, 1);
    }
    return deck;
}

module.exports = {
    shuffle: shuffleCards,
    sort: sortCards,
    values: values,
    suits: suits
};
