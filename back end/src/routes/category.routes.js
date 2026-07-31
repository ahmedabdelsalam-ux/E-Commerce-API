import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

export default router;