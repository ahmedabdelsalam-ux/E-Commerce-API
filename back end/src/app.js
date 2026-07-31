import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import checkoutRouter from "./routes/checkout.routes.js";
import categoryRouter from "./routes/category.routes.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);

export default app;
