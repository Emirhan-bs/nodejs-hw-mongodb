import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from "../services/auth.js";

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
