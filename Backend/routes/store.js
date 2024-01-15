const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.js");

router.post("/signup", storeController.createSeller);
router.get("/seller", storeController.getSellers);
router.post("/login", storeController.loginSeller);


module.exports = router;
