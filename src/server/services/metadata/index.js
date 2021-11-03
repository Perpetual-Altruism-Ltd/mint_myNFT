const router = require("express").Router();
const MetadataModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    const allMetaData = await MetadataModel.find();

    res.status(200).send(allMetaData);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:tokenId", async (req, res, next) => {
  try {
    const tokenId = req.params.tokenId.toString();
    const metadata = await MetadataModel.find({ tokenID: tokenId });
    if (metadata.length > 0) {
      res.status(200).send(metadata[0]);
    } else {
      const err = new Error();
      err.message = `This token: ${tokenId} does not exist!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const metadata = new MetadataModel(req.body);
    await metadata.save();
    res.status(201).send(metadata);
  } catch (error) {
    if (error.name === "ValidationError") {
      error.httpStatusCode = 400;
      let errorArray = [];
      const errs = Object.keys(error.errors);

      errs.forEach((err) =>
        errorArray.push({
          message: error.errors[err].message,
          path: error.errors[err].path,
        })
      );

      next({ httpStatusCode: error.httpStatusCode, errors: errorArray });
    } else {
      next(error);
    }
  }
});

module.exports = router;
