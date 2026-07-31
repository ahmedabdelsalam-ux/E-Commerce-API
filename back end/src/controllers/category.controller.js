import Category from "../models/category.model.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const isExist = await Category.findOne({ name });

    if (isExist) {
      return res.status(409).json({
        message: "Category Already Exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      image,
    });

    res.status(201).json({
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories Retrieved Successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category Not Found",
      });
    }

    res.status(200).json({
      message: "Category Retrieved Successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};