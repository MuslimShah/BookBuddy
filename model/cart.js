const fs = require("fs");
const path = require("path");

// path of cart
const p = path.join(__dirname, "..", "data", "cart.json");

module.exports = class Cart {
  //adding product
  static addProduct(id, productPrice) {
    //fetch previous car
    fs.readFile(p, (err, fileContent) => {
      let cart = { prouduct: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // analyze for existing products
      const existingIndex = cart.prouduct.findIndex((prod) => prod.id === id);

      let updatedProduct;
      if (existingIndex >= 0) {
        cart.prouduct[existingIndex].qty++;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.prouduct = [...cart.prouduct, updatedProduct];
      }
      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log("writing file error" + err);
        }
      });
    });

    //add new/increase quantity
  }
  static deleteCartById(id, price) {
    fs.readFile(p, (err, data) => {
      if (err) {
        console.log("error while deleting cart item" + err);
        return;
      }

      const cart = JSON.parse(data);
      const updatedCart = { ...cart };

      //product for extracting quantity
      const product = updatedCart.prouduct.find((d) => {
        return d.id === id;
      });
      updatedCart.prouduct = updatedCart.prouduct.filter((d) => {
        return d.id !== id;
      });

      updatedCart.totalPrice = updatedCart.totalPrice -( price * product.qty);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log("deleting cart item  error" + err);
        }
      });
    });
  }
  //==>getting products from the cart
  static getCartProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
