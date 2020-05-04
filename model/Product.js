const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imgUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //update
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static delete(productId) {
    const proId = new mongodb.ObjectId(productId);
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: proId })
      .then(() => {
        console.log("Product Destroyed.");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;

// ---------------------------------------------------------------------------------
// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imgUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });
// ---------------------------------------------------------------------
// module.exports = Product;

// const fs = require("fs");
// const path = require("path");

// const db = require("../util/database");

// module.exports = class Product {
//   constructor(title, price, imgUrl, description) {
//     this.id = Math.random();
//     this.title = title;
//     this.price = price;
//     this.imgUrl = imgUrl;
//     this.description = description;
//   }

//   static fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   save() {
//     console.log(this.title, this.price, this.imgUrl, this.description);
//     return db.execute(
//       "INSERT INTO products (title, price, imgUrl, description) VALUES (?,?,?,?)",
//       [this.title, this.price, this.imgUrl, this.description]
//     );
//   }

//---------------------------------------------------------------------------------------------------

// save() {
//   const p = path.join(
//     path.dirname(process.mainModule.filename),
//     "data",
//     "products.json"
//   );
//   fs.readFile(p, (err, fileContent) => {
//     let products = [];
//     if (!err) {
//       products = JSON.parse(fileContent);
//       console.log("read eror:", err);
//     }
//     products.push(this);
//     fs.writeFile(p, JSON.stringify(products), err => {
//       console.log("write eror:", err);
//     });
//   });
// }

// static getAllItems(cb) {
//   const p = path.join(
//     path.dirname(process.mainModule.filename),
//     "data",
//     "products.json"
//   );
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// }

// static fetchAll(cb) {
//   this.getAllItems(cb);
// }

// static findById(id, cb) {
//   this.getAllItems(products => {
//     const item = products.find(element => element.id === id);
//     cb(item);
//   });
// }
//};
