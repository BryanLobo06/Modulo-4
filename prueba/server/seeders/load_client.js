import fs from 'fs'; 
import path from 'path'; 
import csv from 'csv-parser';
import { pool } from "../conexiondb.js"


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
                    const sql = 'INSERT INTO client (name_client, identificacion, address, phone, email) VALUES ?';
                    const [result] = await pool.query(sql, [client]);

                    console.log(`Se insertaron ${result.affectedRows} clientes.`);
                    resolve(); 
                } catch (error) {
                    console.error('Error al insertar clientes:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error al leer el archivo CSV de clientes:', err.message);
                reject(err);
            });
    });
}