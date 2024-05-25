const fs = require('fs').promises;
const path = './products.json';

class ProductManager {
  constructor() {
    this.path = path;
    this.products = [];
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, JSON.stringify([]));
      } else {
        console.error('Error reading the file', error);
      }
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async getProducts() {
    return this.products;
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const existingProduct = this.products.find(product => product.code === code);
    if (existingProduct) {
      throw new Error('Product with this code already exists');
    }
    const newProduct = {
      id: this.products.length ? this.products[this.products.length - 1].id + 1 : 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(id, updates) {
    const product = await this.getProductById(id);
    Object.assign(product, updates);
    await this.saveProducts();
    return product;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    this.products.splice(index, 1);
    await this.saveProducts();
  }
}

module.exports = ProductManager;
