const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const erorController = require("./controller/eror");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./model/User");

const app = express();

const MONGOURI =
  "mongodb+srv://baturay:EbBGtraWJcXa0Pv4@cluster0-ugnkq.mongodb.net/test?retryWrites=true&w=majority";
const store = new MongoDbStore({ uri: MONGOURI, collection: "sessions" });

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
app.use((req, res, next) => {
  User.findById("5eb08c6f94c440a2b5007803")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });

  req.session.user;
});

app.use("/admin", adminData.routes);
app.use(shopRoute);
app.use(authRoute);
app.use(erorController.eror404);

mongoConnect(() => {
  app.listen(5000);
});
