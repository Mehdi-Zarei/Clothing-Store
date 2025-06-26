const Product = require("./Product");
const Category = require("./Category");
const User = require("./User");
const Cart = require("./Cart");
const CartItems = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

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

Product.hasMany(CartItems, {
  foreignKey: "productId",
  as: "cartItems",
});

CartItems.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
