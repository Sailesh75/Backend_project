import dotenv from "dotenv";
import app from "./app.js";
import dbConnection from "./db/index.js";
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 8000;

dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Mongo db connection failed!! ${err}`);
  });
