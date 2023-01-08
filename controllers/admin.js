const Product = require("../model/product");
const sequelize = require("../util/database");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
  });
};

//==add product ==>post
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(title, imageUrl, price, description);

  try {
    const result = await Product.create({
      price: price,
      title: title,
      imageUrl: imageUrl,
      description: description,
      UserId: req.user.id
    });
    console.log("====== + book added +");
    res.redirect('/admin/add-product')

  } catch (err) {
    console.log(err);
  }
};
//==>get edit product
exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.id;

  if (editMode === "false") {
    return res.redirect("/");
  }
  try { 
     const data = await Product.findByPk(productId);
     res.render("admin/edit-product", {
       pageTitle: "Edit product",
       path: "/admin/edit-product",
       editing: editMode,
       data: data,
     });
  } catch (err) {
   console.log(err);
 }
};

//====> post edit product
exports.postEditProduct = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    const data = await Product.findByPk(id);
    data.title = title;
    data.imageUrl = imageUrl;
    data.description = description;
    data.price = price;
    data.save();
    console.log("====== + book edited +");

   } catch (err) {
    console.log(err);
  }

  res.redirect("/");
};
// ===>post delete product
exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.id;
  await Product.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/admin/admin-product");
};

exports.getAdminProduct = async (req, res, next) => {
  const data = await Product.findAll();
  // console.log("hfa");
  res.render("admin/admin-product", {
    shopData: data,
    pageTitle: "Admin product",
    path: "/admin/admin-product",
  });
};
