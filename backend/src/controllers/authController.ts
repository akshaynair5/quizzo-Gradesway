import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    res.status(400);
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully", user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log("🔹 Username:", username);
  console.log("🔹 Entered Password:", password);

  const user = await User.findOne({ where: { username } });
  if (!user) {
    console.log("User not found!");
    res.status(401);
    throw new Error("Invalid credentials");
  }

  console.log("Stored Hashed Password:", user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password Match:", isMatch);

  if (!isMatch) {
    console.log("Password mismatch!");
    res.status(401);
    throw new Error("Invalid credentials");
  }

  console.log("Login successful!");
  res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
});
