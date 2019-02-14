const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express')
const GloSDK = require('@axosoft/glo-sdk');
const next = require('next')
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const session = require('express-session');

const generateMarkdown = require('./generateMarkdown');

const dev = process.env.NODE_ENV !== 'production'

if (dev){
  require('dotenv').config()
}
const app = next({ dev })
const handle = app.getRequestHandler()

const users = {};

const strategy = new OAuth2Strategy({
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: 'board:read'
}, function(accessToken, refreshToken, profile, cb) {
  if (!users[accessToken]){
    users[accessToken] = accessToken
  }
  cb(null, accessToken);
});

passport.serializeUser(function (accessToken, done) {
  done(null, accessToken);
});

passport.deserializeUser(function (accessToken, done) {
  done(null, accessToken);
});

app.prepare()
.then(() => {
  const server = express()

  server.use(bodyParser.json());
  server.use(cookieParser());

  server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
  }));

  passport.use(strategy);
  server.use(passport.initialize());
  server.use(passport.session());
  
  server.get('/auth/login', passport.authenticate('oauth2'));

  server.get('/auth/callback', (req, res, next) => {
    next();
  }, passport.authenticate('oauth2', { failureRedirect: '/auth/login', successRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });
  
  server.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err){
        console.error("Failed to destroy session", err);
      }
      req.logOut();
      res.clearCookie('user_sid');
      res.redirect('/');
    });
  });

  server.get('/api/boards', async (req, res, next) => {
    if (!req.user){
      res.sendStatus(401);
      return;
    }
    
    GloSDK(req.user).boards.getAll()
      .then((boards) => {
        res.send(boards);
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  });

  server.get('/api/boards/:id', async (req, res, next) => {
    if (!req.user){
      res.sendStatus(401);
      return;
    }
    const board = await GloSDK(req.user).boards.get(req.params.id, {
      fields: ['name', 'columns', 'members', 'labels']
    });

    const columnCards = await Promise.all(board.columns.map(column => GloSDK(req.user).boards.columns.getCards(req.params.id, column.id, {
      per_page: 1000,
      fields: ['assignees', "labels", "due_date", "description", "name"]
    })));

    res.send(generateMarkdown(board,columnCards));
  });

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.use((err, req, res, next) => {
    console.log("ERROR", err);
    next(err);
  })
    
  server.listen(8080, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8080')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
