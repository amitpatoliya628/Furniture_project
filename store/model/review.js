const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required'],
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Product ID is required'],
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: [true, 'Order ID is required'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
    },
    title: {
        type: String,
        required: [true, 'Review title is required'],
        trim: true,
    },
    review: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add unique index to prevent duplicate reviews for same product-user-order combination
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('reviews', reviewSchema);
