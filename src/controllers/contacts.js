import { getAllContacts, getContactById } from "../services/contacts.js";

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No contacts found",
        data: [],
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

export const getContactByIdController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found",
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error(`Error fetching contact ${req.params.contactId}:`, error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
