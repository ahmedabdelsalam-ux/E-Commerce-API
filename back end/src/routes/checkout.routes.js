import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";

const router = Router();

router.post("/:cartId", auth, checkout);

export default router;