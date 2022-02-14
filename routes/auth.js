const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const saltRound = 10;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

router
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post((req, res) => {
    const username = req.body.username;
    const userPassword = req.body.password;

    if (!username || !userPassword) {
      res.render("signup", { errorMessage: "All fields are required" });
    }

    User.findOne({ username }).then((user) => {
      if (user && user.username) {
        res.render("signup", { errorMessage: "User is already taken!" });
        //throw new Error('Validation error')
      }

      const salt = bcrypt.genSaltSync(saltRound);
      const password = bcrypt.hashSync(userPassword, salt);

      User.create({ username, password })
        .then((user) => {
          console.log(`User created succesfully ${user.username}`);
          res.redirect("/");
          mongoose.connection.close();
        })
        .catch((err) =>
          console.log(`There was an error creating the user: ${err}`)
        );
    });
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.render("login", { errorMessage: "All fields are required" });
    }

    User.findOne({ username }).then((user) => {
      if (!user) res.render("login", { errorMessage: "Invalid credentials" });

      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        req.session.currentUserId = user._id;
        res.redirect("/auth/profile");
      }
    });
  });

router.route("/profile").get((req, res) => {
  const id = req.session.currentUserId;
  User.findById(id).then((user) => {
    res.render("profile", { user });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => res.redirect("/"));
});

module.exports = router;
