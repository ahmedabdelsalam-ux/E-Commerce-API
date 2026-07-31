import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const checkout = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { shippingAddress } = req.body;

    // Check Shipping Address
    if (
      !shippingAddress?.details ||
      !shippingAddress?.phone ||
      !shippingAddress?.city
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Shipping Address Is Required",
      });
    }

    // Find Cart
    const cart = await Cart.findOne({
      _id: cartId,
      user: req.user._id,
    }).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart Not Found",
      });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Cart Is Empty",
      });
    }

    let totalPrice = 0;

    // Check Stock & Calculate Total
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "Product Not Found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: "fail",
          message: `${product.title} Does Not Have Enough Stock`,
        });
      }

      totalPrice += product.price * item.quantity;
    }

    // Update Stock
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      product.stock -= item.quantity;

      await product.save();
    }

    // Invoice
    const invoice = {
      user: {
        name: req.user.name,
        email: req.user.email,
      },

      shippingAddress,

      products: cart.products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        totalProductPrice: item.product.price * item.quantity,
      })),

      totalPrice,

      paymentMethod: "Cash On Delivery",
    };

    // Clear Cart
    cart.products = [];
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Order Created Successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};