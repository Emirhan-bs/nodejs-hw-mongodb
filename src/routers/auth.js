import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/authSchemas.js";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), registerController);
router.post("/login", validateBody(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

export default router;
