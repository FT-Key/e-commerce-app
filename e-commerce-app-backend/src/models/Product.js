import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String, // URL de la imagen
      },
    ],
    isActive: {
      type: Boolean,
      default: true, // producto disponible o no
    },
    // Metadata opcional
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
  }
);

// Index para búsquedas por nombre o categoría
productSchema.index({ name: "text", category: "text" });

export default mongoose.model("Product", productSchema);
