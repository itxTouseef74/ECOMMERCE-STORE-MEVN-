const sellerSchema = require('../models/seller.js');
const productSchema = require('../models/products.js');
const connectDB = require('../db/connection.js');
const jwt = require('jsonwebtoken');
const StoreSchema = new Map([['product', productSchema]]);
const SellerSchema = new Map([['Seller', sellerSchema]]);

exports.getProducts = async (req, res) => {
  try {
    const { storeName } = req.seller;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, 'product');

      const products = await productModel.find().populate('category', 'cat_name');

      res.status(200).json(products);
    } else {
      res.status(400).send('Store does not exist');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity, cat_name } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken || !decodedToken.storeName) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    const storeName = decodedToken.storeName;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!price) missingFields.push('price');
    if (!quantity) missingFields.push('quantity');
    if (!cat_name) missingFields.push('cat_name');

    if (missingFields.length > 0) {
      const errorMessage = `Incomplete product information. Missing fields: ${missingFields.join(', ')}`;
      return res.status(400).json({ error: errorMessage });
    }

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, 'product');
      const categoryModel = await getDBModel(storeDB, 'category');

      const category = await categoryModel.findOne({ cat_name: req.body.cat_name });


      if (category) {
        await productModel.create({ name, price, quantity, category: category._id, storeName });
        res.status(201).json({ message: 'Product created successfully' });
      } else {
        res.status(400).json({ error: 'Category does not exist' });
      }
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

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { storeName } = req.seller;
    const { name, price, quantity, cat_name } = req.body;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, 'product');
      const categoryModel = await getDBModel(storeDB, 'category');

      const existingProduct = await productModel.findById(productId);

      if (existingProduct) {
        
        if (name) existingProduct.name = name;
        if (price) existingProduct.price = price;
        if (quantity) existingProduct.quantity = quantity;
        
        if (cat_name) {
          const category = await categoryModel.findOne({ cat_name });
          if (category) {
            existingProduct.category = category._id;
          } else {
            return res.status(400).json({ error: 'Category does not exist' });
          }
        }

        await existingProduct.save();
        res.status(200).json({ message: 'Product updated successfully' });
      } else {
        res.status(400).json({ error: 'Product does not exist' });
      }
    } else {
      res.status(400).json({ error: 'Store does not exist' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { storeName } = req.seller;

    const sellerDB = await switchDB('SellerApp', SellerSchema);
    const sellerModel = await getDBModel(sellerDB, 'Seller');
    const existingSeller = await sellerModel.findOne({ storeName });

    if (existingSeller) {
      const storeDB = await switchDB(storeName, StoreSchema);
      const productModel = await getDBModel(storeDB, 'product');

      await productModel.findByIdAndDelete(productId);

      res.status(200).send('Product deleted successfully');
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
