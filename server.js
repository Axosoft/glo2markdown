const express = require('express')
const session = require('express-session');
const next = require('next')
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');

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
    
    axios.get(`${process.env.API_URL}/boards`, {
      headers: {
        "Authorization": req.user,
        "Content-Type": "application/json"
      }
    }).then(({data: boards}) => {
      res.send(boards);
    }).catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
  });

  server.get('/api/boards/:id', async (req, res, next) => {
    if (!req.user){
      res.sendStatus(401);
      return;
    }
    Promise.all(
      [
        axios.get(`${process.env.API_URL}/boards/${req.params.id}/cards?fields=id,name,board_id,column_id,members,labels,description`, {
          headers: {
            "Authorization": req.user,
            "Content-Type": "application/json"
          }
        }),
        axios.get(`${process.env.API_URL}/boards/${req.params.id}?fields=id,name,columns,members,labels`, {
          headers: {
            "Authorization": req.user,
            "Content-Type": "application/json"
          }
        })
    ]).then(([{ data: cards },{ data: board }]) => {
      res.send(generateMarkdown(board,cards));
    }).catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
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
