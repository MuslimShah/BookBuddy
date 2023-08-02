const path = require('path');

const express = require('express');
const {body}=require('express-validator');

const adminController = require('../controllers/admin');
const auth=require('../middlewares/auth');

const router = express.Router();


//========================== validating product =====================

const validateProduct=[
    body('title','enter a valid title').trim().isLength({min:3}),
    body('imageUrl','enter a valid image url').isURL(),
    body('price','enter a valid price').isFloat(),
    body('description','description too short').isLength({min:3}).trim()
]

// /admin/add-product => GET
router.get('/add-product',auth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',auth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',validateProduct,auth, adminController.postAddProduct);

router.get('/edit-product/:productId',auth, adminController.getEditProduct);

router.post('/edit-product',auth, adminController.postEditProduct);

router.post('/delete-product', auth,adminController.postDeleteProduct);

module.exports = router;