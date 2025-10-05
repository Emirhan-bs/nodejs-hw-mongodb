const express = require("express");
const router = express.Router();

const contactsController = require("../controllers/contacts.js");
const validateBody = require("../middlewares/validateBody.js");
const isValidId = require("../middlewares/isValidId.js");
const {
  createContactSchema,
  updateContactSchema,
} = require("../validation/contactSchemas.js");

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", isValidId, contactsController.getContactById);
router.post(
  "/",
  validateBody(createContactSchema),
  contactsController.createContact,
);
router.patch(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  contactsController.updateContact,
);
router.delete("/:contactId", isValidId, contactsController.deleteContact);

module.exports = router;
