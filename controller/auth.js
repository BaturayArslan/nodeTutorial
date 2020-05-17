const User = require("../model/User");

const crypto = require("crypto");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTranporter = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTranporter({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  // const isLogged = req
  //   .get("Cookie")
  //   .split("=")[1]
  //   .trim();

  /* check req.flash() array is empty if empty set message to null  */
  let message = req.flash("eror");
  if (message.length === 0) {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    title: "Login",
    loginEror: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findByEmail(email).then((userDoc) => {
    if (!userDoc) {
      req.flash("eror", "Invalid email or password.");
      return res.redirect("/login");
    }

    bcrypt
      .compare(password, userDoc.password)
      .then((isMatched) => {
        if (!isMatched) {
          req.flash("eror", "Invalid email or password.");
          return res.redirect("/login");
        }
        req.session.user = userDoc;
        req.session.isLogged = true;
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("eror");
  if (message.length == 0) {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    title: "Sign Up",
    emailExist: message,
  });
};

exports.postSignup = (req, res, next) => {
  const formInfo = { ...req.body };
  /* 
  -----Valite FromInfo
  */
  User.findByEmail(formInfo.email).then((result) => {
    if (result) {
      req.flash("eror", "this email exist.");
      return res.redirect("/signup");
    }
    bcrypt
      .hash(formInfo.password, 12)
      .then((hashedPass) => {
        const user = {
          email: formInfo.email,
          password: hashedPass,
          cart: { items: [] },
        };
        return User.save(user);
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: "baturay_arslan_fb@hotmail.com",
          from: "baturay.arslan.fb1@gmail.com",
          subject: "test",
          html: "<h1> hello world <h1>",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getReset = (req, res, next) => {
  const message = req.flash("eror");
  if (message.lenght === 0) {
    message = null;
  }

  res.render("auth/reset", {
    title: "/reset",
    eror: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const resetToken = buffer.toString("hex");
    User.findByEmail(email)
      .then((userDoc) => {
        if (!userDoc) {
          req.flash("eror", "email does not found!");
          return res.redirect("/");
        }
        const resetTokenExpiration = Date.now() + 3600000;
        const user = { ...userDoc, resetToken, resetTokenExpiration };
        return User.save(user);
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: "baturay_arslan_fb@hotmail.com",
          from: "baturay.arslan.fb1@gmail.com",
          subject: "reset Password",
          html: `
           <p> to reset password </P>
           <p> click this: <a href="http://localhost:5000/reset/${resetToken}">RESET</a></p>
           `,
        });
      });
  });
};
