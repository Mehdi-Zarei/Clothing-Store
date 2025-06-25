const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
  }
);

module.exports = Cart;
