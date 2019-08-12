const { model, Schema } = require('mongoose');
const jwt = require('jsonwebtoken');
const { hashSync, compareSync } = require('bcryptjs');
const session = require('../config/session');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'É necessário informar um nome'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Digite um e-mail válido'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Digite uma senha válida'],
    },
    phones: [
      {
        number: Number,
        ddd: Number,
      },
    ],
    lastLogin: Date,
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

UserSchema.pre('save', function (next) {
  this.token = this.generateToken();

  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }

  return next();
});

UserSchema.methods = {
  checkPassword(password) {
    return compareSync(password, this.password);
  },

  generateToken() {
    return jwt.sign({ id: this.id }, process.env.SECRET,
      { expiresIn: session.expiresIn });
  },
};

module.exports = model('User', UserSchema);
