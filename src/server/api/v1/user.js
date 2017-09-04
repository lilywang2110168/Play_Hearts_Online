/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let Joi = require('joi');
let Hearts = require('../../games/hearts');

module.exports = app => {

    /*
     * Create a new user
     *
     * @param {req.body.username} Display name of the new user
     * @param {req.body.first_name} First name of the user - optional
     * @param {req.body.last_name} Last name of the user - optional
     * @param {req.body.city} City user lives in - optional
     * @param {req.body.primary_email} Email address of the user
     * @param {req.body.password} Password for the user
     * @return {201, {username,primary_email}} Return username and others
     */
    app.post('/v1/user', (req, res) => {
        // Schema for user info validation
        let schema = Joi.object().keys({
            username:       Joi.string().lowercase().alphanum().min(3).max(32).required(),
            primary_email:  Joi.string().lowercase().email().required(),
            first_name:     Joi.string().allow(''),
            last_name:      Joi.string().allow(''),
            city:           Joi.string().default(''),
            password:       Joi.string().min(5).required()
        });
        // Validate user input
        Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`User.create validation failure: ${message}`);
                res.status(400).send({ error: message });
            } else {
                // Setup the _id field as the username
                data._id = data.username;
                delete data.username;
                // Try to create the user
                let user = new app.models.User(data);
                user.save(err => {
                    if (err) {
                        // Error if username is already in use
                        if (err.code === 11000) {
                            if (err.message.indexOf('_id_') !== -1)
                                res.status(400).send({error: 'username already in use'});
                            if (err.message.indexOf('primary_email_1') !== -1)
                                res.status(400).send({error: 'email address already in use'});
                        }
                        // Something else in the username failed
                        else res.status(400).send({error: 'invalid username'});
                    } else {
                        // Send the happy response back
                        res.status(201).send({
                            username: user._id,
                            primary_email: data.primary_email
                        });
                    }
                });
            }
        });
    });

    /*
     * See if user exists
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200 || 404}
     */
    app.head('/v1/user/:username', (req, res) => {
        app.models.User.findById(req.params.username.toLowerCase(), (err, user) => {
            if (err) res.status(500).send({ error: 'server error' });
            else if (!user) res.status(404).send({ error: `unknown user: ${req.params.username}` });
            else res.status(200).end();
        });
    });

    /*
     * Fetch user information
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200, {username, primary_email, first_name, last_name, city, games[...]}}
     */
    app.get('/v1/user/:username', (req, res) => {
        app.models.User.findById(req.params.username.toLowerCase())
            .populate('games')
            .exec((err, user) => {
            if (err) res.status(500).send({ error: 'server error' });
            else if (!user) res.status(404).send({ error: `unknown user: ${req.params.username}` });
            else {
                // Filter games data for only profile related info
                const filteredGames = user.games.map(game => {
                    switch (game.type) {
                        case 'hearts': return Hearts.filterForProfile(game, user.username);
                    }
                });
                res.status(200).send({
                    username: user.id,
                    primary_email: user.primary_email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    city: user.city,
                    games: filteredGames
                });
            }
        });
    });

    /*
     * Update a user's profile information
     *
     * @param {req.body.first_name} First name of the user - optional
     * @param {req.body.last_name} Last name of the user - optional
     * @param {req.body.city} City user lives in - optional
     * @return {204, no body content} Return status only
     */
    app.put('/v1/user', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'unauthorized' });
        } else {
            let schema = Joi.object().keys({
                first_name: Joi.string().allow(''),
                last_name: Joi.string().allow(''),
                city: Joi.string().allow(''),
            });
            Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
                if (err) {
                    const message = err.details[0].message;
                    console.log(`User.update validation failure: ${message}`);
                    res.status(400).send({error: message});
                } else {
                    const query = { id: req.session.user.id };
                    app.models.User.findOneAndUpdate(query, {$set: data}, {new: true}, (err, user) => {
                        if (err || !user) {
                            console.log(`User.update logged-in user not found: ${req.session.user.id}`);
                            res.status(500).end();
                        } else {
                            // Update session
                            req.session.user = user;
                            res.status(204).end();
                        }
                    });
                }
            });
        }
    });
};
