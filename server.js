const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const mongoose = require("mongoose");

const routerApi = require("./routes/api/contacts");
const routerAuth = require("./routes/api/auth");
const routerVerify = require("./routes/api/verify");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
require("./config/passport");

app.use("/api/contacts", routerApi);
app.use("/api/contacts/users", routerAuth, routerVerify);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, async () => {
      console.log(`App listens on port ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
