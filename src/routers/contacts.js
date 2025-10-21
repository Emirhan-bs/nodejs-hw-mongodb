import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../services/cloudinary.js";
const router = express.Router();

router.use(authenticate);

router.get("/", getContactsController);

router.get("/:contactId", getContactByIdController);

router.post("/", upload.single("photo"), createContactController);

router.patch("/:contactId", upload.single("photo"), patchContactController);

router.delete("/:contactId", deleteContactController);

export default router;
