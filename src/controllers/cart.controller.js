import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Add To Cart (+1)
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check Product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    // Find Cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // Create Cart
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
      });
    }

    // Search Product
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      // Check Stock
      if (cart.products[productIndex].quantity >= product.stock) {
        return res.status(400).json({
          message: "Not Enough Stock",
        });
      }

      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product Added To Cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        message: "Cart Is Empty",
      });
    }

    res.status(200).json({
      message: "Cart Retrieved Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Increase Quantity (+1)
export const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart Not Found",
      });
    }

    const item = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product Not Found In Cart",
      });
    }

    const product = await Product.findById(productId);

    if (item.quantity >= product.stock) {
      return res.status(400).json({
        message: "Not Enough Stock",
      });
    }

    item.quantity++;

    await cart.save();

    res.status(200).json({
      message: "Quantity Increased",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Decrease Quantity (-1)
export const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart Not Found",
      });
    }

    const item = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product Not Found In Cart",
      });
    }

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await cart.save();

    res.status(200).json({
      message: "Quantity Decreased",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Product
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart Not Found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product Removed Successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};