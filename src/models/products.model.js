import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "Products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: [
    {
      type: String,
    },
  ],
});

productSchema.plugin(paginate);

export const productsModel = model(productCollection, productSchema);
