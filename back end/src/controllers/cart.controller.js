import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product Not Found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex > -1) {
      if (cart.products[productIndex].quantity >= product.stock) {
        return res.status(400).json({
          status: "fail",
          message: "Not Enough Stock",
        });
      }

      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Product Added Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!cart) {
      return res.status(200).json({
        status: "success",
        data: {
          _id: null,
          products: [],
          totalCartPrice: 0,
        },
      });
    }

    let totalCartPrice = 0;

    cart.products.forEach((item) => {
      totalCartPrice += item.product.price * item.quantity;
    });

    res.status(200).json({
      status: "success",
      data: {
        _id: cart._id,
        products: cart.products,
        totalCartPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart Not Found",
      });
    }

    const item = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Product Not Found In Cart",
      });
    }

    const product = await Product.findById(productId);

    if (item.quantity >= product.stock) {
      return res.status(400).json({
        status: "fail",
        message: "Not Enough Stock",
      });
    }

    item.quantity++;

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Quantity Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart Not Found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Product Removed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart Not Found",
      });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Cart Cleared Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
