const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const userRouter = require("../users/users-router");

const server = express();

// Global Middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

// Route Handlers
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`
        <h2>Welcome to the Auth practice server!</h2>
    `);
});

module.exports = server;
