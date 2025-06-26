const {
  successResponse,
  errorResponse,
} = require("../../helpers/responseMessages");
const Cart = require("../../models/Cart");
const CartItems = require("../../models/CartItem");
const Product = require("../../models/Product");

exports.get = async (req, res, next) => {
  try {
    const user = req.user;

    const userCart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: CartItems,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!userCart) {
      return successResponse(res, 200, "سبد خرید شما خالی است.", { cart: [] });
    }

    const cartItems = await CartItems.findAll({
      where: { cartId: userCart.id },
    });

    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * item.priceAtTimeOfAdd;
    }, 0);

    return successResponse(res, 200, { userCart, totalPrice });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const mainProduct = await Product.findByPk(productId);
    if (!mainProduct || !mainProduct.stock) {
      return errorResponse(
        res,
        404,
        "فروش محصول مورد نظر متوقف شده و یا موجودی انبار صفر می باشد."
      );
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = Cart.create({ userId });
    }

    let cartItem = await CartItems.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await CartItems.create({
        cartId: cart.id,
        productId,
        quantity,
        priceAtTimeOfAdd: mainProduct.price,
      });
    }

    return successResponse(res, 200, "محصول با موفقیت به سبد خرید اضافه شد.");
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    const userCart = await Cart.findOne({ where: { userId: user.id } });
    if (!userCart) {
      return errorResponse(res, 404, "سبد خرید شما خالی است.");
    }

    let items = await CartItems.findOne({
      where: { cartId: userCart.id, productId: productId },
    });

    if (!items) {
      return errorResponse(res, 404, "این محصول در سبد خرید شما وجود ندارد.");
    }

    if (items.quantity > 1) {
      items.quantity -= 1;
      await items.save();
      return successResponse(
        res,
        200,
        "تعداد این محصول در سبد خرید شما یک عدد کاهش یافت."
      );
    } else {
      await items.destroy();
    }

    return successResponse(
      res,
      200,
      "محصول مورد نظر با موفقیت از سبد خرید شما حذف گردید."
    );
  } catch (error) {
    next(error);
  }
};
