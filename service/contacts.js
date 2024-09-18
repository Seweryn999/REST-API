const Contact = require("./schema/contact");

const getContacts = async (query) => {
  return Contact.find(query);
};

const getContactById = async (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};

const addContact = async (data) => {
  return Contact.create(data);
};

const updateContact = async (id, userId, data) => {
  return Contact.findByIdAndUpdate({ _id: id, owner: userId }, data, {
    new: true,
  });
};

const updateFavorite = async (id, userId, favorite) => {
  return Contact.findByIdAndUpdate({ _id: id, owner: userId }, favorite, {
    new: true,
  });
};

const removeContact = async (id, userId) => {
  return Contact.findByIdAndDelete({ _id: id, owner: userId });
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  removeContact,
};
