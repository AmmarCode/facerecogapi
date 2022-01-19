const handleSignin = (req, res, pg, bcrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json("Required form data not filled")
	}

  pg.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash)
			if (isValid) {
				pg.select('*').from('users').where('email', '=', email)
					.then(user => {
						res.json(user)
					})
					.catch(err => res.status(400).json('error logging in'))
			} else {
				res.status(400).json('wrong credential')
			}
		})
		.catch(err => res.status(400).json('wrong credential'))
};

module.exports = {
	handleSignin: handleSignin
};