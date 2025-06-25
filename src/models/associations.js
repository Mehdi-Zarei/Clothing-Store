const Product = require("./Product");
const Category = require("./Category");
const User = require("./User");
const Cart = require("./Cart");
const CartItems = require("./CartItem");

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Cart.hasMany(CartItems, {
  foreignKey: "cartId",
  as: "items",
});

CartItems.belongsTo(Cart, {
  foreignKey: "cartId",
  as: "cart",
});
