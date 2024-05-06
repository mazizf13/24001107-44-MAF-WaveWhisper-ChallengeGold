const Beach = require("../models/beach");

module.exports.isAuthorBeach = async (req, res, next) => {
  const { id } = req.params;
  let beach = await Beach.findById(id);

  if (!beach.author.equals(req.user._id)) {
    req.flash("error_msg", "Not authorized");
    return res.redirect("/beaches");
  }

  next();
};
