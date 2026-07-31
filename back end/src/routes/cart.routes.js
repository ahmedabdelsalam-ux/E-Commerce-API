import { Router } from "express";
import auth from "../middleware/auth.middleware.js";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", auth, getCart);

router.post("/:productId", auth, addToCart);

router.patch("/:productId", auth, updateCartQuantity);

router.delete("/:productId", auth, removeFromCart);

router.delete("/", auth, clearCart);

export default router;