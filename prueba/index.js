import cors from "cors"
import express from "express"
import { pool } from "./server/conexiondb.js"

const app = express()
app.use(cors())
app.use(express.json())



// GET all clients
app.get('/clients', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM client
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

// GET client by identificacion
app.get('/clients/:identificacion', async (req, res) => {
    try {
        const { identificacion } = req.params;
        const [rows] = await pool.query(`
            SELECT * FROM client WHERE identificacion = ?
        `, [identificacion]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
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

// POST create new client
app.post('/clients', async (req, res) => {
    try {
        const {name_client, identificacion, address, phone, email} = req.body;

        const query = `
            INSERT INTO client (name_client, identificacion, address, phone, email)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [name_client, identificacion, address, phone, email];

        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "Cliente creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// PUT update client
app.put('/clients/:identificacion', async (req, res) => {
    try {
        const { identificacion } = req.params;
        const { name_client, address, phone, email } = req.body;

        const query = `
            UPDATE client SET 
                name_client = ?,
                address = ?,
                phone = ?,
                email = ?
            WHERE identificacion = ?
        `;
        const values = [name_client, address, phone, email, identificacion];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json({ message: "Cliente actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// DELETE client
app.delete('/clients/:identificacion', async (req, res) => {
    try {
        const { identificacion } = req.params;

        const query = `DELETE FROM client WHERE identificacion = ?`;
        const [result] = await pool.query(query, [identificacion]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});


// GET all transactions
app.get('/transactions', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM transaction
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

// GET transaction by id
app.get('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT * FROM transaction WHERE id_transaction = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
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

// POST create new transaction
app.post('/transactions', async (req, res) => {
    try {
        const { id_transaction, date_and_time, amount, transaction_type } = req.body;

        const query = `
            INSERT INTO transaction (id_transaction, date_and_time, amount, transaction_type)
            VALUES (?, ?, ?, ?)
        `;
        const values = [id_transaction, date_and_time, amount, transaction_type];

        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "Transacción creada exitosamente",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// PUT update transaction
app.put('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date_and_time, amount, transaction_type } = req.body;

        const query = `
            UPDATE transaction SET 
                date_and_time = ?,
                amount = ?,
                transaction_type = ?
            WHERE id_transaction = ?
        `;
        const values = [date_and_time, amount, transaction_type, id];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        res.json({ message: "Transacción actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// DELETE transaction
app.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `DELETE FROM transaction WHERE id_transaction = ?`;
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        res.json({ message: "Transacción eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});


// GET all invoices
app.get('/invoices', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM invoiced
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

// GET invoice by number
app.get('/invoices/:invoice_number', async (req, res) => {
    try {
        const { invoice_number } = req.params;
        const [rows] = await pool.query(`
            SELECT * FROM invoiced WHERE invoice_numbe = ?
        `, [invoice_number]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }
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

// POST create new invoice
app.post('/invoices', async (req, res) => {
    try {
        const { invoice_numbe, platform, billing_period, invoiced_amount, amount_paid, identificacion } = req.body;

        const query = `
            INSERT INTO invoiced (invoice_numbe, platform, billing_period, invoiced_amount, amount_paid, identificacion)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [invoice_numbe, platform, billing_period, invoiced_amount, amount_paid, identificacion];

        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "Factura creada exitosamente",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// PUT update invoice
app.put('/invoices/:invoice_number', async (req, res) => {
    try {
        const { invoice_number } = req.params;
        const { platform, billing_period, invoiced_amount, amount_paid, identificacion } = req.body;

        const query = `
            UPDATE invoiced SET 
                platform = ?,
                billing_period = ?,
                invoiced_amount = ?,
                amount_paid = ?,
                identificacion = ?
            WHERE invoice_numbe = ?
        `;
        const values = [platform, billing_period, invoiced_amount, amount_paid, identificacion, invoice_number];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }
        res.json({ message: "Factura actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// DELETE invoice
app.delete('/invoices/:invoice_number', async (req, res) => {
    try {
        const { invoice_number } = req.params;

        const query = `DELETE FROM invoiced WHERE invoice_numbe = ?`;
        const [result] = await pool.query(query, [invoice_number]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }
        res.json({ message: "Factura eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});


// GET all states
app.get('/states', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM state
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

// GET state by id
app.get('/states/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT * FROM state WHERE id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
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

// POST create new state
app.post('/states', async (req, res) => {
    try {
        const { transaction_status } = req.body;

        const query = `
            INSERT INTO state (transaction_status)
            VALUES (?)
        `;
        const values = [transaction_status];

        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "Estado creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// PUT update state
app.put('/states/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { transaction_status } = req.body;

        const query = `
            UPDATE state SET 
                transaction_status = ?
            WHERE id = ?
        `;
        const values = [transaction_status, id];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
        res.json({ message: "Estado actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// DELETE state
app.delete('/states/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `DELETE FROM state WHERE id = ?`;
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estado no encontrado" });
        }
        res.json({ message: "Estado eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});


// GET invoices by client identificacion
app.get('/clients/:identificacion/invoices', async (req, res) => {
    try {
        const { identificacion } = req.params;
        const [rows] = await pool.query(`
            SELECT i.*, c.name_client 
            FROM invoiced i
            JOIN client c ON i.identificacion = c.identificacion
            WHERE i.identificacion = ?
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

// GET unpaid invoices
app.get('/invoices/unpaid', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT i.*, c.name_client 
            FROM invoiced i
            JOIN client c ON i.identificacion = c.identificacion
            WHERE i.amount_paid < i.invoiced_amount
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

// GET transactions by type
app.get('/transactions/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const [rows] = await pool.query(`
            SELECT * FROM transaction WHERE transaction_type = ?
        `, [type]);

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

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado correctamente en http://localhost:${PORT}`);
});