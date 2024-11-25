const express = require('express');
const app = express();
const port = 3000;

// Middleware para análise de corpo de solicitação JSON
app.use(express.json());

// Array para armazenar os usuários (simulando um banco de dados em memória)
let users = ["Luiz","Carlos"];

let comida = ["abacaxi"]



app.get('/comida', (req,res)=>{
  res.json(comida)
})


// Rota para obter todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para adicionar um novo usuário
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.json(newUser);
});

// Rota para atualizar um usuário existente
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// Rota para deletar um usuário
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: 'Usuário deletado com sucesso', id: userId });
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
