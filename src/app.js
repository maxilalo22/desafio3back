const express = require('express');
const fs = require('fs').promises;

class ProductManager {
    async getProducts(limit) {
        try {
            const data = await fs.readFile('products.json', 'utf-8');
            const products = JSON.parse(data);

            if (limit) {
                return products.slice(0, limit);
            } else {
                return products;
            }
        } catch (error) {
            throw new Error('Error al leer archivos de productos');
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile('products.json', 'utf-8');
            const products = JSON.parse(data);
            const product = products.find((p) => p.id === parseInt(id));

            if (product) {
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error('Error al leer archivos de productos');
        }
    }
    
}
const app = express();
const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.listen(8080, () => {
    console.log('Server listening on port 8080');
});
