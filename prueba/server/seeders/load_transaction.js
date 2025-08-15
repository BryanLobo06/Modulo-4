import fs from 'fs'; 
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexiondb.js"


export async function cargartransactionAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/transaction.csv');
    const transaction = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                transaction.push([
                    fila.id_transaction,
                    fila.date_and_time,
                    fila.amount,
                    fila.transaction_type,
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO transaction (id_transaction, date_and_time, amount, transaction_type) VALUES ?';
                    const [result] = await pool.query(sql, [transaction]);

                    console.log(`Se insertaron ${result.affectedRows} transacciones.`);
                    resolve(); 
                } catch (error) {
                    console.error('Error al insertar transacciones:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error al leer el archivo CSV de transacciones:', err.message);
                reject(err);
            });
    });
}