#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line

const Phone = require("./models/phone");
const Category = require("./models/category");

const phones = [];
const categories = [];
const sequelize = require("./db");
require("dotenv").config();
main().catch((err) => console.log(err));

async function main() {
  await sequelize.sync({ force: true });
  console.log("Debug: About to connect");
  console.log("Debug: Should be connected?");

  await createCategories();
  await createPhones();
  console.log("Debug: Closing");
}

async function categoryCreate(name, description) {
  const category = Category.build({ name, description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function phoneCreate(name, description, price, numberInStock, category) {
  const phonedetail = { name, description, price, numberInStock };
  const phone = await Phone.create(phonedetail);
  await phone.setCategory(category)
  phones.push(phone);
  console.log(`Added phone: ${name}`);
}


async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("Xiaomi", "A brand from China with cheap but high-tech devices"),
    categoryCreate("Apple", "By far the most popular phone brand with expensive and excellent phones"),
    categoryCreate("Samsung","From Korea"),
    categoryCreate("POCO", "A child brand of Xiaomi"),
    categoryCreate("Vivo")
  ]);
}

async function createPhones() {
  console.log("Adding phones");
  await Promise.all([
    phoneCreate("Samsung Galaxy S22 Ultra (12gb/256gb)","", 500, 30, categories[2]),
    phoneCreate("Iphone 14 PRO MAX","The leastest Iphone from Apple", 1000, 30, categories[1]),
    phoneCreate("Xiaomi 12 PRO","The flagship from Xiaomi", 500, 10, categories[0]),
    phoneCreate("POCO X4 PRO","A cheap smartphone from POCO", 200, 30, categories[3]),
    phoneCreate("VIVO V23e","", 500, 30, categories[4]),
  ]);
}

