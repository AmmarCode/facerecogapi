const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { use } = require("express/lib/application");

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
  pg.select("*").from('users')
		.then(data => {
			res.json(data);
		})
	
});

// Sing In
app.post("/signin", (req, res) => {
	pg.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
			if (isValid) {
				pg.select('*').from('users').where('email', '=', req.body.email)
					.then(user => {
						res.json(user)
					})
					.catch(err => res.status(400).json('error logging in'))
			} else {
				res.status(400).json('wrong credential')
			}
		})
		.catch(err => res.status(400).json('wrong credential'))
});

// Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  pg.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginUser) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginUser[0].email,
            joinedat: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .catch((err) => res.status(400).json("Unable to register"));
});

// User profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  pg.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      user.length > 0
        ? res.json(user[0])
        : res.status(400).json("User not found");
    })
    .catch((err) => res.status(400).json("User doesn't exist"));
});

// Image request
app.put("/image", (req, res) => {
  const { id } = req.body;
  pg("users")
    .where("id", "=", id)
    .increment("requests", 1)
    .returning("requests")
    .then((user) => {
			console.log(user[0])
      user.length > 0
        ? res.json(user[0])
        : res.status(400).json("Fix your head fool!");
    })
    .catch((err) => res.status(400).json("Fix you head fool!"));
});

// Hash password

// Load hash from your password DB.
// bcrypt.compare("fruities", hash, function(err, res) {
// res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
// res = false
// });

// App listining to port 5000
app.listen(5000, () => {
  console.log("App is running on port 5000");
});

/*
/ --> res = endpoint is working

/signin --> POST = sucess/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> user

 */
