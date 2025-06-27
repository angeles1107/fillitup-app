const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const goalRoutes = require('./routes/goalRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

//rutas

app.use('/api/goals', goalRoutes);
app.use('/api/contributions', contributionRoutes);

const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Conectado a MongoDB');
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}).catch(err => console.error('Error de conexión:', err));


