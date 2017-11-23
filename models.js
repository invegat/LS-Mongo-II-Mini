const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
const PersonSchema = ({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
    },
    friends: [],
    age: Number,
    gender: String,
    location: String,
    dateOfBirth: Date,
})

module.exports = mongoose.model('Person', PersonSchema);
