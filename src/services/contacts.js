const Contact = require("../models/contact");

const create = async (data) => {
  return await Contact.create(data);
};

const getById = async (id) => {
  return await Contact.findById(id);
};

const updateById = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

const deleteById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
};
