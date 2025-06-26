const { Model, DataTypes, INTEGER } = require("sequelize");
const { sequelize } = require("../configs/db");

class OrderItem extends Model {}

OrderItem.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
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
    },

    priceOfPurchase: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "orderItems",
  }
);

module.exports = OrderItem;
