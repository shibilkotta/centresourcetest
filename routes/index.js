var express = require("express");
var router = express.Router();

import { Category, SubCategory, Product } from "../model";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//Router to add category

router.post("/addcategory", async (req, res, next) => {
  try {
    const { categoryName } = req.body;

    const categoryUrl = "demosite.com/" + categoryName;

    const newCategory = await Category.create({
      name: categoryName,
      categoryUrl,
    });

    res.status(200).json({
      message: "Category added successfully",
      createdCategory: newCategory,
    });
  } catch (error) {
    return next(error);
  }
});

//Router to add subcategory

router.post("/addsubcategory", async (req, res, next) => {
  try {
    const { subName } = req.body;
    const { catId, subCatId } = req.query;

    const parentCategory = await Category.findOne({ where: { id: catId } });
    const currentSubCategory = await SubCategory.findOne({
      where: { id: subCatId },
    });

    if (currentSubCategory) {
      var subUrl = currentSubCategory.subUrl + "/" + subName;
      const newSubCategory = await SubCategory.create({
        subName,
        subUrl,
        subParentId: subCatId,
        categoryId: catId,
      });
      res.status(200).json({
        message: "SubCategory added successfully",
        createdCategory: newSubCategory,
      });
    } else {
      var subUrl = parentCategory.categoryUrl + "/" + subName;
      const newSubCategorys = await SubCategory.create({
        subName,
        subUrl,
        categoryId: catId,
      });
      res.status(200).json({
        message: "SubCategory added successfully",
        createdCategory: newSubCategorys,
      });
    }
  } catch (error) {
    return next(error);
  }
});

//Router to add a Product

router.post("/addproduct", async (req, res, next) => {
  try {
    const { productName } = req.body;
    const { catId, subCatId } = req.query;

    const currentSubCategory = await SubCategory.findOne({
      where: { id: subCatId },
    });

    const productUrl = currentSubCategory.subUrl + "/" + productName;

    const newProduct = await Product.create({
      productName,
      productUrl,
      subcategoryId: subCatId,
      categoryId: catId,
    });

    res.status(200).json({
      message: "Product added successfully",
      createdProduct: newProduct,
    });
  } catch (error) {
    return next(error);
  }
});

//Router to edit category name and other urls

router.put("/editcategory/:catId", async (req, res, next) => {
  try {
    const { catId } = req.params;
    const { newName } = req.body;

    const currentCategory = await Category.findOne({ where: { id: catId } });
    //return next(currentCategory);
    const currentCatUrl = currentCategory.categoryUrl;
    const currentName = currentCategory.name;

    var newCatUrl = currentCatUrl.replace(currentName, newName);

    const newCategory = await currentCategory.update({
      name: newName,
      categoryUrl: newCatUrl,
    });

    //Finding and updating subcategory urls

    const subCategories = await SubCategory.findAll({
      where: { categoryId: catId },
    });

    for (const subCat of subCategories) {
      const { subUrl } = subCat;
      var newCatUrl = subUrl.replace(currentName, newName);
      await subCat.update({ subUrl: newCatUrl });
    }

    //Finding and updating product urls

    const products = await Product.findAll({
      where: { categoryId: catId },
    });

    for (const product of products) {
      const { productUrl } = product;
      var newProdUrl = productUrl.replace(currentName, newName);
      await product.update({ productUrl: newProdUrl });
    }

    res.status(200).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
