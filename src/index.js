// REQUERIMOS EXPRESS
const express = require('express');
// REQUERIMOS AXIOS
const axios = require('axios');
// REQUERIMOS RESPONSE TIME
const responseTime = require('response-time');
// REQUERIMOS CREATECLIENT PARA CREAR CONEXION
const { createClient } = require('@redis/client');
// CONSTANTE QUE REPRESENTA createClient
const client = createClient();
// MANEJADOR DE EVENTO ERROR
client.on('error', (err) => console.log('REDIS CLIENT ERROR', err));
// CONECTARNOS CON EL SERVIDOR
client.connect();
// EJECUTAR EXPRESS A TRAVES DE UNA CONSTANTE
const app = express();
// EJECUTAR RESPONSE TIME
app.use(responseTime());
// RUTA OBTENER PERSONAJES
app.get('/character', async (req, res) => {
  try {
    // OBTENER DATOS DE REDIS
    const value = await client.get('characters');
    // EVALUAMOS SI EXISTE ALGO EN VALUE?
    if (value) {
      return res.json(JSON.parse(value));
    }
    // PETICION A API
    const response = await axios.get(
      'https://rickandmortyapi.com/api/character'
    );
    // GUARDAMOS LA PETICION EN REDIS / CONVERTIMOS EL OBJETO RESPUESTA EN STRING
    await client.set('characters', JSON.stringify(response.data));
    // RESPUESTA EN FORMATO JSON
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR INTERNO DEL SERVIDOR');
  }
});
// PUERTO
const PORT = 3001;
// PUERTO DE EJECUCION
app.listen(PORT, () => {
  console.log(`Ejecutandonse en el puerto http://localhost:${PORT}`);
});
