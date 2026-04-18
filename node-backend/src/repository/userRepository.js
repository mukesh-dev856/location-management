const { User } = require("../models");

const userRepository = {
  createUser: async (name, email, hashedPassword) => {
    return await User.create({
      name,
      email,
      password: hashedPassword,
    });
  },

  findUserByEmail: async (email) => {
    return await User.findOne({ where: { email } });
  },

  findUserById: async (id) => {
    return await User.findByPk(id);
  },
};

module.exports = userRepository;
