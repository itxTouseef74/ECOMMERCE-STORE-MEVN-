const sellerSchema = require('../models/seller.js');
const categorySchema = require("../models/categoryModel.js")
const connectDB = require('../db/connection.js');
const jwt = require('jsonwebtoken');
const StoreSchema = new Map([['category', categorySchema]]);
const SellerSchema = new Map([['Seller', sellerSchema]]);

exports.getCategory = async (req, res) => {
  try {
    const { storeName } = req.seller;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const categoryModel = await getDBModel(storeDB, 'category');
      const categorys = await categoryModel.find();
      res.status(200).json(categorys);
    } else {
      res.status(400).send('Store does not exist');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { cat_name } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.storeName) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const storeName = decodedToken.storeName;

    if (!cat_name) {
      return res.status(400).json({ error: 'Incomplete category information' });
    }

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const categoryModel = await getDBModel(storeDB, 'category');
      await categoryModel.create({ ...req.body, storeName });
      res.status(201).json({ message: 'category created successfully' });
    } else {
      res.status(400).json({ error: 'Store does not exist' });
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

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { storeName } = req.seller;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const categoryModel = await getDBModel(storeDB, 'category');

      await categoryModel.findByIdAndUpdate(categoryId, req.body);

      res.status(200).send('category updated successfully');
    } else {
      res.status(400).send('Store does not exist');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { storeName } = req.seller;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const categoryModel = await getDBModel(storeDB, 'category');

      await categoryModel.findByIdAndDelete(categoryId);

      res.status(200).send('category deleted successfully');
    } else {
      res.status(400).send('Store does not exist');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const switchDB = async (dbName, dbSchema) => {
    const mongoose = await connectDB();
    if (mongoose.connection.readyState === 1) {
      const db = mongoose.connection.useDb(dbName, { useCache: true });
      dbSchema.forEach((schema, modelName) => {
        if (!db.models[modelName]) {
          db.model(modelName, schema);
        }
      });
  
      return db;
    }
    throw new Error('Error connecting to the database');
  };
  

const getDBModel = async (db, modelName) => {
  return db.model(modelName);
};
