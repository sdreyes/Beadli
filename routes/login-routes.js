// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("./passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res, err) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    console.log(`req user from the api/login route: ${req.user}`);
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      // res.redirect(307, "/api/login");
      console.log(`user created from api/signup route ${req.user}`);
      res.json(req.user);
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.json({
      isLoggedIn: false
    });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({
        isLoggedIn: false
      });
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        isLoggedIn: true,
        email: req.user.email,
        username: req.user.username,
        id: req.user._id
      });
    }
  });

  // This has been refactored in the controllers/api routes 
  // app.get("/api/user/dashboard/:id", function(req, res) {
  //   db.User.findOne({ "_id": req.params.id })
  //       .populate("favorites", "designs")
  //       .then(function(dbUser) {
  //           res.json(dbUser);
  //       })
  //       .catch(function(err) {
  //           res.json(err);
  //       });
  // })

};