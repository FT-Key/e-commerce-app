import { authService } from "../services/index.js";
import admin from "../config/firebaseAdmin.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Registro tradicional
export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Login tradicional
export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

// Login/registro con Google
export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token requerido" });

    // Verificar token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decodedToken;

    // Buscar usuario en DB
    let user = await authService.findUserByEmail(email);

    // Si no existe, crear usuario
    if (!user) {
      user = await authService.registerUser({
        name: name || "Sin nombre",
        email,
        password: uid, // aleatorio o temporal
        role: "user",
      });
    }

    // Generar JWT propio
    const backendToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token: backendToken });
  } catch (error) {
    next(error);
  }
};
