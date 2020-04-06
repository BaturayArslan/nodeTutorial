const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const erorController = require("./controller/eror");
const sequelize = require("./util/database");
const Product = require("./model/Product");
const User = require("./model/User");
const Cart = require("./model/Cart");
const CartItem = require("./model/cart-item");
const Order = require("./model/Order");
const OrderItem = require("./model/order-item");

const app = express();

const store = new SequelizeStore({ db: sequelize });

app.set("views", "views");
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use("/admin", adminData.routes);
app.use(shopRoute);
app.use(authRoute);

app.use(erorController.eror404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      console.log("helloooooo");
      return User.create({ name: "baturay", email: "test@test.gmail.com" });
    }
    return user;
  })
  .then(user => {
    return new Promise((resolve, reject) => {
      user
        .getCart({ where: { userId: user.id } })
        .then(result => {
          resolve({ cart: result, user: user });
        })
        .catch(err => {
          console.log(err);
        });
    });
  })
  .then(({ cart, user }) => {
    if (!cart) {
      return user.createCart();
    }
    return cart[0];
  })
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
