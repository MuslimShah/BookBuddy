const express = require("express");
const path = require("path");
const router = express.Router();
// const rootDir = require('../util/path')
const routesController = require("../controllers/admin");

router.get("/add-product", routesController.getAddProduct);
router.get("/admin-product", routesController.getAdminProduct);
router.post("/add-product", routesController.postAddProduct);
router.get("/edit-product/:id", routesController.getEditProduct);
router.post("/edit-product", routesController.postEditProduct);
//==> delete product
router.post("/delete-product", routesController.postDeleteProduct);

module.exports = router;
