const fs = require('fs').promises;
const path = './carts.json';

class CartManager {
  constructor() {
    this.path = path;
    this.carts = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, JSON.stringify([]));
      } else {
        console.error('Error reading the file', error);
      }
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async getCarts() {
    return this.carts;
  }

  async getCartById(id) {
    const cart = this.carts.find(cart => cart.id === id);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  async addCart() {
    const newCart = {
      id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1,
      products: []
    };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    const product = cart.products.find(p => p.id === productId);
    if (product) {
      product.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }
    await this.saveCarts();
  }

  async getProductsInCart(cartId) {
    const cart = await this.getCartById(cartId);
    return cart.products;
  }
}

module.exports = CartManager;
