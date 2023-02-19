const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const prod = new Product(title, price, imageUrl, description, req.user._id);
    prod.save();
    res.redirect('/admin/products');

};

exports.getEditProduct = async(req, res, next) => {
    const editMode = req.query.edit;
    console.log('=== in edit page');
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });

    } catch (err) {
        console.log(`error finding product `);
        return res.redirect('/');
    }

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const userId = req.user._id;

    if (!updatedTitle || !updatedPrice || !updatedImageUrl || !updatedDesc) {
        return res.json({ msg: 'please fill complete information' })
    }
    try {
        const newProduct = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, userId);
        newProduct.updateProduct(prodId);
        res.redirect('/admin/products')
    } catch (err) {
        res.json({ msg: 'cannot edit product error' })
    }


};

exports.getProducts = async(req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    } catch (err) {
        res.json({ msg: 'cannot get product error' })
    }

};

exports.postDeleteProduct = async(req, res, next) => {
    const prodId = req.body.productId;
    await Product.delteProduct(prodId);
    console.log(`=========== product deleted ============`);
    res.redirect('/admin/products')
};