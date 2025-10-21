import express from "express";
import {
  sendResetEmailController,
  resetPasswordController,
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  sendResetEmailSchema,
  resetPasswordSchema,
} from "../validation/authValidation.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

router.post(
  "/send-reset-email",
  validateBody(sendResetEmailSchema),
  sendResetEmailController,
);

router.post(
  "/reset-pwd",
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default router;
