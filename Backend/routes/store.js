const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/signup", storeController.createSeller);
router.get("/seller", storeController.getSellers);
router.post("/login", storeController.loginSeller);
router.post("/product", authMiddleware.verifyToken, storeController.createProduct);
router.get("/product", authMiddleware.verifyToken, storeController.getProducts);
router.put("/product/:productId", authMiddleware.verifyToken, storeController.updateProduct);
router.delete("/product/:productId", authMiddleware.verifyToken, storeController.deleteProduct);

module.exports = router;
