const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://baturay:EbBGtraWJcXa0Pv4@cluster0-ugnkq.mongodb.net/test?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
