const mongoose = require('mongoose');

const pw = require('./password');

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    fullName: { type: String },
    organization: { type: String },
    position: { type: String },
    email: { type: String },
    phone: { type: String },
    groups: [String],
  },
  { timestamps: true }
);

const ifExists = (data) => (data ? data : null);

const User = mongoose.model('User', userSchema);

const createUser = async (data) => {
  console.log(`Create user`);
  dataTmp = {
    groups: [],
    username: data.username,
    password: pw.hash(data.password),
    fullName: ifExists(data.fullName),
    organization: ifExists(data.organization),
    position: ifExists(data.position),
    email: ifExists(data.email),
    phone: ifExists(data.phone),
  };

  console.log(dataTmp);

  const query = await new User(dataTmp).save();
  return query;
};

const verifyUser = async (username, tpw) => {
  let valid = false;
  let data = null;
  const query = await User.findOne({ username });
  if (query) {
    valid = pw.verify(tpw, query.password);
    data = pw.verify(tpw, query.password) ? query : null;
  }
  return { valid, data };
};

const getSingleUser = async (_id) => {
  return await User.findOne({ _id });
};

const getSingleUserByName = async (username) => {
  return await User.findOne({ username });
};

const getAllUsers = async () => {
  let query = await User.find({});
  let data = query.map((x) => ({
    groups: x.groups,
    _id: x._id,
    username: x.username,
    fullName: x.fullName,
    organization: x.organization,
    position: x.position,
    phone: x.phone,
    email: x.email,
    updatedAt: x.updatedAt,
  }));
  return data;
};

module.exports = {
  User,
  createUser,
  verifyUser,
  getAllUsers,
  getSingleUser,
  getSingleUserByName,
};
