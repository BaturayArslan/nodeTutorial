const Product = require("./Product");
const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // cart {items: []}
    this._id = new mongodb.ObjectId(id);
  }
  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then(() => {
        console.log("Users inserted");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    const index = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    if (index >= 0) {
      newQuantity = this.cart.items[index].quantity + 1;
      updatedCartItems[index].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const db = getDb();
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId("5eb08c6f94c440a2b5007803") },
        { $set: { cart: updatedCart } }
      );
  }

  delCartItem(proId) {
    const updatedItems = this.cart.items.filter((e) => {
      return e.productId.toString() !== proId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId("5eb08c6f94c440a2b5007803") },
        { $set: { cart: { items: updatedItems } } }
      )
      .then()
      .catch((err) => {
        console.log(err);
      });
  }

  getCart() {
    const products = this.cart.items.map((product) => {
      return Product.findById(product.productId).then((result) => {
        return { ...result, quantity: product.quantity };
      });
    });
    return products;
  }

  addOrder() {
    const db = getDb();
    const prods = this.getCart();
    return Promise.all(prods)
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
            email: this.email,
          },
        };
        return order;
      })
      .then((order) => {
        return db
          .collection("orders")
          .insertOne(order)
          .then((result) => {
            this.cart = { items: [] };
            return db
              .collection("users")
              .updateOne(
                { _id: new mongodb.ObjectId("5eb08c6f94c440a2b5007803") },
                { $set: { cart: this.cart } }
              );
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }

  static findById(id) {
    const usersId = mongodb.ObjectId(id);
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: usersId })
      .next()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
