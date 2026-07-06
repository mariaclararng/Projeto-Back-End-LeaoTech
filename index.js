// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // REQUISITO: Dotenv

const apiRoutes = require('./src/routes/apiRoutes');

const app = express();

// Permite a integração com o front-end do time
app.use(cors());
app.use(express.json());

// Liga todas as nossas rotas criadas com o prefixo /api (ex: /api/login)
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Servidor da Drip Store rodando perfeitamente, MC!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ativo com carinho na porta ${PORT}`);
});