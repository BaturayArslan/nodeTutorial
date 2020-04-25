const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

// const adminData = require("./routes/admin");
// const shopRoute = require("./routes/shop");
// const authRoute = require("./routes/auth");
const erorController = require("./controller/eror");
const mongoConnect = require("./util/database");

const app = express();

app.set("views", "views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use("/admin", adminData.routes);
// app.use(shopRoute);
// app.use(authRoute);
// app.use(erorController.eror404);

mongoConnect((client) => {
  console.log(client);
  app.listen(5000);
});
