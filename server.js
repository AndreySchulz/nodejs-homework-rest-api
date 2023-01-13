const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const dbUrl = process.env.MONGO;

mongoose
  .connect(dbUrl)
  .then(
    app.listen(3000, () => {
      console.log(
        "Server running. Use our API on port: 3000, Database connection successful"
      );
    })
  )
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
