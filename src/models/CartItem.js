const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

class CartItems extends Model {}

CartItems.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "carts",
        key: "id",
      },
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    priceAtTimeOfAdd: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CartItems",
    tableName: "cartItems",
  }
);

module.exports = CartItems;
