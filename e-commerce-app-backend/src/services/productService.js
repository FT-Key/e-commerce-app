import { Product } from "../models/index.js";

/**
 * Crea un producto nuevo
 */
export const createProduct = async (data) => {
  try {
    const product = new Product(data);
    return await product.save();
  } catch (error) {
    throw new Error("Error creando producto: " + error.message);
  }
};

/**
 * Obtiene todos los productos con filtros, búsqueda y paginación
 */
export const getAllProducts = async (filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    // Filtrado por nombre o categoría si se pasan
    const queryObj = {};
    if (filters.name) {
      queryObj.name = { $regex: filters.name, $options: "i" }; // búsqueda parcial insensible a mayúsculas
    }
    if (filters.category) {
      queryObj.category = filters.category;
    }

    const products = await Product.find(queryObj)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(queryObj);

    return { products, total, page, limit };
  } catch (error) {
    throw new Error("Error obteniendo productos: " + error.message);
  }
};

/**
 * Obtiene un producto por su ID
 */
export const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  } catch (error) {
    throw new Error("Error obteniendo producto: " + error.message);
  }
};

/**
 * Actualiza un producto por su ID
 */
export const updateProduct = async (id, data) => {
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new Error("Producto no encontrado para actualizar");
    return product;
  } catch (error) {
    throw new Error("Error actualizando producto: " + error.message);
  }
};

/**
 * Elimina un producto por su ID
 */
export const deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Producto no encontrado para eliminar");
    return product;
  } catch (error) {
    throw new Error("Error eliminando producto: " + error.message);
  }
};
