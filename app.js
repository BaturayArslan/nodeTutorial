const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
// const authRoute = require("./routes/auth");
const erorController = require("./controller/eror");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./model/User");

const app = express();

app.set("views", "views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("5ea9e6637a2087169da0bf1e")
    .then((user) => {
      req.user = user;
      console.log(req.user);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminData.routes);
app.use(shopRoute);
// app.use(authRoute);
app.use(erorController.eror404);

mongoConnect(() => {
  app.listen(5000);
});
