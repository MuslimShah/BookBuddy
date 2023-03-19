const Product = require('../models/product');
const User = require('../models/user');


exports.getProducts = async(req, res, next) => {
    const products = await Product.find();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
    });
};
//product details
exports.getProduct = async(req, res, next) => {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId)

    res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
    });
};

exports.getIndex = async(req, res, next) => {

    const products = await Product.find();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
    });

};

exports.getCart = async(req, res, next) => {
    const products = await req.user.populate('cart.items.productId');

    console.log(products.cart.items);
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products.cart.items
    });

};

exports.postCart = async(req, res, next) => {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect('/cart')
};

exports.postCartDeleteProduct = async(req, res, next) => {

    const prodId = req.body.productId;
    await req.user.deleteCartItem(prodId);
    res.redirect('/cart');
};

//adding an order
exports.postOrder = async(req, res, next) => {
    await req.user.addOrder();
    res.redirect('/orders');
};

exports.getOrders = async(req, res, next) => {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
    });
};