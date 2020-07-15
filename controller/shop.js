const fs = require("fs");
const path = require("path");

const Product = require("../model/Product");
const User = require("../model/User");
// const Cart = require("../model/Cart");

const ITEM_COUNT_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  console.log(page);
  let ıtemCount;
  Product.count()
    .then((productCount) => {
      ıtemCount = productCount;
      return Product.fetchAll()
        .skip((page - 1) * ITEM_COUNT_PAGE)
        .limit(ITEM_COUNT_PAGE)
        .toArray();
    })
    .then((products) => {
      res.render("shop/products", {
        prods: products,
        title: "Products",
        path: "/products",
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: page * ITEM_COUNT_PAGE < ıtemCount,
        prevPage: page - 1,
        nextPage: page + 1,
        totalPage: Math.ceil(ıtemCount / ITEM_COUNT_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let ıtemCount;
  console.log(page);
  Product.count()
    .then((productCount) => {
      ıtemCount = productCount;
      return Product.fetchAll()
        .skip((page - 1) * ITEM_COUNT_PAGE)
        .limit(ITEM_COUNT_PAGE)
        .toArray();
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "Products",
        path: "/",
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: page * ITEM_COUNT_PAGE < ıtemCount,
        prevPage: page - 1,
        nextPage: page + 1,
        totalPage: Math.ceil(ıtemCount / ITEM_COUNT_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  const isLogged = req.session.isLogged;
  const prods = req.user.getCart();
  Promise.all(prods).then((result) => {
    res.render("shop/cart", {
      title: "cart",
      path: "/cart",
      prods: result,
      isAuthenticated: isLogged,
    });
  });

  // ---------------------------------------------
  // console.log(req.user.user);
  // req.user.user
  //   .getCart({ where: { userId: req.user.user.id } })
  //   .then((cart) => {
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     console.log("this is products: " + products);
  //     res.render("shop/cart", {
  //       title: "cart",
  //       path: "/cart",
  //       prods: products,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  const user = req.user;
  Product.findById(id)
    .then((product) => {
      user
        .addToCart(product)
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // --------------------------------------
  // let fetchCart;
  // req.user.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchCart = cart;
  //     return cart.getProducts({ where: { id: id } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     let defaultQnt = 1;
  //     if (product) {
  //       oldQnt = product.cartItem.quantity;
  //       defaultQnt = oldQnt + 1;
  //       return fetchCart.addProduct(product, {
  //         through: { quantity: defaultQnt },
  //       });
  //     }
  //     return req.user.user
  //       .getProducts({ where: { id: id } })
  //       .then((product) => {
  //         return fetchCart.addProduct(product, {
  //           through: { quantity: defaultQnt },
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.cartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .delCartItem(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  // ----------------------------------------
  // const productId = req.body.productId;
  // req.user.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
  //   .then((result) => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const isLogged = req.session.isLogged;
  const ID = req.params.productId;
  Product.findById(ID)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        path: "/product-details",
        title: "Product Details",
        isAuthenticated: isLogged,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { title: "checkout", path: "/checkout" });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrder()
    .then((order) => {
      res.render("shop/orders", {
        title: "Orders",
        path: "/orders",
        orders: order,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.serveInvoices = (req, res, next) => {
  const orderId = req.params.orderId;
  const fileName = "invoice-" + orderId + ".pdf";
  const filePath = path.join("data", "invoices", fileName);
  console.log(filePath);
  User.findOrder(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("no order found by given id"));
      }
      if (req.user._id.toString() !== order.user._id.toString()) {
        return next(new Error("user not auth to download this order invoice."));
      }

      const file = fs.createReadStream(filePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      file.pipe(res);

      // fs.readFile(filePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     "attachment; filename=" + fileName
      //   );
      //   res.send(data);
      // });
    })
    .catch((err) => next(err));
};
