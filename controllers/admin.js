const Product = require('../models/product');
const Category = require('../models/category');

exports.getAddProduct = (req, res, next) => {
    if(!req.session.IsLoggedIn){
        return res.redirect('/login');
    }
    Category.findAll().then(categoryList=>{
        res.render( 'admin/edit-product',{
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin,
            categoryList:categoryList
        });
    }).catch(err=>{
        console.log(err);
    })

};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const color = req.body.color;
  const quantity = req.body.quantity;
  const categoryId = req.body.category;
  //req.user.createProduct();
    Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id,
    quantity: quantity,
        categoryId: categoryId,

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
        Category.findAll().then(categoryList=>{
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.IsLoggedIn,
                isAdmin: req.session.isAdmin,
                categoryList:categoryList
            });
        })
      .catch(err => console.log(err));

      })

  };

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedQuantity = req.body.quantity;
  const updateCategory = req.body.category;
  const updatedProduct = new Product(
   Product.findByPk(prodId)
       .then(product =>{
         product.title = updatedTitle;
         product.price = updatedPrice;
         product.imageUrl = updatedImageUrl;
         product.description = updatedDesc;
         product.quantity = updatedQuantity;
         product.categoryId = updateCategory;
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
            isAuthenticated: req.session.IsLoggedIn,
            isAdmin: req.session.isAdmin

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

exports.getAddCategories = (req, res, next) => {
    if(!req.session.IsLoggedIn){
        return res.redirect('admin/add-product');
    }
    res.render('admin/add-categories', {
        pageTitle: 'Add Categories',
        path: '/admin/add-categories',
        editing: false,
        isAuthenticated: req.session.IsLoggedIn,
        isAdmin: req.session.isAdmin
    });
};

exports.postAddCategories = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    Category.create({
        title: title,
        description: description,
    })
        .then(result =>{
            //console.log(result);
            console.log('created-category');
            res.redirect('/admin/add-category');
        })
        .catch(err =>{
            console.log(err);
        });
    res.redirect('/admin/add-category');
};

exports.getListCategory = (req, res, next) => {
    Category.findAll()
            .then(categories => {
                res.render('admin/category', {
                    categories: categories,
                    pageTitle: 'CategoryList',
                    path: '/admin/list-category',
                    isAuthenticated: req.session.IsLoggedIn,
                    isAdmin: req.session.isAdmin

                });
            })
            .catch(err => console.log(err));

};

exports.getEditCategory = (req, res, next) => {
    const editMode = req.query.m;
    if (!editMode) {
        return res.redirect('/');
    }
    const categoryId = req.params.categoryId;
    Category.findByPk(categoryId)
        //Product.findByPk(prodId)
        .then(category =>{

            if(!category){
                return res.redirect('/');
            }
            res.render('admin/add-categories', {
                pageTitle: 'Edit Category',
                path: '/admin/edit-category',
                editing: editMode,
                category: category,
                isAuthenticated: req.session.IsLoggedIn,
                isAdmin: req.session.isAdmin
            });
        })
        .catch(err => console.log(err));
};

exports.postEditCategory = (req, res, next) => {

    const updatedTitle = req.body.title;
    const updatedDesc = req.body.description;
    const categoryId = req.body.categoryId;

    const updatedCategory = new Category(
        Category.findByPk(categoryId)
            .then(category =>{
                category.title = updatedTitle;
                category.description = updatedDesc;

                category.save();
                res.redirect('/admin/list-category');
            })
            .catch(err => console.log(err))
    )};

exports.postDeleteCategory = (req, res, next) => {
    const categoryId = req.body.categoryId;
    Category.findByPk(categoryId)
        .then(category =>{
            return category.destroy()
        })
        .then(result =>{
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/list-category');
        })
        .catch(err => console.log(err));
};




