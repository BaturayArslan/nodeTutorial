const User = require("../model/User");

exports.getLogin = (req, res, next) => {
  // const isLogged = req
  //   .get("Cookie")
  //   .split("=")[1]
  //   .trim();
  const isLogged = req.session.isLogged;
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    isAuthenticated: isLogged,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5eb08c6f94c440a2b5007803").then((user) => {
    req.session.user = user;
    req.session.isLogged = true;
    res.redirect("/");
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
