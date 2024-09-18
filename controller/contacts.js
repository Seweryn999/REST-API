const service = require("../service/contacts");
const Joi = require("joi");

const responseSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const get = async (req, res, next) => {
  try {
    const results = await service.getContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await service.getContactById(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const body = req.body;
  try {
    const value = await responseSchema.validate(req.body);
    if (value.error) {
      res.send(400).json({ error: error.message });
    }
    const result = await service.addContact(body);
    res.json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const value = await responseSchema.validate(req.body);
    if (value.error) {
      res.send(400).json({ error: error.message });
    }
    const { contactId } = req.params;
    const { body } = req;
    const results = await service.updateContact(contactId, body);
    if (body) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: results,
        },
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 404,
        message: "missing field",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateFav = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite = false } = req.body;
    const results = await service.updateFavorite(contactId, { favorite });
    if (results) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: results,
        },
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 404,
        message: "missing field favorite",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await service.removeContact(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "successfully removed",
        data: {
          contactId,
          data: {
            contact: result,
          },
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateFav,
  remove,
};
