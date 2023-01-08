const Product = require("../model/product");
const Cart = require("../model/cart");

//==>/index
exports.getIndex = async(req, res, next) => {
  const data = await Product.findAll();
  
   res.render("shop/index", {
     shopData: data,
     pageTitle: "shop",
   });
  
  
 
};

//==>/products
exports.getProducts =async (req, res, next) => {
  const data = await Product.findAll();
  res.render("shop/product-list", {
      shopData: data,
      pageTitle: "All proucts",
    });
};
//==> cart
exports.getCart = async(req, res, next) => {

  const cart = await req.user.getCart();
  const cartProducts = await cart.getProducts();
  console.log(cartProducts);
  res.render("shop/cart", { pageTitle: "Cart", data: cartProducts })
};

//==>/cart post
exports.postCart = (req, res, next) => {
  const product_id = req.body.product_id;
  const productPrice = req.body.productPrice;
  Cart.addProduct(product_id, productPrice);
  // });
  res.redirect("/cart");
};

//=== delete cart item
exports.postDeleteCart = (req, res, next) => {
  const id = req.body.id;
  Cart.deleteCartById(id);
  res.redirect('/cart')

}

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
  Product.getProductById(id).then(([d]) => {   
    console.log(d[0]);
    res.render("shop/product-details", { data: d[0] });
  }).catch(err => {
    if (err){
      console.log(err);
    }
  })
 
};
