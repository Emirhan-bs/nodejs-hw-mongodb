import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getContactsController);
router.get("/:contactId", getContactByIdController);
router.post("/", createContactController);
router.patch("/:contactId", patchContactController);
router.delete("/:contactId", deleteContactController);

export default router;
