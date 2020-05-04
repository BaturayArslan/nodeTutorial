const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
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
