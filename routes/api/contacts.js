const express = require("express");
const router = express.Router();
const ctrlContacts = require("../../controller/contacts");
const auth = require("../../middlewares/auth");

router.get("/", auth, ctrlContacts.get);

router.get("/:contactId", auth, ctrlContacts.getById);

router.post("/", auth, ctrlContacts.create);

router.put("/:contactId", auth, ctrlContacts.update);

router.patch("/:contactId/favorite", auth, ctrlContacts.updateFav);

router.delete("/:contactId", auth, ctrlContacts.remove);

module.exports = router;
