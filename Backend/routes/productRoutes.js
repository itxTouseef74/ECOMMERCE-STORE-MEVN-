const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/product", authMiddleware.verifyToken, productController.createProduct);
router.get("/product", authMiddleware.verifyToken, productController.getProducts);
router.put("/product/:productId", authMiddleware.verifyToken, productController.updateProduct);
router.delete("/product/:productId", authMiddleware.verifyToken, productController.deleteProduct);

module.exports = router;