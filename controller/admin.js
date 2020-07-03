const { validationResult } = require("express-validator");

const Product = require("../model/Product");
// const User = require("../model/User");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Admin Panel",
    path: "/admin/add-product",
    editMode: "false",
    errorMode: "false",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imgUrl = req.body.imgUrl;
  const description = req.body.description;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      title: "Admin Panel",
      path: "/admin/add-product",
      errors: errors.array(),
      editMode: "false",
      errorMode: "true",
      product: {
        title: title,
        price: price,
        imgUrl: imgUrl,
        description: description,
      },
    });
  }
  const product = new Product(title, price, description, imgUrl, null);
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // const body = { ...req.body };
  // console.log(body);
  // const product = new Product(
  //   body.title,
  //   body.price,
  //   body.imgUrl,
  //   body.description
  // );
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const isLogged = req.session.isLogged;
  let proId = req.params.productId;
  let editMode = req.query.edit;
  Product.findById(proId)
    .then((product) => {
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        title: "Edit Product",
        product: product,
        editMode: editMode,
        isAuthenticated: isLogged,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const id = req.body.productId;
  const product = new Product(title, price, description, imgUrl, id);
  product
    .save()
    .then(() => {
      res.redirect("/admin/product-list");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductList = (req, res, next) => {
  const isLogged = req.session.isLogged;
  Product.fetchAll()
    .then((products) => {
      res.render("admin/product-list", {
        path: "/admin/product-list",
        title: "Admin Product List",
        prods: products,
        isAuthenticated: isLogged,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  let proId = req.params.productId;
  Product.delete(proId)
    .then(() => {
      res.redirect("/admin/product-list");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
