const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/category", authMiddleware.verifyToken, categoryController.createCategory);
router.get("/category", authMiddleware.verifyToken, categoryController.getCategory);
router.put("/category/:categoryId", authMiddleware.verifyToken, categoryController.updateCategory);
router.delete("/category/:categoryId", authMiddleware.verifyToken, categoryController.deleteCategory);

module.exports = router;