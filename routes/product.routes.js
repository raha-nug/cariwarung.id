// import express module
const express = require("express");

// get all product controller functions
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/product.controllers");

// use express router
const productRouter = express.Router();

// use all product controller fuctions
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getOneProduct);
productRouter.post("/", createProduct);
productRouter.put("/:id", editProduct);
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
