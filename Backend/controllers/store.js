const sellerSchema = require("../models/seller.js");
const productSchema = require("../models/products.js");
const connectDB = require("../db/connection.js");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET_KEY = 'idjqwidjiqjiqdjiqwjd';
const expiresIn = '1h';
const StoreSchema = new Map([["product", productSchema]]);
const SellerSchema = new Map([["Seller", sellerSchema]]);


exports.getSellers = async (req, res) => {
  try {
    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");
    const sellers = await sellerModel.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const { storeName } = req.seller;

    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, "product");
      const products = await productModel.find();
      res.status(200).json(products);
    } else {
      res.status(400).send("Store does not exist");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};





const generateToken = (seller) => {

  const token = jwt.sign({ sellerId: seller._id, username: seller.username, storeName: seller.storeName }, SECRET_KEY, { expiresIn });
  return token;
};


exports.createSeller = async (req, res) => {
  try {
    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");

    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newSeller = await sellerModel.create({
      username: req.body.username,
      password: hashedPassword,
      email:req.body.email,
      storeName:req.body.storeName
    });
    
    const token = generateToken(newSeller);

    res.status(201).json({ token, message: "Seller Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

exports.loginSeller = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");

    const existingSeller = await sellerModel.findOne({ username });

    if (existingSeller) {
      const isPasswordValid = await bcrypt.compare(password, existingSeller.password);

      if (isPasswordValid) {
        const token = generateToken(existingSeller);
        res.status(200).json({ token, message: "Login successful" });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.storeName) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const storeName = decodedToken.storeName;

    if (!name || !price || !quantity) {
      return res.status(400).json({ error: "Incomplete product information" });
    }

    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, "product");
      await productModel.create({ ...req.body, storeName });
      res.status(201).json({ message: "Product created successfully" });
    } else {
      res.status(400).json({ error: "Store does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, 'idjqwidjiqjiqdjiqwjd');
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}


exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { storeName } = req.seller;

    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, "product");

      await productModel.findByIdAndUpdate(productId, req.body);

      res.status(200).send("Product updated successfully");
    } else {
      res.status(400).send("Store does not exist");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { storeName } = req.seller;

    const sellerDB = await switchDB("SellerApp", SellerSchema);
    const sellerModel = await getDBModel(sellerDB, "Seller");
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, "product");

      await productModel.findByIdAndDelete(productId);

      res.status(200).send("Product deleted successfully");
    } else {
      res.status(400).send("Store does not exist");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

























const switchDB = async (dbName, dbSchema) => {
  const mongoose = await connectDB();
  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.useDb(dbName, { useCache: true });
    if (!Object.keys(db.models).length) {
      dbSchema.forEach((schema, modelName) => {
        db.model(modelName, schema);
      });
    }
    return db;
  }
  throw new Error("Error connecting to the database");
};

const getDBModel = async (db, modelName) => {
  return db.model(modelName);
};

