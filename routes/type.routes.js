// import express module
const express = require("express");

// import all type controller functions
const {
  getAllTypes,
  getOneType,
  createType,
  editType,
  deleteType,
} = require("../controllers/type.controllers");

// use express router
const typeRouter = express.Router();

// use all type controller functions
typeRouter.get("/", getAllTypes);
typeRouter.get("/:id", getOneType);
typeRouter.post("/", createType);
typeRouter.put("/:id", editType);
typeRouter.delete("/:id", deleteType);

module.exports = typeRouter;
