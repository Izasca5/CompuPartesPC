const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const https = require('https');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'tienda_pc';

// URL de Ollama (desde variable de entorno o localhost para desarrollo local)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// ── GET /api/componentes ─────────────────────────────────────────────────────
app.get('/api/componentes', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const coleccion = db.collection('componentes');
        const productos = await coleccion.find({}).toArray();
        res.json(productos);
    } catch (error) {
        console.error("Error al conectar:", error);
        res.status(500).json({ error: 'Fallo al conectar con la base de datos' });
    }
});

// ── POST /api/analizar-build ─────────────────────────────────────────────────
app.post('/api/analizar-build', async (req, res) => {
    const { caja, placaBase, procesador, ram, grafica, fuente, almacenamiento } = req.body;

    if (!caja || !placaBase || !procesador || !ram || !grafica || !fuente || !almacenamiento) {
        return res.status(400).json({ error: 'Faltan componentes. Se necesitan los 7.' });
    }

    const precioTotal = [caja, placaBase, procesador, ram, grafica, fuente, almacenamiento]
        .reduce((sum, c) => sum + (c.precio || 0), 0);

    const prompt = `Eres un experto en hardware de PC y ensamblaje de ordenadores. Analiza la siguiente configuracion de PC y proporciona una evaluacion detallada en espanol.

## Configuracion del PC a analizar:

- Caja: ${caja.nombre} (${caja.formato}, ${caja.material}) -- ${caja.precio}EUR
- Placa Base: ${placaBase.nombre} (${placaBase.chipset}, ${placaBase.formato}) -- ${placaBase.precio}EUR
- Procesador: ${procesador.nombre} (TDP: ${procesador.tdp}, Socket: ${procesador.socket}) -- ${procesador.precio}EUR
- RAM: ${ram.nombre} (${ram.velocidad}) -- ${ram.precio}EUR
- Tarjeta Grafica: ${grafica.nombre} (VRAM: ${grafica.vram}, Consumo: ${grafica.potencia}) -- ${grafica.precio}EUR
- Fuente de Alimentacion: ${fuente.nombre} (${fuente.potencia}, ${fuente.eficiencia}) -- ${fuente.precio}EUR
- Almacenamiento: ${almacenamiento.nombre} (${almacenamiento.velocidad}, ${almacenamiento.interfaz}) -- ${almacenamiento.precio}EUR

Precio total del build: ${precioTotal}EUR

Tu analisis debe incluir las siguientes secciones con exactamente estos titulos (incluyendo los emojis):

### RESUMEN DEL BUILD
Describe brevemente el tipo de build (gaming, workstation, ofimatica, etc.) y el nivel de rendimiento esperado en 3-4 frases.

### CUELLO DE BOTELLA
Identifica cual componente limita mas el rendimiento del sistema y por que. Calcula un porcentaje estimado de cuello de botella entre CPU y GPU si es relevante.

### COMPATIBILIDAD
Analiza si todos los componentes son compatibles entre si: socket CPU-placa base, tipo de RAM, potencia de la fuente vs consumo total, espacio en la caja.

### ASPECTOS A MEJORAR
Lista 3-5 recomendaciones concretas para mejorar el build, indicando alternativas especificas con precio aproximado.

### RELACION CALIDAD/PRECIO
Evalua si el precio del build esta justificado. Indica que componentes ofrecen la mejor y peor relacion calidad/precio.

Responde SOLO con las 5 secciones. Sin introduccion previa. En espanol.`;

    console.log(`Enviando prompt a Ollama (${OLLAMA_URL})...`);

    try {
        const ollamaPayload = JSON.stringify({
            model: 'qwen2.5:1.5b', // <--- CAMBIA ESTO A 1.5b
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                num_predict: 1500,
            }
        });

        const ollamaRes = await fetchJSON(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: ollamaPayload,
            timeoutMs: 600000,
        });

        const analysis = ollamaRes.response || 'No se pudo obtener respuesta del modelo.';
        console.log('Analisis completado. Duracion:', Math.round((ollamaRes.total_duration || 0) / 1e6), 'ms');

        res.json({
            success: true,
            analysis,
            model: ollamaRes.model || 'qwen2.5:1.5b', // <--- CAMBIA ESTO TAMBIÉN
            duracion_ms: Math.round((ollamaRes.total_duration || 0) / 1e6),
        });

    } catch (err) {
        console.error('Error al llamar a Ollama:', err.message);
        res.status(500).json({
            error: 'No se pudo conectar con el modelo de IA. Asegurate de que Ollama esta en ejecucion.',
            detalle: err.message
        });
    }
});

// ── Helper: fetch con http/https nativo (sin dependencias extra) ─────────────
function fetchJSON(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const lib = parsedUrl.protocol === 'https:' ? https : http;
        const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = lib.request(reqOptions, (httpRes) => {
            let data = '';
            httpRes.on('data', chunk => { data += chunk; });
            httpRes.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON invalido recibido de Ollama: ${data.slice(0, 300)}`)); }
            });
        });

        if (options.timeoutMs) {
            req.setTimeout(options.timeoutMs, () => {
                req.destroy();
                reject(new Error(`Timeout: Ollama tardo mas de ${options.timeoutMs / 1000}s en responder`));
            });
        }

        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

// ── Arrancar servidor ────────────────────────────────────────────────────────
app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor de CompuPartes funcionando en http://0.0.0.0:3000');
    console.log('Ollama configurado en:', OLLAMA_URL);
});