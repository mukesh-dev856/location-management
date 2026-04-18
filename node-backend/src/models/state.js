module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define(
    "State",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Active",
      },
    },
    {
      tableName: "states",
      timestamps: true,
      underscored: true,
    }
  );

  State.associate = (models) => {
    State.hasMany(models.City, { foreignKey: "stateId" });
  };

  return State;
};
