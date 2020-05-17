const Product = require("../model/Product");
// const Cart = require("../model/Cart");

exports.getProducts = (req, res, next) => {
  const isLogged = req.session.isLogged;
  Product.fetchAll()
    .then((products) => {
      res.render("shop/products", {
        prods: products,
        title: "Products",
        path: "/products",
        isAuthenticated: isLogged,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  const isLogged = req.session.isLogged;
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "Products",
        path: "/",
        isAuthenticated: isLogged,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      console.log(err);
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
  Product.findById(id).then((product) => {
    user
      .addToCart(product)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
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
  req.user.delCartItem(productId).then((result) => {
    res.redirect("/cart");
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
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder().then(() => {
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { title: "checkout", path: "/checkout" });
};
