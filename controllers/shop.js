const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
exports.getProducts = async(req, res, next) => {
    const products = await Product.find();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.isLoggedIn
    });
};
//product details
exports.getProduct = async(req, res, next) => {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId)

    res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.isLoggedIn
    });
};

exports.getIndex = async(req, res, next) => {

    const products = await Product.find();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.isLoggedIn
    });

};

exports.getCart = async(req, res, next) => {
    const products = await req.user.populate('cart.items.productId');

    // console.log(products.cart.items);
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products.cart.items,
        isAuthenticated: req.isLoggedIn
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
    // console.log(prodId);
    await req.user.deleteCartItem(prodId);
    res.redirect('/cart');
};

//adding an order
exports.postOrder = async(req, res, next) => {
    const userproducts = await req.user.populate('cart.items.productId');
    const products = userproducts.cart.items.map(items => {
        return { qty: items.qty, product: {...items.productId._doc } };
    })
    const order = new Order({
        products: products,
        user: {
            name: req.user.name,
            userId: req.user._id
        }
    });
    await order.save()
    await req.user.clearCart();
    res.redirect('/orders');
};
//displaying orders
exports.getOrders = async(req, res, next) => {
    const order = await Order.find({ 'user.userId': req.user._id });
    // console.log(order)
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: order,
        isAuthenticated: req.isLoggedIn
    });
};