const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: "985518c37a4441c2acb55171d6929eea",
  });

const handleApiCall = (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json("Unable to work with api"))
}

const handleImage = (req, res, pg) => {
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
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};
