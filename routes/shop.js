const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

//shop route
router.get("/", shopController.getIndex);
router.get("/cart", shopController.getCart);
//cart ==>post
router.post("/add-to-cart", shopController.postCart);

//==>POST DELETE CART
router.post("/delete-cart",shopController.postDeleteCart)
router.get("/orders", shopController.getOrders);

router.get("/products", shopController.getProducts);
router.get("/checkout", shopController.getCheckout);

//==>PRODUCT DETAILS
router.get("/product/:id", shopController.getProductDetails);

module.exports = router;
