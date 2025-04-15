const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emergencyContacts: [String],
  defaultMessage: String,
  location: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
// This code defines a Mongoose schema and model for a User in a MongoDB database. The `UserSchema` includes fields for the user's name, email, password, emergency contacts, a default message, and location coordinates (latitude and longitude). The `email` field is set to be unique, meaning no two users can have the same email address. Finally, the schema is compiled into a model named "User" which can be used to interact with the corresponding collection in the database.
// This model can be used to create, read, update, and delete user records in the MongoDB database. The `User` model can be imported and used in other parts of the application, such as in routes or controllers, to manage user data.