const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const erorController = require("./controller/eror");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./model/User");

const app = express();
// ---- mongodb setup for session
const MONGOURI =
  "mongodb+srv://baturay:EbBGtraWJcXa0Pv4@cluster0-ugnkq.mongodb.net/test?retryWrites=true&w=majority";
const store = new MongoDbStore({ uri: MONGOURI, collection: "sessions" });

// ----- csurf setup
const csrfProtection = csurf();

app.set("views", "views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "this is key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = new User(user.email, user.password, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminData.routes);
app.use(shopRoute);
app.use(authRoute);
app.use(erorController.eror404);

mongoConnect(() => {
  app.listen(5000);
});
