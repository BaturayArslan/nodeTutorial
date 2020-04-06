exports.eror204 = (req, res, next) => {
  res.sendStatus(204);
};

exports.eror404 = (req, res, next) => {
  res.status(404).render("404", { title: 404 });
};
