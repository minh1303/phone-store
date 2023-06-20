const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
exports.categoryList = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.findAll();
  res.render("category_list", {
    title: "Category list",
    category_list: allCategories,
  });
});

exports.categoryDetail = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    where: {
      name: req.params.name,
    },
  });
  if (category) {
    res.render("category_detail", {
      title: req.params.name,
      category,
    });
  } else {
    res.render("error", { error: "That category doesn't exist." });
  }
});

exports.createCategoryGet = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Category form" });
});

exports.createCategoryPost = [
  body("name").trim().notEmpty().withMessage("Name must not be empty").escape(),
  body("description").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const categoryExists = await Category.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (categoryExists) {
      errors.push({ msg: "A category with the same name already exists" });
    }
    const { name, description } = req.body;
    const category = { name, description };
    if (errors.length > 0) {
      return res.render("category_form", {
        title: "Category form",
        category,
        errors: errors,
      });
    } else {
      await Category.create(category);
      res.redirect("/catalog/categories");
    }
  }),
];

exports.deleteCategoryGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    where: {
      name: req.params.name,
    },
  });
  const phonesInCategory = await category.getPhones();
  res.render("category_delete", {
    title: "Delete category",
    category,
    category_phones: phonesInCategory,
  });
});

exports.deleteCategoryPost = [
  body("secretpassword").trim().notEmpty().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const category = await Category.findOne({
      where: {
        name: req.params.name,
      },
    });
    const phonesInCategory = await category.getPhones();

    if (req.body.secretpassword === process.env.SECRET_PASSWORD) {
      await category.destroy();
      res.redirect("/catalog/categories");
    } else {
      errors.push({ msg: "Incorrect secret password" });
      res.render("category_delete", {
        title: "Delete category",
        category,
        category_phones: phonesInCategory,
        errors: errors,
      });
    }
  }),
];

exports.updateCategoryGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({
    where: {
      name: req.params.name,
    },
  });
  res.render("category_form", {
    title: "Category form",
    category,
    state: "updating",
  });
});

exports.updateCategoryPost = [
  body("name").trim().notEmpty().withMessage("Name must not be empty").escape(),
  body("description").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const category = await Category.findOne({
      where: {
        name: req.params.name,
      },
    });

    if (errors.length > 0) {
      res.render("category_form", {
        title: "Category form",
        category,
        errors,
        state: "updating",
      });
    } else if (req.body.secretpassword === process.env.SECRET_PASSWORD) {
      await category.update({
        name: req.body.name,
        description: req.body.description,
      });
      res.redirect(category.url);
    } else if(req.body.secretpassword !== process.env.SECRET_PASSWORD) {
      errors.push({msg: "Incorrect secret password"})
      res.render("category_form", {
        title: "Category form",
        category,
        errors,
        state: "updating",
      });
    }
  }),
];
