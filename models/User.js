const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const Gender = Object.freeze({
  Male: 'Male',
  Female: 'Female',
});


const UserSchema = new mongoose.Schema({
  firstName : {
    type: String,
    minLength: 5,
    maxLength: 55,
    required: 'This field is required'
  },

  lastName : {
    type: String,
    minLength: 5,
    maxLength: 55,
    required : 'This field is required'
  },
  dateOfBirth : {
    type: Date,
    required : 'This field is required'
  },
  picture: {
    type: String,
    required: true,
  },
  email : {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    required : 'This field is required'
  },
  gender : {
    type: String,
    enum: Object.values(Gender),
  },
  password : {
    type: String,
    required : 'This field is required',
    minLength: 8,
    maxLength: 255
  },
  isAdmin : {
    type: Boolean,
    default: false
  },
  biography: {
    type: String,
  },
  refreshToken: String,
});

UserSchema.set('toJSON', { virtuals: true })

UserSchema.virtual("questions", {
  ref: "Question",
  foreignField: "userId",
  localField: "_id"
});

UserSchema.plugin(timestamps);
mongoose.model("User", UserSchema)