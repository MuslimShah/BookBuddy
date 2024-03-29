const { validationResult } = require("express-validator");

const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationError:[]

    // isAuthenticated: req.isLoggedIn
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const prod = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user._id,
  });

  //checking validation....
  const resultValidation = validationResult(req);
  //if there is an error
  if (!resultValidation.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: resultValidation.array()[0].msg,
    validationError:resultValidation.array()
    });
  }

  prod.save();
  res.redirect("/admin/products");
};
exports.getEditProduct = async (req, res, next) => {

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product,
    hasError: false,
    errorMessage: null,
    validationError:[]
    // isAuthenticated: req.isLoggedIn
  });
};
exports.postEditProduct = async (req, res, next) => {
  //receiving updated data from the form
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
    //validating edit product form ....
  const resultValidation=validationResult(req);
  if (!resultValidation.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
      },
      errorMessage: resultValidation.array()[0].msg,
      validationError:resultValidation.array()
    });
  }
  if (!updatedTitle || !updatedPrice || !updatedImageUrl || !updatedDesc) {
    return res.json({ msg: "please fill complete information" });
                                                                                                            }

  const product = await Product.findById(prodId);
  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect("/");
  }
  product.title = updatedTitle;
  product.price = updatedPrice;
  product.description = updatedDesc;
  product.imageUrl = updatedImageUrl;
  await product.save();
  res.redirect("/admin/products");
};
exports.getProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id });
  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",

    // isAuthenticated: req.isLoggedIn
  });
};
exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.deleteOne({ _id: prodId, userId: req.user._id });
  res.redirect("/admin/products");
};
