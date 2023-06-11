const { mongoose, Schema } = require('mongoose');

const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true },
        qty: { type: Number, required: true },

    }],
    user: {
       
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }

});
module.exports = mongoose.model('Order', orderSchema);