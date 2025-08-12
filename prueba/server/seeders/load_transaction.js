/*se encarga de cargar los transaction a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


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
                    const sql = 'INSERT INTO transaction VALUES ?';
                    const [result] = await pool.query(sql, [transaction]);

                    console.log(`✅ Se insertaron ${result.affectedRows} autores.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar transaction:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de transaction:', err.message);
                reject(err);
            });
    });
}