import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { User } from "../db/models/User.js";
import { sendMail } from "../services/mailer.js";
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from "../services/auth.js";

const { JWT_SECRET, APP_DOMAIN } = process.env;

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw createHttpError(400, "Email is required!");

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, "User not found!");

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    const html = `
      <h2>Şifre sıfırlama talebi</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Bu bağlantı 5 dakika boyunca geçerlidir.</p>
    `;

    await sendMail({ to: email, subject: "Şifre sıfırlama bağlantınız", html });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    console.error("❌ Error in sendResetEmailController:", error);
    next(
      createHttpError(500, "Failed to send the email, please try again later."),
    );
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      throw createHttpError(400, "Token and password are required!");

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) throw createHttpError(404, "User not found!");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    console.error("❌ Error in resetPasswordController:", error);
    next(error);
  }
};
export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, cookieOptions } = await loginUser({
      email,
      password,
    });
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  } catch (e) {
    next(e);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    const { accessToken, newRefreshToken, cookieOptions } =
      await refreshSession(refreshToken);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken },
    });
  } catch (e) {
    next(e);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    await logoutUser(refreshToken);
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
