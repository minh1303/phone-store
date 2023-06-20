const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Category = require("./category");

const Phone = sequelize.define("phone", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false

  },
  numberInStock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.VIRTUAL,
    get() {
      return `/catalog/phone/${this.id}`;
    },
  },
});

Category.hasMany(Phone);
Phone.belongsTo(Category);

module.exports = Phone;
