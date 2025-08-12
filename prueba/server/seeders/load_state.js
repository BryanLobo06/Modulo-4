/*se encarga de cargar los state a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


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
                    const sql = 'INSERT INTO state VALUES ?';
                    const [result] = await pool.query(sql, [state]);

                    console.log(`✅ Se insertaron ${result.affectedRows} autores.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar state:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de state:', err.message);
                reject(err);
            });
    });
}