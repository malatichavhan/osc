const Product = require('../models/product');
const stripe = require('stripe')('sk_test_51QMJxtJWpbVOS3jdCowDezuWj7tIqzEoNofgX4YPqIG9Cf4ZCif4jF7CiBu3kTh3aTRXX7qu3VmEyoKx2dhYHCwT00MqkO0JsP');

exports.getProducts = (req, res, next) => {
  Product.findAll()
      .then(products=>{
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
          path: '/products',
            cartExists: req.session.cartExists,
            orderExists: req.session.orderExists,
            isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin
        });
      }).catch(err =>{
    console.log(err);
  });
  };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
      .then(product => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
            cartExists: req.session.cartExists,
            orderExists: req.session.orderExists,
            isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin
        });
      })
      .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
      .then(products=>{
        res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
            cartExists: req.session.cartExists,
            orderExists: req.session.orderExists,
        isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin
    });
  }).catch(err =>{
    console.log(err);
  });
  };

exports.getCart = (req, res, next) => {
  req.user
      .getCart()
      .then(cart => {
        return cart
            .getProducts()
            .then(products => {
              res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                  cartExists: req.session.cartExists,
                  orderExists: req.session.orderExists,
                  isAuthenticated: req.session.IsLoggedIn,
                  isAdmin: req.session.isAdmin
              });
            })
            .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;

        if (products.length > 0) {
          product = products[0];
          product = product.get({ plain: true });
        }

        if (product && product.cartItem) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProducts(product.id, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
      .then(cart =>{
        return cart.getProducts({where: { id: prodId }});
      })
      .then(products =>{
        const product = products[0];
        product.cartItem.destroy();
      })
      .then(result =>{
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.updateCartQuantity = (req, res, next) => {
    const prodId = req.body.productId;
    const quantity = req.body.quantity;
    req.user.getCart()
        .then(cart =>{
            return cart.getProducts({where: { id: prodId }});
        })
        .then(products =>{
            const product = products[0];
            product.cartItem.quantity = quantity;
            product.cartItem.save();
        })
        .then(result =>{
            return res.json(JSON.stringify(result));
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user.getCart()
        .then(cart => {
            cart.getProducts().then(products => {
                total = 0;
                products.forEach(p => {
                    total += p.cartItem.quantity * p.price;
                });
                total = Math.round(total*100,2)/100;
                 stripe.checkout.sessions.create({
                    line_items: products.map(p => {
                        return {
                            price_data: {
                                currency: 'nzd',
                                unit_amount: p.price*100,
                                product_data: {
                                    name: p.title,
                                    description: p.description,
                                    images: [p.imageUrl],
                                },
                            },
                            quantity: p.cartItem.quantity,
                        };
                    }),
                    mode: 'payment',
                    success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                    cancel_url: req.protocol + '://' + req.get('host') + '/cart/'
                }).then(session => {
                    res.render('shop/checkout', {
                        path: '/checkout',
                        pageTitle: 'Checkout',
                        products: products,
                        totalSum: total,
                        cartExists: req.session.cartExists,
                        sessionId: session.id,
                        orderExists: req.session.orderExists,
                        isAuthenticated: req.session.IsLoggedIn,
                        isAdmin: req.session.isAdmin
                    });
                })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });;
            })
        });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
      .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts()
      })
      .then(products =>{
          total = 0;
          products.forEach(p => {
              total += p.cartItem.quantity * p.price;
          });
          return req.user
            .createOrder({
                amount: total,
            })
            .then(order =>{
              return order.addOrderItems(products.map(p =>{
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
              }));
            })
            .catch(err => console.log(err));
      })
      .then(result =>{
      return fetchedCart.setProducts(null);
      })
      .then( result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']})
      .then(orders =>{
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
            cartExists: req.session.cartExists,
            orderExists: req.session.orderExists,
            isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin
        });
      })
      .catch(err => console.log(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart =>{
            fetchedCart = cart;
            return cart.getProducts()
        })
        .then(products =>{
            let total = 0;
            products.forEach(p => {
                total += p.cartItem.quantity * p.price;
            });
            return req.user
                .createOrder(
                    {amount:total}
                )
                .then(order =>{
                    products.forEach(p => {
                        order.addProducts(p.id, {
                            through: { quantity: p.cartItem.quantity }
                        });
                    });
                    return order;
                })
                .catch(err => console.log(err));
        })
        .then(result =>{
            return fetchedCart.setProducts(null);
        })
        .then( result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};
