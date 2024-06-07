const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware para analisar JSON no corpo da requisição

let products = []; // Lista temporária para armazenar os produtos

// Middleware para registrar informações de cada chamada
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // Chama o próximo middleware ou rota
});


// Rota POST para adicionar um novo produto
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;

    // Validação simples dos dados recebidos
    if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || !description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Dados invalidos' });
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // Gera um ID incremental
        name,
        price,
        description
    };

    products.push(newProduct); // Adiciona o novo produto à lista
    console.log('Produto adicionado:', newProduct);
    res.status(201).json(newProduct); // Retorna o produto criado com status 201 (Created)
});

// Rota GET para obter todos os produtos
app.get('/products', (req, res) => {
    res.json(products); // Retorna a lista de produtos em formato JSON
});

// Rota GET para obter um produto pelo ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Obtém o ID do produto da URL

    console.log('Buscando produto com ID:', productId);

    // Procura o produto na lista pelo ID
    const product = products.find(p => p.id === productId);

    if (product) {
        console.log('Produto encontrado:', product);
        res.status(200).json(product); // Retorna o produto encontrado com status 200 (OK)
    } else {
        console.log('Produto não encontrado com ID:', productId);
        res.status(404).json({ message: 'Produto não encontrado' }); // Retorna status 404 se o produto não for encontrado
    }
});

// Rota PUT para atualizar um produto existente
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Obtém o ID do produto da URL
    const updatedData = req.body; // Novos dados do produto no corpo da requisição

    console.log('Atualizando produto com ID:', productId, 'com dados:', updatedData);

    // Procura o produto na lista pelo ID
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData }; // Atualiza os dados do produto
        console.log('Produto atualizado:', products[index]);
        res.status(200).json(products[index]); // Retorna os dados atualizados do produto com status 200 (OK)
    } else {
        console.log('Produto não encontrado com ID:', productId);
        res.status(404).json({ message: 'Produto não encontrado' }); // Retorna status 404 se o produto não for encontrado
    }
});

// Rota DELETE para excluir um produto existente
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Obtém o ID do produto da URL

    console.log('Deletando produto com ID:', productId);

    // Procura o produto na lista pelo ID
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
        products.splice(index, 1);
        console.log('Produto deletado com ID:', productId);
        res.status(200).json({ message: 'Produto deletado com sucesso' }); // Retorna mensagem de sucesso com status 200 (OK)
    } else {
        console.log('Produto não encontrado com ID:', productId);
        res.status(404).json({ message: 'Produto não encontrado' }); // Retorna status 404 se o produto não for encontrado
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
z 