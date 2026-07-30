import { Router } from "express";
import auth from "../middleware/auth.middleware.js";

import {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = Router();

// Add Product (لو مش موجود يضيفه، ولو موجود يزود +1)
router.post("/:productId", auth, addToCart);

// Get Cart
router.get("/", auth, getCart);

// Increase Quantity
router.patch("/:productId/increase", auth, increaseQuantity);

// Decrease Quantity
router.patch("/:productId/decrease", auth, decreaseQuantity);

// Remove Product Completely
router.delete("/:productId", auth, removeFromCart);

export default router;