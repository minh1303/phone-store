const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category = sequelize.define("category", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/catalog/category/${this.name}`;
    },
    set() {
        return "Don't try to set url value!"
    }
  },
});

module.exports = Category