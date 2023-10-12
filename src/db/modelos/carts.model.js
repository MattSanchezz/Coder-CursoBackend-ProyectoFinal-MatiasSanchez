import {Schema,model} from "mongoose";

const cartSchema = new Schema({
    idCart: {
        type: String,
        required: true
    },
    product: {
        idProduct: {
            type: Number,
            required: true
        },
        quantify: {
            type: Number,
        },
    },
})

export const cartModel = model('Carts', cartSchema)