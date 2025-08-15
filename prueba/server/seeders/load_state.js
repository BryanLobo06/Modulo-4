import fs from 'fs'; 
import path from 'path'; 
import csv from 'csv-parser';
import { pool } from "../conexiondb.js"


export async function cargarstateAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/state.csv');
    const state = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                state.push([
                    fila.transaction_status,
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO state (transaction_status) VALUES ?';
                    const [result] = await pool.query(sql, [state]);

                    console.log(`Se insertaron ${result.affectedRows} estados.`);
                    resolve(); 
                } catch (error) {
                    console.error('Error al insertar estados:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error al leer el archivo CSV de estados:', err.message);
                reject(err);
            });
    });
}