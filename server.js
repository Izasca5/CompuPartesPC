const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

// Esta es la ruta por defecto de tu MongoDB local
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// OJO: Si en MongoDB Compass llamaste a tu base de datos de otra forma, cámbialo aquí
const dbName = 'tienda_pc';

// Creamos la ruta por donde tu web pedirá los componentes
app.get('/api/componentes', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Asumimos que la colección donde importaste el CSV se llama 'componentes'
        const coleccion = db.collection('componentes');

        // Saca todos los componentes de la BD
        const productos = await coleccion.find({}).toArray();
        res.json(productos); // Se los enviamos a tu web en formato JSON

    } catch (error) {
        console.error("Error al conectar:", error);
        res.status(500).json({ error: 'Fallo al conectar con la base de datos' });
    }
});

// Arrancamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('✅ Servidor de CompuPartes funcionando en http://localhost:3000');
});