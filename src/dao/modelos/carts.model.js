import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    idCart: {
        type: String,
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

export const cartModel = model('Carts', cartSchema);