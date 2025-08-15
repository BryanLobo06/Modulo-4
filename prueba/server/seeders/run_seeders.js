import { cargarclientAlaBaseDeDatos } from "./load_client.js";
import { cargarinvoicedAlaBaseDeDatos} from "./load_invoiced.js";
import { cargartransactionAlaBaseDeDatos } from "./load_transaction.js";
import { cargarstateAlaBaseDeDatos } from "./load_state.js";

(async () => {
    try {
        console.log('🚀 Iniciando seeders...');

        await cargartransactionAlaBaseDeDatos()
        await cargarclientAlaBaseDeDatos()
        await cargarinvoicedAlaBaseDeDatos()
        await cargarstateAlaBaseDeDatos()

        console.log('Todos los seeders ejecutados correctamente.');
    } catch (error) {
        console.error('Error ejecutando los seeders:', error.message);
    } finally {
        process.exit();
    }
})()