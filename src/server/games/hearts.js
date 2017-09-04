/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

//be carefull about the data type
const Cards = require('./cards'),
      Robot   = require('./robots');

const playerArray = ['player1', 'player2', 'player3', 'player4'];
let currentGame;
let currentAction;

function findCard(state, card) {
    let found = false;
    playerArray.forEach(player => {
        const cards = state[player].cards;
        const index = cards.map(x => x.value === card.value && x.suit === card.suit).indexOf(true);
        if (index !== -1) {
            found = { player: player, index: index };
        }
    });
    return found;
}


/* Generate and return an initial state for a game */
function initialState(config, player) {
    let now=Date.now();
    let data = {
        creator: player,
        players: config.players,
        state: [{
            player1: { name: config.players[0], cards: [], points: 0, human: true },
            player2: { name: config.players[1], cards: [], points: 0, human: false },
            player3: { name: config.players[2], cards: [], points: 0, human: false },
            player4: { name: config.players[3], cards: [], points: 0, human: false },
            pile: [],
            action: 'pass:left',
            turn: ''
        }],
        startDate: now,
        type: config.game,
        color: config.color
    };
    // Get the shuffled deck and distribute it to the players
    const deck = Cards.shuffle(false);
    let state = data.state[0];
    for (let i = 0; i < 13; ++i) {
        // Deal out the cards
        playerArray.forEach((player, j) => {
            const index = i * 4 + j;
            state[player].cards.push(deck[index]);
        });
    }
    // Initial state is ready
    return data;
}


// From the perspective of USER, filter the game state (i.e. hide other players cards)
function filterStateForUser(state, user) {
    let filteredState = {
        pile:   state.pile,
        action: state.action,
        turn:   state.turn
    };

    // Filter other player's cards
    playerArray.forEach(player => {
        // Copy the player's state - easier to modify this way
        const p = Object.assign(state[player]);
        // TODO: Consider filtering user's cards even further based on state.action - i.e. remove passed cards
        filteredState[player] = {
            points: p.points,
            name: p.name,
            // If these are the user's cards go ahead, otherwise just pass the count
            cards: state[player].name === user ? Cards.sort(p.cards) : p.cards.length
        };
    });

    // Have to do some clean up based on state
    switch(state.action) {
        case 'pass:left':
        case 'pass:right':
        case 'pass:across':
        case 'pass:hold':
            filteredState.pile = [];
            break;
    }

    return filteredState;
}


// Filter a list of a player's games for the profile page
function filterForProfile(game, user) {
    // Status	Start Date	# of moves	Score	Game Type
    const state = game.state[0];
    return {
        id: game.id,
        active: game.status,
        start: game.startDate,
        moves: game.state.length - 1,
        score: state['player1'].points,
        game: 'hearts'
    };
}

/****************************************************************************************************/

//it's easier to implement it for bots too.


function passLeft(user, game, move) {
if(game.state[0].player1.name===user){
    game.state[0].player1.cards=eliminateCards(game.state[0].player1.cards, move);
    game.state[0].player2.cards=addCards(game.state[0].player2.cards, move);
}else if(game.state[0].player2.name===user){
    game.state[0].player2.cards=eliminateCards(game.state[0].player2.cards, move);
    game.state[0].player3.cards=addCards(game.state[0].player3.cards, move);
}
else if(game.state[0].player3.name===user){
    game.state[0].player3.cards=eliminateCards(game.state[0].player3.cards, move);
    game.state[0].player4.cards=addCards(game.state[0].player4.cards, move);

}
else if(game.state[0].player4.name===user){
    game.state[0].player4.cards=eliminateCards(game.state[0].player4.cards, move);
    game.state[0].player1.cards=addCards(game.state[0].player1.cards, move);
}
}


function passRight(user, game, move) {
    if(game.state[0].player1.name===user){
        game.state[0].player1.cards=eliminateCards(game.state[0].player1.cards, move);
        game.state[0].player4.cards=addCards(game.state[0].player4.cards, move);
    }else if(game.state[0].player2.name===user){
        game.state[0].player2.cards=eliminateCards(game.state[0].player2.cards, move);
        game.state[0].player1.cards=addCards(game.state[0].player1.cards, move);
    }
    else if(game.state[0].player3.name===user){
        game.state[0].player3.cards=eliminateCards(game.state[0].player3.cards, move);
        game.state[0].player2.cards=addCards(game.state[0].player2.cards, move);

    }
    else if(game.state[0].player4.name===user){
        game.state[0].player4.cards=eliminateCards(game.state[0].player4.cards, move);
        game.state[0].player3.cards=addCards(game.state[0].player3.cards, move);
    }
}

function passAcross(user, game, move) {
    if(game.state[0].player1.name===user){
        game.state[0].player1.cards=eliminateCards(game.state[0].player1.cards, move);
        game.state[0].player3.cards=addCards(game.state[0].player3.cards, move);
    }else if(game.state[0].player2.name===user){
        game.state[0].player2.cards=eliminateCards(game.state[0].player2.cards, move);
        game.state[0].player4.cards=addCards(game.state[0].player4.cards, move);
    }
    else if(game.state[0].player3.name===user){
        game.state[0].player3.cards=eliminateCards(game.state[0].player3.cards, move);
        game.state[0].player1.cards=addCards(game.state[0].player1.cards, move);

    }
    else if(game.state[0].player4.name===user){
        game.state[0].player4.cards=eliminateCards(game.state[0].player4.cards, move);
        game.state[0].player2.cards=addCards(game.state[0].player2.cards, move);
    }
}


function addCards(cards,add) {
    for (let i = 0; i < add.length; i++) {
        cards.push(add[i]);
    }
    return cards;
}


function eliminateCards(cards, remove){
   let  size=cards.length-remove.length;
   for(let i=0; i<size;i++){
       for(let j=0; j<remove.length;j++){
           if(cards[i].suit == remove[j].suit && cards[i].value == remove[j].value){
               cards.splice(i, 1);
               i--;
               break;
       }
       }
   }
   cards=cards.slice(0, size);
   return cards;
}



function endRound(game)     {
    game.state[0].action='round:done';
}

function findSuit(cards, suit)     {
    for(let i=0; i<cards.length; i++){
        if(cards[i].suit===suit){
            return true;
        }
    }
    return false;
}

function roundPlay(user, game, move) {
    if(move.length<1){
        checkTurn(game);
     //endRound(game);
    }

    if(game.state[0].player1.name===user){
      //okay I think break hearts works most of the cases...
        if(game.state[0].pile.length!=0 && game.state[0].pile[0].suit!=move.cards[0].suit && findSuit(game.state[0].player1.cards, game.state[0].pile[0].suit))
        {
            return;
        }

        if(game.state[0].pile.length===0 && move.cards[0].suit=='hearts' && !game.state[0].breakHearts){
            //hmmm the player wants to break hearts
            if(findSuit(game.state[0].player1.cards, 'spades')|| findSuit(game.state[0].player1.cards, 'diamonds')
                    || findSuit(game.state[0].player1.cards, 'clubs')){
                //nope you may not break hearts
                return;
            }
            game.state[0].breakHearts=true;
        }

        game.state[0].player1.cards=eliminateCards(game.state[0].player1.cards, move.cards);
        addCardsToPile(game, move.cards, 'player1');

        if(game.state[0].pile.length<4){
            game.state[0].turn='player2';
            game.state[0].action='round:wait';
            setTimeout(function(){
                roundPlay(game.state[0].player2.name,game, Robot.selectOne(game,game.state[0].player2.cards,game.state[0].pileSuit));
            },1000);}
        else{
            checkTurn(game);
        }

    }else if(game.state[0].player2.name===user){
        game.state[0].player2.cards=eliminateCards(game.state[0].player2.cards, move);
        addCardsToPile( game, move,'player2');
        if(game.state[0].pile.length<4){
            game.state[0].turn='player3';
            setTimeout(function(){
                roundPlay(game.state[0].player3.name,game, Robot.selectOne(game,game.state[0].player3.cards, game.state[0].pileSuit));
            },1000);}
        else{
            checkTurn(game);
        }
    }
    else if(game.state[0].player3.name===user){
        game.state[0].player3.cards=eliminateCards(game.state[0].player3.cards, move);
        addCardsToPile(  game, move, 'player3');
        if(game.state[0].pile.length<4){
            game.state[0].turn='player4';
            setTimeout(function(){
                roundPlay(game.state[0].player4.name,game, Robot.selectOne(game, game.state[0].player4.cards,game.state[0].pileSuit));
            },1000);}
        else{
            checkTurn(game);
        }
    }
    else if(game.state[0].player4.name===user){
        game.state[0].player4.cards=eliminateCards(game.state[0].player4.cards, move);
        addCardsToPile(game, move, 'player4');
        if(game.state[0].pile.length<4){
            game.state[0].turn='player1';
            game.state[0].action='round:play';
        }
        else{
            checkTurn(game);
        }
    }
}


function checkTurn (game) {
    let suit=game.state[0].pileSuit;
    let pileUser=game.state[0].pileUser;
    let pile=game.state[0].pile;
    let nextUser;

    //ending a round...


    //i added this and also the set timeout..
    game.state[0].action='round:wait';

    let sorted=[];
    for(let i=0; i<pile.length;i++){
        if(pile[i].suit=='hearts'){
            game.state[0].breakHearts=true;
        }
       if(pile[i].suit==suit) {
           sorted.push(pile[i]);
       }
    }

    Cards.sort(sorted);
    let max=sorted[sorted.length-1];

    for(let i=0; i<pile.length;i++){
        if(pile[i].suit==max.suit  &&pile[i].value==max.value) {
            nextUser=pileUser[i];
        }
    }
    game.state[0].turn=nextUser;
    addPoints(game,nextUser);
    //if the game has ended

    if(game.state[0].action=='complete'){
        return;
    }
    //let round wait to pick the user...

    if(game.state[0].player1.cards.length==0 && game.state[0].player2.cards.length==0
        && game.state[0].player3.cards.length==0&& game.state[0].player4.cards.length==0){
        endRound(game);
        return;
    }


    setTimeout(function(){


        game.state[0].pile=[];
        game.state[0].pileUser=[];

        setTimeout(function(){
    if(nextUser=='player1'){
        game.state[0].action='round:play';
    }else if (nextUser=='player2'){
        roundPlay(game.state[0].player2.name,game, Robot.selectOne(game, game.state[0].player2.cards,game.state[0].pileSuit));
    }else if (nextUser=='player3'){
        roundPlay(game.state[0].player3.name,game, Robot.selectOne(game, game.state[0].player3.cards,game.state[0].pileSuit));
    }
    else if (nextUser=='player4'){
        roundPlay(game.state[0].player4.name,game, Robot.selectOne(game, game.state[0].player4.cards,game.state[0].pileSuit));
    } },1000);
},1000); }


function addPoints(game,user)    {
    let pile=game.state[0].pile;
    let points=0;
    for(let i=0; i<pile.length;i++){
        if(pile[i].suit=='hearts') {
            points++;
        }
        if(pile[i].suit=='spades' && pile[i].value=='Q'){
            points=points+13;
        }
    }
    if(user=='player1'){
        game.state[0].player1.points= game.state[0].player1.points+points;
        if( game.state[0].player1.points>=100){
          gameComplete(game, game.state[0].player1.name);
        }
    }else if (user=='player2'){
        game.state[0].player2.points= game.state[0].player2.points+points;
        if( game.state[0].player2.points>=100){
            gameComplete(game, game.state[0].player2.name);
        }
    }else if (user=='player3'){
        game.state[0].player3.points= game.state[0].player3.points+points;
        if( game.state[0].player3.points>=100){
            gameComplete(game, game.state[0].player3.name);
        }
    }
    else if (user=='player4'){
        game.state[0].player4.points= game.state[0].player4.points+points;
        if( game.state[0].player3.points>=100){
            gameComplete(game, game.state[0].player4.name);
        }
    }
}


function gameComplete(game, user)    {
    game.state[0].pile=[];
    game.state[0].action='complete';
}

function addCardsToPile(game, add, user)    {
    let pile=game.state[0].pile;
    if(pile.length==0){
        game.state[0].pileUser=[];
        game.state[0].pileSuit=add[0].suit;
    }

    pile.push(add[0]);
    game.state[0].pileUser.push(user);
}


//okay because round wait would just continue to play the next game......
function roundWait(user, game, move){
   let player=game.state[0].turn;
   if(game.state[0].player1.points>=100 || game.state[0].player2.points>=100
       || game.state[0].player3.points>=100 || game.state[0].player4.points>=100){
       gameComplete(game);
       return;
   }

    if(player=='player1'){
        //updating the current game
        if(game.state[0].pile.length<4){
        game.state[0].action='round:play';}
}}

function roundDone(user, game, move)    {
    const deck = Cards.shuffle(false);
    let state=game.state[0];
    state.pile=[];
    state.pileUser=[];

    for (let i = 0; i < 13; ++i) {
        // Deal out the cards
        playerArray.forEach((player, j) => {
            const index = i * 4 + j;
            state[player].cards.push(deck[index]);
        });
    }
    if(currentAction=='pass:left'){
    state.action="pass:right";}
    else if(currentAction=='pass:right'){
        state.action='pass:across';}
    else if(currentAction=='pass:across'){
        state.action='pass:hold';}
        else if(currentAction=='pass:hold'){
        state.action='pass:left';}
}



/****************************************************************************************************/

// Try to update the state of the game - reject with error if move is invalid
function pushState(user, game, move, cb) {
    if(currentGame!=null){
    currentGame.state[0].startDate=Date.now();}
    game.state[0].startDate=Date.now();

    if(game.state[0].player1.cards.length==0 && game.state[0].player2.cards.length==0
        && game.state[0].player3.cards.length==0&& game.state[0].player4.cards.length==0){
        game.state[0].action='round:done';
    }


    const state = game.state[0];
    if(game.state[0].fetch=="true"){
        //updating the game!
        currentGame=game;
        game.state[0].fetch="false";
      return;
    }
    switch(state.action) {
        case 'pass:left':
             currentAction='pass:left';
             game.state[0].breakHearts=false;
             passLeft('computer1', game, Robot.selectCards(game.state[0].player2.cards, 3));
             passLeft('computer2', game, Robot.selectCards(game.state[0].player3.cards, 3));
             passLeft('computer3', game, Robot.selectCards(game.state[0].player4.cards, 3));
             passLeft(user, game, move.cards);
             playStart(game, user);
             game.state[0].endDate=Date.now();
            return cb(0, game.state[0],false);
        case 'pass:right':
            currentAction='pass:right';
            game.state[0].breakHearts=false;
            passRight('computer1', game, Robot.selectCards(game.state[0].player2.cards, 3));
            passRight('computer2', game, Robot.selectCards(game.state[0].player3.cards, 3));
            passRight('computer3', game, Robot.selectCards(game.state[0].player4.cards, 3));
            passRight(user, game, move.cards);
            playStart(game, user);
            game.state[0].endDate=Date.now();
            return cb(0, game.state[0],false);
        case 'pass:across':
            currentAction='pass:across';
            game.state[0].breakHearts=false;
            passAcross('computer1', game, Robot.selectCards(game.state[0].player2.cards, 3));
            passAcross('computer2', game, Robot.selectCards(game.state[0].player3.cards, 3));
            passAcross('computer3', game, Robot.selectCards(game.state[0].player4.cards, 3));
            passAcross(user, game, move.cards);
            playStart(game, user);
            game.state[0].endDate=Date.now();
            return cb(0, game.state[0],false);
        case 'pass:hold':
            currentAction='pass:hold';
            game.state[0].breakHearts=false;
            playStart(game, user);
            game.state[0].endDate=Date.now();
            return cb(0, game.state[0],false);
        case 'round:play':
            roundPlay(user, currentGame, move);
            currentGame.state[0].endDate=Date.now();
            return cb(0, currentGame.state[0],false);
        case 'round:wait':
            roundWait(user, currentGame, move);
            currentGame.state[0].endDate=Date.now();
            return cb(0, currentGame.state[0],false);
        case 'round:done':
            currentGame=game;
             roundDone(user,currentGame, move);
            currentGame.state[0].endDate=Date.now();
            return cb(0, currentGame.state[0],false);
        case 'complete':
            //gameComplete(user, currentGame, move);
            //state.endDate=Date.now();
            state.endDate=Date.now();
            return cb(0, state,true);
    }
}

function playStart(game) {
    currentGame=game;
    let found=findCard(game.state[0], {"value":"2","suit":"clubs"});
    game.state[0].turn=found.player;

    if(found.player!='player1'){
        game.state[0].action='round:wait';
        setTimeout(function(){
            if(found.player=='player2'){
                roundPlay(game.state[0].player2.name, currentGame, Robot.selectOne(game, game.state[0].player2.cards,game.state[0].pileSuit));
            }else if(found.player=='player3'){
                roundPlay(game.state[0].player3.name, currentGame, Robot.selectOne(game, game.state[0].player3.cards,game.state[0].pileSuit));

            } else if(found.player=='player4'){
                roundPlay(game.state[0].player4.name,currentGame, Robot.selectOne(game, game.state[0].player4.cards,game.state[0].pileSuit));
            }
        }, 1000);
    }else{
        game.state[0].action='round:play';
    }
}

module.exports = {
    initialState:       initialState,
    filterStateForUser: filterStateForUser,
    filterForProfile:   filterForProfile,
    pushState:          pushState,
};


//how come round:wait can become round player1??
