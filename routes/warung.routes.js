// import express module
const express = require("express");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

// import all warung controller functions
const {
  getAllWarungs,
  getOneWarung,
  createWarung,
  editWarung,
  deleteWarung,
} = require("../controllers/warung.controllers");

// use express router
const warungRouter = express.Router();

// use all warung controller functions
warungRouter.get("/", getAllWarungs);
warungRouter.get("/:id", getOneWarung);
warungRouter.post("/", upload.single("coverImage"), createWarung);
warungRouter.post("/:id/edit", upload.single("coverImage"), editWarung);
warungRouter.delete("/:id", deleteWarung);

module.exports = warungRouter;
