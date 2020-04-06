const Product = require("../model/Product");
const User = require("../model/User");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Admin Panel",
    path: "/admin/add-product"
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imgUrl = req.body.imgUrl;
  const description = req.body.description;

  req.session.user
    .createProduct({
      title: title,
      price: price,
      imgUrl: imgUrl,
      description: description
    })
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
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
  proId = Number(req.params.productId);
  editMode = req.query.edit;
  req.session.user
    .getProducts({ where: { id: proId } })
    .then(products => {
      const product = products[0];
      res.render("admin/edit-product", {
        path: "/admin/edit-product",
        title: "Edit Product",
        product: product,
        edit: editMode
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const body = { ...req.body };
  const title = body.title;
  const price = body.price;
  const description = body.description;
  const imgUrl = body.imgUrl;
  Product.findByPk(Number(body.productId))
    .then(product => {
      product.title = title;
      product.price = price;
      product.imgUrl = imgUrl;
      product.description = description;
      return product.save();
    })
    .then(result => {
      res.redirect("/admin/product-list");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProductList = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("admin/product-list", {
        path: "/admin/product-list",
        title: "Admin Product List",
        prods: products
      });
    })
    .catch(err => {
      console.log(err);
    });
};
