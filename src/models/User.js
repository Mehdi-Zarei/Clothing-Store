const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../configs/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
    },

    role: {
      type: DataTypes.ENUM,
      values: ["ADMIN", "USER"],
      defaultValue: "USER",
    },

    isRestrict: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

module.exports = User;
