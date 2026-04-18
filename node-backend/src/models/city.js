module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    "City",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "state_id",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      tableName: "cities",
      timestamps: true,
      underscored: true,
    }
  );

  City.associate = (models) => {
    City.belongsTo(models.State, { foreignKey: "stateId" });
  };

  return City;
};
