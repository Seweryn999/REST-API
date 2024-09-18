const Contact = require("./schema/contact");

const getContacts = async () => {
  return Contact.find();
};

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
};

const addContact = async (data) => {
  return Contact.create(data);
};

const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const updateFavorite = async (id, favorite) => {
  return Contact.findByIdAndUpdate({ _id: id }, favorite, { new: true });
};

const removeContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  removeContact,
};
