const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../configs/db");

class Order extends Model {}

Order.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Paid", "Shipped", "Cancelled"),
      defaultValue: "pending",
    },

    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    authority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);

module.exports = Order;
