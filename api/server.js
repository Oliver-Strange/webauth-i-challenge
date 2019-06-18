const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const userRouter = require("../users/users-router");

const server = express();

const sessionConfig = {
  name: "newName",
  secret: "keep it secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false, // GDPR laws against setting cookies automatically
  // configures way sessions are stored
  store: new KnexSessionStore({
    knex: require("../data/dbConfig"),
    tableName: "sessions", // table that stores sessions inside db
    sidfieldname: "sid", // column that holds session id
    createTable: true, // if table doesn't exist, it will be created
    clearInterval: 1000 * 60 * 60 // time between checking db for old sessions and clearing them
  })
};

// Global Middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

// Route Handlers
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`
        <h2>Welcome to the Auth practice server!</h2>
    `);
});

module.exports = server;
