const express = require('express');
const { promisify } = require('util');
const redis = require('redis');
const app = express();

const client = redis.createClient();

const getItemById = async (itemId) => {
  const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
  ];
  return listProducts.find(product => product.id === itemId);
};

const reserveStockById = async (itemId, stock) => {
  const setAsync = promisify(client.set).bind(client);
  await setAsync(`item.${itemId}`, stock.toString());
};

const getCurrentReservedStockById = async (itemId) => {
  const getAsync = promisify(client.get).bind(client);
  const reservedStock = await getAsync(`item.${itemId}`);
  return parseInt(reservedStock) || 0;
};

app.get('/list_products', (req, res) => {
  const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
  ];
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = await getItemById(itemId);
  if (!product) {
    res.json({ status: 'Product not found' });
    return;
  }
  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.stock - currentReservedStock;
  res.json({ ...product, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = await getItemById(itemId);
  if (!product) {
    res.json({ status: 'Product not found' });
    return;
  }
  const currentReservedStock = await getCurrentReservedStockById(itemId);
  if (currentReservedStock >= product.stock) {
    res.json({ status: 'Not enough stock available', itemId });
    return;
  }
  await reserveStockById(itemId, currentReservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(1245, () => {
  console.log('Server is listening on port 1245');
});
