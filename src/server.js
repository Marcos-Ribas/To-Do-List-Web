// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const Task = require('./models/task');

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

        const tasks = require(path.join(__dirname,'..' ,'dataTest', 'tasks.json'));
        return Task.insertMany(tasks);
    })

    .then(u => console.log('Task Carregadas:', u))

    .catch(err => console.error('❌ Erro:', err))

// 2) Servir arquivos estáticos (HTML/CSS/JS) da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// 3) Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/tasks', async (req, res) => {
    try {
      const nova = await Task.create(req.body);
      res.status(201).json(nova);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  });

app.get('/tasks', async (req, res) => {
    try {
      const todos = await Task.find();            // traz todos os users
      res.json(todos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ erro: 'Não encontrado' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
    try {
    const updated = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).send('Não encontrado');
    res.json(updated);
    } catch (err) {
    res.status(400).json({ erro: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const removed = await Task.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).send('Não encontrado');
    res.status(204).end();  // sucesso mas sem conteúdo
  });



// 4) Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
