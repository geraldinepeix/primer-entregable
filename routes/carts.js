const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager();

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const products = await cartManager.getProductsInCart(parseInt(req.params.cid, 10));
    res.json(products);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const productId = parseInt(req.params.pid, 10);
  const quantity = 1; // Asumiendo que siempre se agrega uno en uno

  try {
    await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(200).send('Product added to cart');
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
