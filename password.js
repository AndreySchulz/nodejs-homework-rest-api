const bcrypt = require("bcrypt");
const saltRounds = 16;

const hashPassword = async (pass) => {
  return await bcrypt.hash(pass, saltRounds);
};
const comparePassword = async (pass, hash) => {
  return bcrypt.compare(pass, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
