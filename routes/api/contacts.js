const express = require("express");
const uniqid = require("uniqid");
const Joi = require("joi");
const contacts = require("../../models/contacts");

const router = express.Router();

const responseSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const data = await contacts.listContacts();
    res.json({ status: "success", code: 200, data: data });
  } catch (err) {
    res.json({ status: "error", code: 404, data: err.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const data = await contacts.getContactById(req.params.contactId);

    if (!data) {
      res.json({
        status: "error",
        code: 404,
        message: "no contact for id",
      });
    }

    res.json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (err) {
    res.json({ status: "error", code: 404, data: err.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const value = await responseSchema.validate(req.body);
    if (value.error) {
      res.send(400).json({ error: error.message });
    }

    const data = await contacts.addContact({
      id: uniqid(),
      ...value,
    });

    res.json({ status: "success", code: 201, data: data });
  } catch (err) {
    res.json({ status: "error", code: 500, data: err.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const data = await contacts.removeContact(req.params.contactId);

    res.json({
      status: "succes",
      code: 200,
      message: "contact deleted successfully",
      data: data,
    });
  } catch (err) {
    res.json({ status: "error", code: 500, data: err.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  if (!req.body)
    return res.json({
      status: "error",
      message: "missing fields",
      code: 400,
    });

  try {
    const { error } = responseSchema.validate(req.body);
    if (error) {
      res.send(400).json({ error: error.message });
    }
    const existingContact = await contacts.getContactById(req.params.contactId);

    if (!existingContact)
      return res.json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    const { name, email, phone } = req.body;
    const data = await contacts.updateContact(req.params.contactId, {
      id: req.params.contactId,
      name,
      email,
      phone,
    });
    res.json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    return res.json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
});

module.exports = router;
