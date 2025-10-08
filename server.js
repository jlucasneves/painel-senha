const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let senhaAtual = 0;
let historico = [];
let senhaInicial = 0;

app.use(express.static('public'));
app.use(express.json());

app.post('/setInicio', (req, res) => {
  const { inicio } = req.body;
  senhaInicial = parseInt(inicio, 10);
  senhaAtual = senhaInicial;
  historico = [];
  io.emit('atualizarSenha', senhaAtual);
  res.sendStatus(200);
});

app.get('/novaSenha', (req, res) => {
  senhaAtual++;
  historico.push(senhaAtual);
  io.emit('atualizarSenha', senhaAtual);
  io.emit('tocarSom');
  res.json({ senha: senhaAtual });
});

app.get('/voltarSenha', (req, res) => {
  if (historico.length > 1) {
    historico.pop();
    senhaAtual = historico[historico.length - 1];
    io.emit('atualizarSenha', senhaAtual);
  }
  res.json({ senha: senhaAtual });
});

app.get('/repetirSenha', (req, res) => {
  io.emit('repetirSenha', senhaAtual);
  res.json({ senha: senhaAtual });
});


io.on('connection', (socket) => {
  socket.emit('atualizarSenha', senhaAtual);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
