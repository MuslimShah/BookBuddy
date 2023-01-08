const Product = require("../model/product");
const Cart = require("../model/cart");

//==>/index
exports.getIndex = async (req, res, next) => {
  const data = await Product.findAll();
  res.render("shop/index", {
    shopData: data,
    pageTitle: "shop",
  });
};

//==>/products
exports.getProducts = async (req, res, next) => {
  const data = await Product.findAll();
  res.render("shop/product-list", {
    shopData: data,
    pageTitle: "All proucts",
  });
};
//==> cart
exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  const cartProducts = await cart.getProducts();
  res.render("shop/cart", { pageTitle: "Cart", data: cartProducts });
};

//==>/cart post
exports.postCart = async (req, res, next) => {
  const product_id = req.body.product_id; //getting product id

  try {
    const cart = await req.user.getCart(); //getting user cart
    const product = await cart.getProducts({ where: { id: product_id } }); //finding item in the cart

    let cartProduct;
    if (product.length > 0) {
      //if item is in the cart
      cartProduct = product;
    }
    let newQuantity = 1;
    if (cartProduct) {
      //item is in cart
      console.log(
        "already in cart================================================= "
      );
      let old_quantity = cartProduct[0].CartItem.quantity;
      newQuantity = old_quantity + 1;
    }
    //if not already in cart it will be added to the cart

    console.log(
      " ================== new item added to the cart ================="
    );

    const newProduct = await Product.findByPk(product_id);
    const added = await cart.addProduct(newProduct, {
      through: {
        quantity: newQuantity,
      },
    });

    res.redirect("/cart");
  } catch (err) {
    console.log("item adding to cart error:"+err);
  }
};

//=== delete cart item
exports.postDeleteCart = async (req, res, next) => {
  const id = req.body.id;
  try {
    const cart = await req.user.getCart(); //getting cart
    const product = await cart.getProducts({ where: { id: id } }); //finding item in cart
    const prod_data = product[0];
    prod_data.CartItem.destroy(); //deleting item from inBetween cartItems table
    res.redirect("/cart");
  } catch (err) {
    console.log("deleting cart item error" + err);
  }
};

//==>get orders
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", { pageTitle: "Orders" });
};

//==>checkout
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "Checkout" });
};

//==>get product details /product/id
exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  Product.getProductById(id)
    .then(([d]) => {
      console.log(d[0]);
      res.render("shop/product-details", { data: d[0] });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};
