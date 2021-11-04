const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandling");
const metadataRouter = require("./services/metadata");

const port = process.env.PORT || 3005;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/metadata", metadataRouter);

errorHandler(app);

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_URL)
  .then(
    app.listen(port, () =>
      console.log(`Running locally on url http://localhost:${port}`)
    )
  )
  .catch((e) => console.log(e));
