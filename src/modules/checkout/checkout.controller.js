const { sequelize } = require("../../configs/db");
const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessages");
const Cart = require("../../models/Cart");
const CartItems = require("../../models/CartItem");
const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");
const { createPayment, verifyPayment } = require("../../service/zarinpal");

exports.createCheckout = async (req, res, next) => {
  try {
    const { address } = req.body;
    const user = req.user;

    const userCart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: CartItems,
          as: "items",
        },
      ],
    });

    if (!userCart || userCart.length === 0) {
      return errorResponse(res, 404, "سبد خرید شما خالی است.");
    }

    const checkoutExist = await Order.findOne({
      where: { userId: user.id, status: "Pending" },
    });
    if (checkoutExist) {
      return errorResponse(res, 400, "شما یک صورت حساب پرداخت نشده دارید!");
    }

    const order = await Order.create({
      userId: user.id,
      totalPrice: 0,
      status: "Pending",
      shippingAddress: address,
      authority: "",
    });

    let totalPrice = 0;

    for (const item of userCart.items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceOfPurchase: item.priceAtTimeOfAdd,
      });

      totalPrice += item.quantity * item.priceAtTimeOfAdd;
    }

    order.totalPrice = totalPrice;

    const newPayment = await createPayment({
      amountInRial: totalPrice,
      description: `سفارش با شماره شناسه ${Date.now().toString().slice(0, 4)}`,
      mobile: user.phone,
    });

    order.authority = newPayment.authority;
    await order.save();

    return successResponse(res, 200, "فرایند تسویه حساب با موفقیت آغاز شد.", {
      paymentUrl: newPayment.paymentUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { Status, Authority } = req.query;
    const user = req.user;

    const hasOrderAlreadyCreated = await Order.findOne({
      where: { authority: Authority },
      transaction: t,
    });

    if (!hasOrderAlreadyCreated) {
      throw new Error("سفارش یافت نشد.");
    }

    if (hasOrderAlreadyCreated.status !== "Pending") {
      throw new Error("این پرداخت قبلا تائید شده است.");
    }

    const verifyPaymentStatus = await verifyPayment({
      amountInRial: hasOrderAlreadyCreated.totalPrice,
      authority: Authority,
    });

    if (![100, 101].includes(verifyPaymentStatus.code) || Status !== "OK") {
      throw new Error("پرداخت تائید نشد!");
    }

    hasOrderAlreadyCreated.status = "paid";
    await hasOrderAlreadyCreated.save({ transaction: t });

    const userCart = await Cart.findOne({ where: { userId: user.id } });

    await CartItems.destroy({ where: { cartId: userCart.id }, transaction: t });

    await t.commit();
    return successResponse(res, 200, "پرداخت موفقیت آمیز بود.");
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
