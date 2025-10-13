import mongoose from "mongoose";
import dotenv from "dotenv";
import argon2 from "argon2";

import { User, Product, Cart, Favorite } from "../src/models/index.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    // Limpieza previa
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Favorite.deleteMany({});

    console.log("🗑️ Colecciones limpiadas");

    // ---------------------------
    // Crear usuarios
    // ---------------------------
    const adminPassword = await argon2.hash("admin123");
    const admin = await User.create({
      name: "UsuarioAdmin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    const userPasswords = await Promise.all([
      argon2.hash("user123"),
      argon2.hash("user123"),
      argon2.hash("user123"),
    ]);

    const users = await User.insertMany([
      { name: "Juan", email: "juan@example.com", password: userPasswords[0] },
      { name: "Maria", email: "maria@example.com", password: userPasswords[1] },
      { name: "Pedro", email: "pedro@example.com", password: userPasswords[2] },
    ]);

    console.log("✅ Usuarios creados");

    // ---------------------------
    // Crear productos con images como array
    // ---------------------------
    const productData = [
      { name: "Producto 1", description: "Descripcion 1", price: 100, stock: 10 },
      { name: "Producto 2", description: "Descripcion 2", price: 200, stock: 5 },
      { name: "Producto 3", description: "Descripcion 3", price: 50, stock: 20 },
      { name: "Producto 4", description: "Descripcion 4", price: 150, stock: 8 },
    ];

    const products = await Product.insertMany(
      productData.map((p, index) => ({
        ...p,
        images: [
          `https://picsum.photos/seed/product${index + 1}/600/600`,
          // podés agregar más imágenes si querés
        ],
      }))
    );

    console.log("✅ Productos creados con imágenes en array");

    // ---------------------------
    // Crear carritos vacíos y favoritos
    // ---------------------------
    for (const user of [admin, ...users]) {
      await Cart.create({ user: user._id, products: [], total: 0 });
      await Favorite.create({ user: user._id, products: [] });
    }

    console.log("🛒 Carritos y favoritos inicializados");

    console.log("🎉 Seed completado");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al sembrar la base de datos:", err);
    process.exit(1);
  }
};

seed();
