const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(parseInt(req.params.pid, 10));
    res.json(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;
  try {
    const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/:pid', async (req, res) => {
  const updates = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid, 10), updates);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(parseInt(req.params.pid, 10));
    res.status(200).send('Product deleted');
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
