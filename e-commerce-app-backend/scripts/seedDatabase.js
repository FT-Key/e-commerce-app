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
    // Crear productos con imágenes reales de Unsplash
    // ---------------------------
    const productData = [
      // Electrónicos
      {
        name: "Laptop HP Pavilion",
        description: "Laptop de alto rendimiento con procesador Intel i7, 16GB RAM y SSD de 512GB",
        price: 899.99,
        category: "electronica",
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
          "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
        ],
      },
      {
        name: "iPhone 15 Pro",
        description: "Smartphone Apple con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR",
        price: 1199.99,
        category: "electronica",
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1592286927505-deaa4e126b9e?w=600",
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600",
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
        ],
      },
      {
        name: "Samsung Smart TV 55\"",
        description: "Televisor 4K UHD con tecnología QLED y HDR10+",
        price: 699.99,
        category: "electronica",
        stock: 10,
        images: [
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
          "https://images.unsplash.com/photo-1593359863503-f598fe7e9185?w=600",
        ],
      },
      {
        name: "AirPods Pro 2",
        description: "Auriculares inalámbricos con cancelación activa de ruido",
        price: 249.99,
        category: "electronica",
        stock: 40,
        images: [
          "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600",
          "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600",
        ],
      },
      {
        name: "PlayStation 5",
        description: "Consola de videojuegos de última generación con SSD ultra rápido",
        price: 499.99,
        category: "electronica",
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600",
          "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600",
          "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600",
        ],
      },
      {
        name: "Cámara Canon EOS R5",
        description: "Cámara mirrorless profesional de 45MP con video 8K",
        price: 3899.99,
        category: "electronica",
        stock: 5,
        images: [
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600",
          "https://images.unsplash.com/photo-1606765962248-7ff407b51667?w=600",
        ],
      },

      // Ropa y Moda
      {
        name: "Zapatillas Nike Air Max",
        description: "Zapatillas deportivas con tecnología Air para máxima comodidad",
        price: 129.99,
        category: "ropa",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",
        ],
      },
      {
        name: "Jeans Levi's 501",
        description: "Jeans clásicos de corte recto, 100% algodón",
        price: 89.99,
        category: "ropa",
        stock: 50,
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
          "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600",
        ],
      },
      {
        name: "Chaqueta de Cuero",
        description: "Chaqueta de cuero genuino estilo motociclista",
        price: 299.99,
        category: "ropa",
        stock: 12,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
          "https://images.unsplash.com/photo-1520975867597-0af37a22e31e?w=600",
        ],
      },
      {
        name: "Vestido Floral de Verano",
        description: "Vestido ligero y elegante perfecto para el verano",
        price: 59.99,
        category: "ropa",
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600",
        ],
      },
      {
        name: "Reloj Casio Vintage",
        description: "Reloj digital retro resistente al agua",
        price: 49.99,
        category: "ropa",
        stock: 35,
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
        ],
      },

      // Hogar y Decoración
      {
        name: "Sofá Moderno de 3 Plazas",
        description: "Sofá tapizado en tela gris con patas de madera",
        price: 799.99,
        category: "hogar",
        stock: 6,
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600",
        ],
      },
      {
        name: "Lámpara de Pie Minimalista",
        description: "Lámpara de diseño moderno con luz LED regulable",
        price: 89.99,
        category: "hogar",
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
        ],
      },
      {
        name: "Plantas Decorativas Set",
        description: "Set de 3 plantas de interior con macetas modernas",
        price: 45.99,
        category: "hogar",
        stock: 28,
        images: [
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600",
          "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=600",
        ],
      },
      {
        name: "Set de Sábanas Premium",
        description: "Juego de sábanas de algodón egipcio 400 hilos",
        price: 119.99,
        category: "hogar",
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
        ],
      },

      // Deportes y Fitness
      {
        name: "Bicicleta de Montaña",
        description: "Bicicleta MTB con suspensión completa y cambios Shimano",
        price: 599.99,
        category: "deportes",
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600",
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600",
          "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=600",
        ],
      },
      {
        name: "Mancuernas Ajustables 20kg",
        description: "Set de mancuernas con peso ajustable para entrenamiento en casa",
        price: 149.99,
        category: "deportes",
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
        ],
      },
      {
        name: "Esterilla de Yoga Premium",
        description: "Colchoneta antideslizante de 6mm con bolsa de transporte",
        price: 39.99,
        category: "deportes",
        stock: 35,
        images: [
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
        ],
      },
      {
        name: "Balón de Fútbol Profesional",
        description: "Balón oficial tamaño 5, aprobado por FIFA",
        price: 34.99,
        category: "deportes",
        stock: 42,
        images: [
          "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600",
          "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600",
        ],
      },

      // Libros y Educación
      {
        name: "Clean Code - Robert Martin",
        description: "Guía definitiva para escribir código limpio y mantenible",
        price: 34.99,
        category: "educacion",
        stock: 45,
        images: [
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
        ],
      },
      {
        name: "Set de Libros de JavaScript",
        description: "Colección de 3 libros sobre JavaScript moderno",
        price: 79.99,
        category: "educacion",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
        ],
      },

      // Cocina
      {
        name: "Cafetera Espresso Deluxe",
        description: "Máquina de café espresso con vaporizador de leche",
        price: 279.99,
        category: "cocina",
        stock: 12,
        images: [
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600",
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
        ],
      },
      {
        name: "Licuadora de Alta Potencia",
        description: "Licuadora 1200W ideal para smoothies y batidos",
        price: 99.99,
        category: "cocina",
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600",
          "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600",
        ],
      },
      {
        name: "Set de Cuchillos Profesionales",
        description: "Juego de 8 cuchillos de acero inoxidable con soporte",
        price: 159.99,
        category: "cocina",
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600",
          "https://images.unsplash.com/photo-1614624533048-2e4c2c1e0bc1?w=600",
        ],
      },
      {
        name: "Tabla de Cortar de Bambú",
        description: "Tabla ecológica reversible con canal para jugos",
        price: 29.99,
        category: "cocina",
        stock: 40,
        images: [
          "https://images.unsplash.com/photo-1594873293084-c5bbc5b5f21c?w=600",
          "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600",
        ],
      },

      // Juguetes y Niños
      {
        name: "LEGO Architecture Set",
        description: "Set de construcción de edificios famosos, 1500 piezas",
        price: 169.99,
        category: "juguetes",
        stock: 14,
        images: [
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600",
          "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600",
        ],
      },
      {
        name: "Peluche Osito Gigante",
        description: "Oso de peluche suave de 80cm de altura",
        price: 59.99,
        category: "juguetes",
        stock: 22,
        images: [
          "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=600",
          "https://images.unsplash.com/photo-1563373796-94059840883e?w=600",
        ],
      },

      // Belleza y Cuidado Personal
      {
        name: "Set de Maquillaje Profesional",
        description: "Kit completo con paleta de sombras, brochas y estuche",
        price: 79.99,
        category: "belleza",
        stock: 22,
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
        ],
      },
      {
        name: "Perfume Elegance Premium",
        description: "Fragancia unisex de larga duración 100ml",
        price: 89.99,
        category: "belleza",
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600",
        ],
      },
      {
        name: "Secador de Pelo Profesional",
        description: "Secador iónico 2000W con 3 velocidades",
        price: 69.99,
        category: "belleza",
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
          "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600",
        ],
      },
    ];

    const products = await Product.insertMany(productData);

    console.log(`✅ ${products.length} productos creados con imágenes reales`);

    // ---------------------------
    // Crear carritos vacíos y favoritos
    // ---------------------------
    for (const user of [admin, ...users]) {
      await Cart.create({ user: user._id, products: [], total: 0 });
      await Favorite.create({ user: user._id, products: [] });
    }

    console.log("🛒 Carritos y favoritos inicializados");

    console.log("🎉 Seed completado exitosamente");
    console.log(`📊 Resumen: ${users.length + 1} usuarios, ${products.length} productos`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al sembrar la base de datos:", err);
    process.exit(1);
  }
};

seed();