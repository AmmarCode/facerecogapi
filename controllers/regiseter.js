

const handleRegister = (req, res, pg, bcrypt) => {
  const { name, email, password } = req.body;
	if(!name || !email || !password) {
		return res.status(400).json("Required form data not filled")
	}

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
};

module.exports = {
    handleRegister: handleRegister
};