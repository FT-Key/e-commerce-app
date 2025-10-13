import User from "../models/User.js";
import argon2 from "argon2";

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await argon2.hash(data.password);
  }
  return await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
