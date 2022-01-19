const HandleProfileGet = (req, res, pg) => {
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
};

module.exports = {
    HandleProfileGet: HandleProfileGet
};