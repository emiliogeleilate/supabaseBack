const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Supabase client com URL correta
const supabase = supabaseClient.createClient(
    'https://icmwqndqmunysfgxehlo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbXdxbmRxbXVueXNmZ3hlaGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODY4MzUsImV4cCI6MjA2MzM2MjgzNX0.Eq_K8FJgQd29FCOsMP-7HspqKrKfSi5I6eAoLTn_CIc'
);

// Lista todos os produtos
app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select();

    if (error) return res.status(500).send(error);
    console.log(`Lista de produtos:`, data);
    res.send(data);
});

// Lista produto por ID
app.get('/products/:id', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id);

    if (error) return res.status(500).send(error);
    console.log("Produto retornado:", data);
    res.send(data);
});

// Cria um novo produto
app.post('/products', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });

    if (error) return res.status(500).send(error);

    console.log("Produto criado:", req.body);
    res.send("Produto criado com sucesso!");
});

// Atualiza um produto
app.put('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id);

    if (error) return res.status(500).send(error);

    res.send("Produto atualizado com sucesso!");
});

// Deleta um produto
app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).send(error);

    console.log("Produto deletado:", req.params.id);
    res.send("Produto deletado com sucesso!");
});

// Rota raiz
app.get('/', (req, res) => {
    res.send("Hello, Supabase está funcionando! <3");
});

// Rota coringa corrigida (para evitar o erro do path-to-regexp)
app.use((req, res) => {
    res.status(404).send("Rota não encontrada, mas Supabase está de pé! <3");
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('> Servidor rodando em http://localhost:3000');
});
