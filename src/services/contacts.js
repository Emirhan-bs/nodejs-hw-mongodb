import { ContactsCollection } from "../db/models/Contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  type,
  isFavourite,
} = {}) => {
  const pageNum = parseInt(page, 10);
  const perPageNum = parseInt(perPage, 10);

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    const fav = String(isFavourite).toLowerCase();
    filter.isFavourite = fav === "true" || fav === "1";
  }

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const totalItems = await ContactsCollection.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPageNum));
  const skip = (pageNum - 1) * perPageNum;

  const data = await ContactsCollection.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(perPageNum)
    .lean();

  return {
    data,
    page: pageNum,
    perPage: perPageNum,
    totalItems,
    totalPages,
    hasPreviousPage: pageNum > 1,
    hasNextPage: pageNum < totalPages,
  };
};

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  return await ContactsCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
    ...options,
  });
};

export const deleteContact = async (contactId) => {
  return await ContactsCollection.findByIdAndDelete(contactId);
};
