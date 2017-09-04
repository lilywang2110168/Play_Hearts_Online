/* Copyright G. Hemingway, @2017 */
'use strict';

let path            = require('path'),
    express         = require('express'),
    session         = require('express-session'),
    RedisStore      = require('connect-redis')(session),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    mongoose        = require('mongoose');

let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
// Setup pipeline logging
if (env !== 'test') app.use(logger('dev'));
// Setup pipeline support for static pages
app.use(express.static(path.join(__dirname, '../../public')));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
// Setup pipeline session support
app.use(session({
    name: 'session',
    secret: 'ohhellyes',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
}));
// Finish pipeline setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to mongoBD
let options = { promiseLibrary: require('bluebird') };
mongoose.connect('mongodb://127.0.0.1:27017', options, err => {
    if (err) console.log(err);
    else console.log('\t MongoDB connected');
});

// Import our Data Models
app.models = {
    Game: require('./models/game'),
    User: require('./models/user')
};

// Import our API Routes
require('./api/v1/game')(app);
require('./api/v1/user')(app);
require('./api/v1/session')(app);

/**********************************************************************************************************/

// Give them the SPA base page
app.get('*', (req, res) => {
    res.render('base.pug', {});
});

/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log('Example app listening on ' + server.address().port);
});