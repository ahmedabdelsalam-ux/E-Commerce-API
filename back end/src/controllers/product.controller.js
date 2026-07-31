import Product from "../models/product.model.js";
import slugify from "slugify";

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    res.status(200).json({
      message: "Products Retrieved Successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Product By Id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      message: "Product Retrieved Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      imageCover,
      category,
      ratingsAverage,
    } = req.body;

    const isExist = await Product.findOne({ title });

    if (isExist) {
      return res.status(409).json({
        message: "Product Already Exists",
      });
    }

    const product = await Product.create({
      title,
      slug: slugify(title, {
        lower: true,
        strict: true,
      }),
      description,
      price,
      stock,
      imageCover,
      category, // Category ID
      ratingsAverage,
    });

    const newProduct = await Product.findById(product._id).populate("category");

    res.status(201).json({
      message: "Product Created Successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    res.status(200).json({
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};