/*se encarga de cargar los client a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


export async function cargarclientAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/client.csv');
    const client = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                client.push([
                    fila.name_client,
                    fila.identificación.trim(),
                    fila.address.trim(),
                    fila.phone,
                    fila.email
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO client VALUES ?';
                    const [result] = await pool.query(sql, [client]);

                    console.log(`✅ Se insertaron ${result.affectedRows} client.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar client:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de client:', err.message);
                reject(err);
            });
    });
}