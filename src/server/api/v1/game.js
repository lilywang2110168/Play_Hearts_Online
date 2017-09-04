/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let Joi         = require('joi'),
    Hearts      = require('../../games/hearts');

module.exports = app => {

    // Handle POST to create a new game
    app.post('/v1/game', (req, res) => {
       if (!req.session.user) {
           res.status(401).send({ error: 'unauthorized' });
       } else {
            // Schema for user info validation
            let schema = Joi.object().keys({
                game: Joi.string().lowercase().required(),
                color: Joi.string().lowercase().required(),
                draw: Joi.any(),
                players: Joi.array().items(Joi.string().lowercase().alphanum())
            });
            // Validate user input
            Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
                if (err) {
                    const message = err.details[0].message;
                    console.log(`Game.create validation failure: ${message}`);
                    res.status(400).send({error: message});
                } else {
                    // Set the creator
                    const player = req.session.user._id;
                    const state = Hearts.initialState(data, player);
                    let game = new app.models.Game(state);
                    game.save(err => {
                        if (err) {
                            console.log(`Game.create save failure: ${err}`);
                            res.status(400).send({ error: 'failure creating game' });
                        } else {
                            console.log(game);
                            const query = { $push: { games: game._id }};
                            // Save game to user's document too
                            app.models.User.findOneAndUpdate({ _id: req.session.user._id }, query, () => {
                                res.status(201).send({
                                    id: game._id
                                });
                            });
                        }
                    });
                }
            });
       }
    });

    // Handle GET to fetch game state
    app.get('/v1/game/:id', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'unauthorized' });
        } else {
            const user = req.session.user._id;
            app.models.Game.findById(req.params.id, (err, game) => {
                if (err || ! game) {
                    console.log(`Game.get failure: ${err}`);
                    res.status(404).send({error: `unknown game: ${req.params.id}`});
                } else {
                    game.state[0]=Hearts.filterStateForUser( game.state[0], user);
                    res.status(200).send(game);
                    let Game;
                    //What kind of game are we playing?
                    switch(game.type) {
                        case 'hearts': Game = Hearts;
                    }
                    game.state[0].fetch="true";
                    Game.pushState(user, game, "");
                }
            });
        }
    });

    // Handle PUT for game update
    app.put('/v1/game/:id', (req, res) => {
        if (!req.session.user) {
            return res.status(401).send({ error: 'unauthorized' });
        }
 
        // Schema for game move validation
        let schema = Joi.object().keys({
            cards: Joi.array().items(Joi.object())
        });
        // Validate user input
        Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`Game.create validation failure: ${message}`);
                res.status(400).send({error: message});
            } else {
                const user = req.session.user._id;
                const move = req.body;
                app.models.Game.findById(req.params.id)
                    .populate('players')
                    .exec((err, game) => {
                        if (err) {
                            console.log(`Game.push failure: ${err}`);
                            res.status(404).send({ error: `unknown game: ${req.params.id}` });
                        } else {
                            let Game;
                            //What kind of game are we playing?
                            switch(game.type) {
                             case 'hearts': Game = Hearts;
                            }

                            console.log("This is the game I found");
                            console.log(game);

                            // Handle what happens after we have processed the move
                            Game.pushState(user, game, move, (err, nextState, replaceState=false) => {
                                if (err) {
                                    console.log(`Game.push failure 2: ${err.error}`);
                                    res.status(404).send(err);
                                } else {
                                    if (replaceState) {
                                        // Replace the current state
                                        game.state[0] = nextState;
                                    } else {
                                        // Push a new game state
                                        game.state.unshift(nextState);
                                    }

                                    game.markModified('state');
                                    game.markModified('status');
                                    game.markModified('endDate');

                                    game.endDate=Date.now();
                                    if(nextState.action=='complete'){
                                        console.log("I am setting status");
                                        game.status=false;
                                    }

                                    game.save((err, updatedGame) => {
                                        if (err) {
                                            console.log(`Game.push failure 3: ${err}`);
                                            res.status(404).send(err);
                                        } else {

                                            const response = Game.filterStateForUser(nextState, user);
                                            res.status(200).send(response);
                                        }
                                    });
                                }
                            });
                        }
                    });
            }
        });
    });
};
