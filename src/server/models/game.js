/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

/***************** User Model *******************/

/* Schema for individual player state within Hearts */
let HeartsPlayerState = new Schema({
    name: String,
    cards: [ Schema.Types.Object ],
    points: Number
}, { _id : false });

/* Schema for overall hearts game state */
let HeartsGameState = new Schema({
    fetch:{type: String},
    breakHearts:{type: Boolean, default: false},
    player1:    { type: HeartsPlayerState, required: true },
    player2:    { type: HeartsPlayerState, required: true },
    player3:    { type: HeartsPlayerState, required: true },
    player4:    { type: HeartsPlayerState, required: true },
    pile: [Schema.Types.Object],
    endDate:    { type: Date },
    startDate:  { type: Date },

    pileUser:[Schema.Types.Object],
    pileSuit: {type: String, default:""},
    action:     { type: String, enum: [
        'pass:left',
        'pass:right',
        'pass:across',
        'pass:hold',
        'round:play',
        'round:wait',
        'round:done',
        'complete'
    ] },
    turn:       { type: String}
}, { _id : false });

/* Schema for overall game - not Hearts specific */
let Game = new Schema({
    players:    { type: [{ type: String, ref: 'User' }], required: true },
    startDate:  { type: Date },
    endDate:    { type: Date },
    status:     { type: Boolean, default: true},
    creator:    { type: String, ref: 'User', required: true },
    state:      { type: [HeartsGameState] },
    type:       { type: String, required: true, enum: [
        'klondike',
        'pyramid',
        'canfield',
        'golf',
        'yukon',
        'hearts'
    ] },

    draw:       { type: Number, default: 1 }
});

Game.pre('validate', function(next) {
    // Sanitize strings
    //...
    //this.startDate = Date.now();
    next();
});

/***************** Registration *******************/

module.exports = mongoose.model('Game', Game);

