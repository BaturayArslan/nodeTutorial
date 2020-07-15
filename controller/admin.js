const { validationResult } = require("express-validator");

const Product = require("../model/Product");
// const User = require("../model/User");

exports.getAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  res.render("admin/edit-product", {
    title: "Admin Panel",
    path: "/admin/add-product",
    editMode: "false",
    errorMode: "false",
    errors: errors.array(),
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imgUrl = req.file;
  const description = req.body.description;
  console.log(imgUrl);

  // ---- if imgUrl is not set then send a eror
  if (!imgUrl) {
    return res.status(422).render("admin/edit-product", {
      title: "Admin Panel",
      path: "/admin/add-product",
      errors: [{ msg: "image cant be read" }],
      editMode: "false",
      errorMode: "true",
      product: {
        title: title,
        price: price,
        imgUrl: null,
        description: description,
      },
    });
  }
  // --- if there is a validation eror then send a eror
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

  // ---- if there is a no eror then save the product
  const product = new Product(title, price, description, imgUrl.path, null);
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
  const errors = validationResult(req);
  Product.findById(proId)
    .then((product) => {
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        title: "Edit Product",
        product: product,
        editMode: editMode,
        isAuthenticated: isLogged,
        errors: errors.array(),
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
  const imgUrl = req.file;
  const id = req.body.productId;

  let product;
  if (!imgUrl) {
    product = new Product(title, price, description, null, id);
  } else {
    product = new Product(title, price, description, imgUrl.path, id);
  }
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
    .toArray()
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
      res.status(200).json({ message: "Deleting process success." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting process failed." });
    });
};
