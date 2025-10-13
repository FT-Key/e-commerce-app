import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // un carrito por usuario
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // suponiendo que tendrás un modelo Product
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        subtotal: Number, // price * quantity
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
