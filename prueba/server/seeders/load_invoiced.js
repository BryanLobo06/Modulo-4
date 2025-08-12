/*se encarga de cargar los invoiced a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


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
                    const sql = 'INSERT INTO invoiced VALUES ?';
                    const [result] = await pool.query(sql, [invoiced]);

                    console.log(`✅ Se insertaron ${result.affectedRows} invoiced.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar invoiced:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de invoiced:', err.message);
                reject(err);
            });
    });
}