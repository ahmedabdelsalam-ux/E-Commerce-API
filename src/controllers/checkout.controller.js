import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart Is Empty",
      });
    }

    let totalPrice = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.title} Out Of Stock`,
        });
      }

      totalPrice += product.price * item.quantity;

      product.stock -= item.quantity;

      await product.save();
    }

    const invoice = {
      user: req.user.name,
      products: cart.products,
      totalPrice,
    };

    cart.products = [];

    await cart.save();

    res.status(200).json({
      message: "Checkout Successfully",
      invoice,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};