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

