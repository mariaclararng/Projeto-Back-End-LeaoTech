// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Doten v

const apiRoutes = require('./src/routes/apiRoutes');

const app = express();

// Integração
app.use(cors());
app.use(express.json());

// API para ligar 
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Servidor rodando perfeitamente!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ativo com carinho na porta ${PORT}`);
});