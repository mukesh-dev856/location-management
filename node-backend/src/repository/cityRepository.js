const { City, State } = require("../models");
const { Op } = require("sequelize");

const cityRepository = {
  createCity: async (stateId, name, status) => {
    return await City.create({ stateId, name, status });
  },

  getCities: async (search, page, limit) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    return await City.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: State,
          attributes: ["id", "name", "status"],
        }
      ]
    });
  },

  getCityById: async (id) => {
    return await City.findByPk(id, {
      include: [{ model: State }]
    });
  },

  updateCity: async (id, stateId, name, status) => {
    const city = await City.findByPk(id);
    if (!city) return null;
    
    if (stateId) city.stateId = stateId;
    if (name) city.name = name;
    if (status) city.status = status;
    
    await city.save();
    return city;
  },

  deleteCity: async (id) => {
    const city = await City.findByPk(id);
    if (!city) return false;
    
    await city.destroy();
    return true;
  },
  
  updateCityStatus: async (id, status) => {
    const city = await City.findByPk(id);
    if (!city) return null;
    city.status = status;
    await city.save();
    return city;
  }
};

module.exports = cityRepository;
