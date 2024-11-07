const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
      isAuthenticated: req.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const color = req.body.color;
  const quantity = req.body.quantity;
  //req.user.createProduct();
    Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id,
    quantity: quantity

  })
      .then(result =>{
    //console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
  })
      .catch(err =>{
    console.log(err);
  });
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.m;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id: prodId}})
  //Product.findByPk(prodId)
      .then(products =>{
          const product = products[0];
        if(!product){
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
            isAuthenticated: req.isLoggedIn,
        });
      })
      .catch(err => console.log(err));
  };

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedQuantity = req.body.quantity;
  const updatedProduct = new Product(
   Product.findByPk(prodId)
       .then(product =>{
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.imageUrl = updatedImageUrl;
         product.description = updatedDesc;
         product.quantity = updatedQuantity;
         product.save();
         res.redirect('/admin/products');
       })
       .catch(err => console.log(err))
)};

exports.getProducts = (req, res, next) => {
  req.user
        .getProducts()
      .then(products =>{
        res.render('admin/product', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.isLoggedIn,
            i
      });
  })
      .catch(err => console.log(err));
  };

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
      .then(product =>{
        return product.destroy()
      })
      .then(result =>{
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
};
