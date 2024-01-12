import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  owner: {
    type: String,
    default: 'admin',
  },
});

productsSchema.plugin(mongoosePaginate);

const productsModel = model('Products', productsSchema);

export default productsModel;
