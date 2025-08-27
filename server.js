require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener el token de impersonation
app.get('/api/get-impersonation-token', async (req, res) => {
    // Lee las variables de entorno para las credenciales
    const QLIK_HOST = process.env.QLIK_HOST || 'https://keyruspt.eu.qlikcloud.com';
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    // Usuario que se va a impersonar
    const userId = 'cavida.pt/ivida.hugo.santos';

    const payload = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'urn:qlik:oauth:user-impersonation',
        user_lookup: {
            field: 'subject',
            value: userId,
        },
        scope: 'user_default',
    };

    try {
        const response = await fetch(`${QLIK_HOST}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de la API de Qlik: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener el token:', error);
        res.status(500).send('Error al generar el token de impersonation.');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});