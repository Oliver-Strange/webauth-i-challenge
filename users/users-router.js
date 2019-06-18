const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/dbConfig");
const Users = require("./users-model");
const restricted = require("../auth/restricted-middleware");

const router = express.Router();

router.post("/register", (req, res) => {
  let user = req.body;
  // generate hash from users' password
  const hash = bcrypt.hashSync(user.password, 10);
  // override the user.password with the hash
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: "server error logging out" });
      } else {
        res.status(200).json({ message: "see you next time" });
      }
    });
  } else {
    res
      .status(200)
      .json({ message: "how did you get here? You don't have an account..." });
  }
});

module.exports = router;
