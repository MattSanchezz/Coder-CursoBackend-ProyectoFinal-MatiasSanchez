import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  idCart: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
    },
  ],
});

export const cartModel = mongoose.model('Carts', cartSchema);
