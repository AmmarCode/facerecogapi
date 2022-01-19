const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const regiseter = require("./controllers/regiseter");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// Database
const pg = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "ammar",
    password: "0",
    database: "facerecog",
  },
});

// instanciate express
const app = express();

app.use(express.json());
app.use(cors());

// Home
app.get("/", (req, res) => {
  pg.select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    });
});

// Sing In
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, pg, bcrypt);
});

// Register
app.post("/register", (req, res) => {
  regiseter.handleRegister(req, res, pg, bcrypt);
});

// User profile
app.get("/profile/:id", (req, res) => {
  profile.HandleProfileGet(req, res, pg);
});

// Image request
app.put("/image", (req, res) => {
  image.handleImage(req, res, pg);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

// App listining to port 5000
app.listen(5000, () => {
  console.log("App is running on port 5000");
});
