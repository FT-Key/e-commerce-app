import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Registrar usuario con email/contraseña
export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await argon2.hash(password);
  const user = new User({ name, email, password: hashedPassword, role });
  return await user.save();
};

// Login con email/contraseña
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
