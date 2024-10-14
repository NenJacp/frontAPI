const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.post('/api/login', (req, res) => {
    // Implementa la lógica de login aquí
    res.json({ token: 'token_de_ejemplo' });
});

app.get('/api/orders', (req, res) => {
    // Implementa la lógica para obtener órdenes
    res.json([{ id: 1, details: 'Orden de ejemplo' }]);
});

app.post('/api/orders', (req, res) => {
    // Implementa la lógica para crear una orden
    res.json({ message: 'Orden creada exitosamente' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

