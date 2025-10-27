import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Registrar usuario
export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await argon2.hash(password);
  const user = new User({ name, email, password: hashedPassword, role });
  return await user.save();
};

// Login
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
};

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Login / registro con Google
export const googleLogin = async (firebaseToken) => {
  if (!firebaseToken) throw new Error("Token requerido");

  // Verificar token con Firebase
  const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
  const { email, name, uid } = decodedToken;

  // Buscar o crear usuario
  let user = await User.findOne({ email });
  if (!user) {
    const hashedPassword = await argon2.hash(uid); // hash por consistencia
    user = new User({
      name: name || "Sin nombre",
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();
  }

  // Generar JWT propio
  const backendToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, backendToken };
};
