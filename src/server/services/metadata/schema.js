const { Schema, model } = require("mongoose");

const MetaDataSchema = new Schema({
  tokenID: { type: String, required: "Token Id is required" },
  description: {
    type: String,
    required: "Description is required",
    minlength: [10, "Description should at least be 10 characters long"],
  },

  sign: {
    type: String,
    required: "One letter,symbol or number is required",
    maxlength: [1, "You are allowed just one"],
  },
  name: { type: String, required: "Name is required" },
  attributes: [
    {
      _id: false,
      trait: { type: String, default: "Color" },
      value: {
        type: String,
        required: "We all need colors in our life don't we?!",
      },
    },
    {
      _id: false,
      trait: { type: String, default: "Size" },
      value: {
        type: Number,
        min: 12,
        max: [52, "Size should be maximum 52px"],
        required: "Size of the symbol is required",
      },
    },
  ],
});

MetaDataSchema.methods.toJSON = function () {
  const metadata = this;
  const metadataObj = metadata.toObject();

  delete metadataObj.__v;

  return metadataObj;
};

const MetaDataModel = model("MetaData", MetaDataSchema);

module.exports = MetaDataModel;
