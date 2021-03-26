var Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "postgresql://postgres:postgres@localhost/postgres",
  { dialect: "postgres" }
);
//Model defintion

const Category = sequelize.define("category", {
  name: Sequelize.DataTypes.STRING,
  categoryUrl: Sequelize.DataTypes.STRING,
});

const SubCategory = sequelize.define("subcategory", {
  subName: Sequelize.DataTypes.STRING,
  subUrl: Sequelize.DataTypes.STRING,
  subParentId: Sequelize.DataTypes.STRING,
});

const Product = sequelize.define("product", {
  productName: Sequelize.DataTypes.STRING,
  productUrl: Sequelize.DataTypes.STRING,
});

//Model Association

Category.hasMany(SubCategory);
SubCategory.hasMany(Product);
Category.hasOne(Product);

export { Category, SubCategory, Product };

export { sequelize };
