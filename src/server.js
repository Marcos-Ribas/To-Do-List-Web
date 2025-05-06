// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1) Conexão com o MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/meuBanco', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})  
    .then(async () => {
        console.log('Conectado ao MongoDB, limpando o banco…');
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Banco de dados “meuBanco” foi apagado.');

    })

    .then(() => {
        // === TESTE: CRIAÇÃO DE UM NOVO USER ===
        const novoUser = new User({
        nome: 'Ana Teste',
        email: 'ana@teste.com',
        idade: 28
        });

        return novoUser.save();
    })

    .then(u => console.log('Usuário criado:', u))
    .catch(err => console.error('❌ Erro:', err))

// 2) Servir arquivos estáticos (HTML/CSS/JS) da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// 3) Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/usuarios', async (req, res) => {
    try {
      const todos = await User.find();            // traz todos os users
      res.json(todos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });

app.post('/usuarios', async (req, res) => {
try {
    const u = await User.create(req.body);
    return res.status(201).json(u);
} catch (err) {
    return res.status(400).json({ erro: err.message });
}
});

// 4) Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
