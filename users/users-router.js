const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/dbConfig");
const Users = require("./users-model");

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

// Custom Middleware
function restricted(req, res, next) {
  const { username, password } = req.headers;
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You are not Authorized" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "server error" });
      });
  } else {
    res.status(400).json({ message: "no credentials provided" });
  }
}

module.exports = router;
