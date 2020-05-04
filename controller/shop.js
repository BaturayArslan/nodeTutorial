const Product = require("../model/Product");
// const Cart = require("../model/Cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/products", {
        prods: products,
        title: "Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/products", {
        prods: products,
        title: "Products",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log(req.session.user);
  req.session.user
    .getCart({ where: { userId: req.session.user.id } })
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      console.log("this is products: " + products);
      res.render("shop/cart", {
        title: "cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const id = Number(req.body.productId);
  let fetchCart;
  req.session.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: id } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let defaultQnt = 1;
      if (product) {
        oldQnt = product.cartItem.quantity;
        defaultQnt = oldQnt + 1;
        return fetchCart.addProduct(product, {
          through: { quantity: defaultQnt },
        });
      }
      return req.session.user
        .getProducts({ where: { id: id } })
        .then((product) => {
          return fetchCart.addProduct(product, {
            through: { quantity: defaultQnt },
          });
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.cartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  req.session.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
  const ID = req.params.productId;
  Product.findById(ID)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        path: "/product-details",
        title: "Product Details",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.session.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.session.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { title: "checkout", path: "/checkout" });
};
