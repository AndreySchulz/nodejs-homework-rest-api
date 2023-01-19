const { Users } = require("../models/users");

const addUser = async (data) => {
  return await Users.create(data);
};
const findByEmail = async (email) => {
  return await Users.findOne({ email });
};
const findById = async (id) => {
  return await Users.findOne({ _id: id });
};
const updateUser = async (id, newData) => {
  return await Users.findByIdAndUpdate({ _id: id }, newData);
};

module.exports = {
  addUser,
  findByEmail,
  findById,
  updateUser,
};
