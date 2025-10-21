import express from "express";
import {
  sendResetEmailController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  sendResetEmailSchema,
  resetPasswordSchema,
} from "../validation/authValidation.js";

const router = express.Router();

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
