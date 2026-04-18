const { State } = require("../models");
const { Op } = require("sequelize");

const stateRepository = {
  createState: async (name, status) => {
    return await State.create({ name, status });
  },

  getStates: async (search, page, limit) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    return await State.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  },

  getActiveStates: async () => {
    return await State.findAll({
      where: { status: "Active" },
      order: [["name", "ASC"]],
    });
  },

  getStateById: async (id) => {
    return await State.findByPk(id);
  },

  updateState: async (id, name, status) => {
    const state = await State.findByPk(id);
    if (!state) return null;
    
    state.name = name || state.name;
    state.status = status || state.status;
    await state.save();
    return state;
  },

  deleteState: async (id) => {
    const state = await State.findByPk(id);
    if (!state) return false;
    
    await state.destroy();
    return true;
  },

  updateStatus: async (id, status) => {
    const state = await State.findByPk(id);
    if (!state) return null;
    
    state.status = status;
    await state.save();
    return state;
  }
};

module.exports = stateRepository;
