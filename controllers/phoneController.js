const Phone = require("../models/phone");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Category = require("../models/category");
require("dotenv").config();
exports.phoneList = asyncHandler(async (req, res, next) => {
  const allPhones = await Phone.findAll();
  res.render("phone_list", {
    title: "Phone list",
    phone_list: allPhones,
  });
});

exports.phoneDetail = asyncHandler(async (req, res, next) => {
  const phone = await Phone.findByPk(req.params.id);
  phone.category = await phone.getCategory();

  if (phone) return res.render("phone_detail", { title: phone.name, phone });
});

exports.createPhoneGet = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.findAll();
  res.render("phone_form", { title: "Phone form", categories: allCategories });
});

exports.createPhonePost = [
  body("name").notEmpty().trim().escape(),
  body("description").trim().escape(),
  body("price").notEmpty().trim().escape(),
  body("numberInStock").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const phoneExists = Phone.findOne({ where: { name: req.body.name } });
    if (phoneExists) {
      errors.push({ msg: "A phone with the same name already exists" });
    }
    const { name, description, price, numberInStock, category } = req.body;
    const phone = { name, description, price, numberInStock, category };
    const allCategories = await Category.findAll();
    if (errors.length > 0) {
      for (let i = 0; i < allCategories.length; i++) {
        if (allCategories[i].name === category)
          allCategories[i].selected = true;
        else allCategories[i].selected = false;
      }
      return res.render("phone_form", {
        title: "Phone form",
        phone,
        errors: errors,
        categories: allCategories,
      });
    } else {
      const newPhone = await Phone.create(phone);
      await newPhone.setCategory(category);
      res.redirect("/catalog/phones");
    }
  }),
];

exports.deletePhoneGet = asyncHandler(async (req, res, next) => {
  const phone = await Phone.findByPk(req.params.id);
  res.render("phone_delete", { title: "Delete phone", phone });
});

exports.deletePhonePost = [
  body("secretpassword").notEmpty().trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const phone = await Phone.findByPk(req.params.id);
    if (errors.length > 0) {
      res.render("phone_delete", { title: "Delete phone", phone, errors });
    } else if (req.body.secretpassword === process.env.SECRET_PASSWORD) {
      await phone.destroy();
      res.redirect("/catalog/phones");
    } else if (req.body.secretpassword !== process.env.SECRET_PASSWORD) {
      errors.push({ msg: "Incorrect secret password!" });
      res.render("phone_delete", { title: "Delete phone", phone, errors });
    }
  }),
];

exports.updatePhoneGet = asyncHandler(async (req, res, next) => {
  const phone = await Phone.findByPk(req.params.id);
  const allCategories = await Category.findAll();
  phone.category = await phone.getCategory();
  for (let i = 0; i < allCategories.length; i++) {
    if (allCategories[i].id === phone.category.id)
      allCategories[i].selected = true;
    else allCategories[i].selected = false;
  }

  res.render("phone_form", {
    phone,
    categories: allCategories,
    state: "updating",
  });
});

exports.updatePhonePost = [
  body("name").notEmpty().trim().escape(),
  body("description").trim().escape(),
  body("price").notEmpty().trim().escape(),
  body("numberInStock").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    const phone = await Phone.findByPk(req.params.id);
    const allCategories = await Category.findAll();
    phone.category = await phone.getCategory();
    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].id === phone.category.id)
        allCategories[i].selected = true;
      else allCategories[i].selected = false;
    }
    if (!phone) errors.push({ msg: "Phone doesn't exist" });
    if (errors.length > 0) {
      res.render("phone_form", {
        phone,
        categories: allCategories,
        state: "updating",
        errors,
      });
    } else if (req.body.secretpassword === process.env.SECRET_PASSWORD) {
      const category = await Category.findOne({
        where: {
          name: req.body.category,
        },
      });
      await phone.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
      });
      await phone.setCategory(category);
      res.redirect(`/catalog/phone/${phone.id}`);
    } else if (req.body.secretpassword !== process.env.SECRET_PASSWORD) {
      errors.push({ msg: "Incorrect secret password!" });
      res.render("phone_form", {
        phone,
        categories: allCategories,
        state: "updating",
        errors,
      });
    }
  }),
];
