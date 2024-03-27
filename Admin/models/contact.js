import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
  fullname: {
    type: String,
  },

  email: {
    type: String,
  },

  title: {
    type: String,
    required: [true, "Title is required!"],
  },

  category: {
    type: String,
  },

  message: {
    type: String,
    required: [true, "Message is required!"],
  },

  date: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
  },

  response: {
    type: String,
  },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
