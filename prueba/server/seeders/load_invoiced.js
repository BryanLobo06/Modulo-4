import fs from 'fs'; 
import path from 'path'; 
import csv from 'csv-parser';
import { pool } from "../conexiondb.js"

export async function cargarinvoicedAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/invoiced.csv');
    const invoiced = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                invoiced.push([
                    fila.invoice_numbe,
                    fila.platform,
                    fila.billing_period,
                    fila.invoiced_amount,
                    fila.amount_paid,
                    fila.identificacion
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO invoiced (invoice_numbe, platform, billing_period, invoiced_amount, amount_paid, identificacion) VALUES ?';
                    const [result] = await pool.query(sql, [invoiced]);

                    console.log(`Se insertaron ${result.affectedRows} facturas.`);
                    resolve(); 
                } catch (error) {
                    console.error('Error al insertar facturas:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error al leer el archivo CSV de facturas:', err.message);
                reject(err);
            });
    });
}