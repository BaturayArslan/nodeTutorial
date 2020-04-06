const User = require("../model/User");

exports.getLogin = (req, res, next) => {
  // const isLogged = req
  //   .get("Cookie")
  //   .split("=")[1]
  //   .trim();
  console.log(req.session.isLogged);
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    isAuthenticated: req.session.isLogged
  });
};

exports.postLogin = (req, res, next) => {
  User.findByPk(1)
    .then(user => {
      console.log(user);
      req.session.user = user;
      req.session.isLogged = true;
      res.redirect("/?" + req.body.email);
    })
    .catch(err => console.log(err));
};
