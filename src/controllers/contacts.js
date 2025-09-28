const createError = require("http-errors");
const contactsService = require("../services/contacts");

const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      "Missing required fields: name, phoneNumber and contactType are required",
    );
  }

  const newContact = await contactsService.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await contactsService.getById(contactId);
  if (!contact) {
    throw createError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Successfully found contact!",
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const update = req.body;

  const updated = await contactsService.updateById(contactId, update);
  if (!updated) {
    throw createError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updated,
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;

  const deleted = await contactsService.deleteById(contactId);
  if (!deleted) {
    throw createError(404, "Contact not found");
  }

  res.status(204).send();
};

module.exports = {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
