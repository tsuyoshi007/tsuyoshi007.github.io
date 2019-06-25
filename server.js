const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session')
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;



let users = [
    {
      id: 1,
      username:"ahpoy",
      password:"123"
    }
  ];
  app.use(passport.initialize());
  app.use(passport.session());

app.use(bodyParser.json());

app.use(cookieSession({
    name: 'mysession',
    keys: ['vueauthrandomkey'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.status(400).send([user, "Cannot log in", info]);
      }
  
      req.login(user, err => {
        res.send("Logged in");
      });
    })(req, res, next);
  });
  
    app.get("/logout", function(req, res) {
      req.logout(); 
  
    console.log("logged out")
  
    return res.send();
  });
  
  
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
  
      (username, password, done) => {
        let user = users.find((user) => {
          return user.username === username && user.password === password
        })
  
        if (user) {
          done(null, user)
        } else {
          done(null, false, { message: 'Incorrect username or password'})
        }
      }
    )
  )
  
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    let user = users.find((user) => {
      return user.id === id
    })
  
    done(null, user)
  })
    
app.listen(3000);
