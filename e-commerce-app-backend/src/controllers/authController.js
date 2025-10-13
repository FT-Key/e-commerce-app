import { authService } from "../services/index.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};
