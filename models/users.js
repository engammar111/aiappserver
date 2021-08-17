const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  hash: { type: String },
  imageCounter: { type: Number, default: 0 },
})

mongoose.model("User", userSchema)
