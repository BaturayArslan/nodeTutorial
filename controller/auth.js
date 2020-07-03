const User = require("../model/User");
const objFilter = require("../util/objectFilter");

const crypto = require("crypto");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendgridTranporter = require("nodemailer-sendgrid-transport");
const mongodb = require("mongodb");
const { validationResult } = require("express-validator");

/* add a filter method property to object */
objFilter();

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
  // let message = req.flash("eror");
  // if (message.length === 0) {
  //   message = null;
  // }

  res.render("auth/login", {
    path: "/login",
    title: "Login",
    errors: [],
    userInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      title: "Login",
      errors: errors.array(),
      userInput: {
        email: email,
        password: password,
      },
    });
  }

  User.findByEmail(email)
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(422).render("auth/login", {
          path: "/login",
          title: "Login",
          errors: [{ msg: "Invalid emails or password." }],
          userInput: {
            email: email,
            password: password,
          },
        });
      }

      bcrypt
        .compare(password, userDoc.password)
        .then((isMatched) => {
          if (!isMatched) {
            return res.status(422).render("auth/login", {
              path: "/login",
              title: "Login",
              errors: [{ msg: "Invalid emails or password." }],
              userInput: {
                email: email,
                password: password,
              },
            });
          }
          req.session.user = userDoc;
          req.session.isLogged = true;
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    title: "Sign Up",
    errors: [],
    userInput: {
      email: "",
      password: "",
      checkPassword: "",
    },
  });
};

exports.postSignup = (req, res, next) => {
  const formInfo = { ...req.body };

  /* valid Email validation */
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      title: "Sign Up",
      errors: errors.array(),
      userInput: {
        email: formInfo.email,
        password: formInfo.password,
        checkPassword: formInfo.checkPassword,
      },
    });
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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

        const newUserDoc = userDoc.filter((key, value) => {
          return key !== "_id";
        });

        const user = { ...userDoc, resetToken, resetTokenExpiration };
        return User.save(user);
      })
      .then(() => {
        res.redirect("/");
        // return transporter.sendMail({
        //   to: "baturay_arslan_fb@hotmail.com",
        //   from: "baturay.arslan.fb1@gmail.com",
        //   subject: "reset Password",
        //   html: `
        //    <p> to reset password </P>
        //    <p> click this: <a href="http://localhost:5000/reset/${resetToken}">RESET</a></p>
        //    `,
        // });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.find({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      const message = req.flash("eror");
      if (message.lenght === 0) {
        message = null;
      }

      res.render("auth/new-password", {
        title: "New Password",
        eror: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;
  let userDoc;
  User.find({
    _id: new mongodb.ObjectId(userId),
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      userDoc = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      userDoc.password = hashedPassword;
      userDoc.resetToken = undefined;
      userDoc.resetTokenExpiration = undefined;
      return User.save(userDoc);
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
