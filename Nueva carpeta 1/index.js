import cors from "cors"
import express from "express"
import { pool } from "./conexion_db.js"

const app = express()
app.use(cors()) // esto permite que la aplicacion backend pueda ser consumidentificaciona por una aplicacion frontend
app.use(express.json()) // permite que Express interprete automáticamente el body en JSON cuando recibes una petición POST o PUT.


app.get('/client', async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT 
            c.identificacion,
            c.fecha_client,
            p.fecha_devolucion,
            p.estado,
            u.nombre_completo AS usuario,
            l.isbn, 
            l.titulo AS libro
        FROM client c
        LEFT JOIN transaction u ON p.identificacion_usuario = u.identificacion_usuario
        LEFT JOIN invoiced l ON p.isbn = l.isbn
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/client/:identificacion', async (req, res) => {
    try {
        const { identificacion } = req.params

        const [rows] = await pool.query(`
        SELECT 
            p.identificacion_client,
            p.fecha_client,
            p.fecha_devolucion,
            p.estado,
            u.nombre_completo AS usuario,
            l.isbn, 
            l.titulo AS libro
        FROM client p
        LEFT JOIN transaction u ON p.identificacion_usuario = u.identificacion_usuario
        LEFT JOIN invoiced l ON p.isbn = l.isbn WHERE p.identificacion_client = ?
        `, [identificacion]);

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/client', async (req, res) => {
    try {
        const {
            identificacion_usuario,
            isbn,
            fecha_client,
            fecha_devolucion,
            estado
        } = req.body

        const query = `
        INSERT INTO client 
        (identificacion_usuario, isbn, fecha_client, fecha_devolucion, estado)
        VALUES (?, ?, ?, ?, ?)
        `
        const values = [
            identificacion_usuario,
            isbn,
            fecha_client,
            fecha_devolucion,
            estado
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            mensaje: "client creado exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.put('/client/:identificacion_client', async (req, res) => {
    try {
        const { identificacion_client } = req.params

        const {
            identificacion_usuario,
            isbn,
            fecha_client,
            fecha_devolucion,
            estado
        } = req.body

        const query = `
        UPDATE client SET 
            identificacion_usuario = ?,
            isbn = ?,
            fecha_client = ?,
            fecha_devolucion = ?,
            estado = ?
        WHERE identificacion_client = ?
        `
        const values = [
            identificacion_usuario,
            isbn,
            fecha_client,
            fecha_devolucion,
            estado,
            identificacion_client
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "client actualizado" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.delete('/client/:identificacion_client', async (req, res) => {
    try {
        const { identificacion_client } = req.params

        const query = `
        DELETE FROM client WHERE identificacion_client = ?
        `
        const values = [
            identificacion_client
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "client eliminado" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }




})

// 1. Ver todos los préstamos de un usuario
app.get('/client/usuario/:identificacion', async (req, res) => {
    try {
        const { identificacion } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.identificacion_client,
                p.fecha_client,
                p.fecha_devolucion,
                p.estado,
                l.isbn,
                l.titulo AS libro
            FROM client p
            LEFT JOIN invoiced l ON p.isbn = l.isbn
            WHERE p.identificacion_usuario = ?
        `, [identificacion]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 2. Listar los 5 invoiced más prestados
app.get('/invoiced/mas-invoiced', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.isbn,
                l.titulo,
                COUNT(p.identificacion_client) AS total_client
            FROM client p
            LEFT JOIN invoiced l ON p.isbn = l.isbn
            GROUP BY l.isbn, l.titulo
            ORDER BY total_client DESC
            LIMIT 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 3. Listar transaction con préstamos en estado "retrasado"
app.get('/transaction/con-retrasos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                u.identificacion_usuario,
                u.nombre_completo
            FROM client p
            LEFT JOIN transaction u ON p.identificacion_usuario = u.identificacion_usuario
            WHERE p.estado = 'retrasado'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 4. Listar préstamos activos
app.get('/client/activos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.identificacion_client,
                p.fecha_client,
                p.fecha_devolucion,
                p.estado,
                u.nombre_completo AS usuario,
                l.titulo AS libro
            FROM client p
            LEFT JOIN transaction u ON p.identificacion_usuario = u.identificacion_usuario
            LEFT JOIN invoiced l ON p.isbn = l.isbn
            WHERE p.estado = 'activo'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 5. Historial de un libro por su ISBN
app.get('/client/historial/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.identificacion_client,
                p.fecha_client,
                p.fecha_devolucion,
                p.estado,
                u.nombre_completo AS usuario
            FROM client p
            LEFT JOIN transaction u ON p.identificacion_usuario = u.identificacion_usuario
            WHERE p.isbn = ?
            ORDER BY p.fecha_client DESC
        `, [isbn]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

//Inicio del servidentificacionor cuando este todo listo
app.listen(3000, () => {
    console.log("servidentificacionor prepado correctamente en http://localhost:3000");
})