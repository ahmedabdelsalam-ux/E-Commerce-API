import { Router } from "express";
import {
  signup,
  login,
  confirmEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/confirm/:token", confirmEmail);

export default router;



