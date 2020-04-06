const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imgUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;

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
