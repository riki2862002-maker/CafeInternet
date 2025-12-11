// machines.js
// Maneja la lógica relacionada con las máquinas (PCs)

import { DataAPI } from "./data.js";

export const Machines = {

    // ----------------------------------
    // Obtener todas las máquinas (MySQL)
    // ----------------------------------
    async getAll() {
        try {
            const raw = await DataAPI.getMachines();

            // Aseguramos que todas tengan un formato estándar
            const machines = raw.map(m => ({
                id: Number(m.id),
                name: m.name || `PC ${m.id}`,
                status: m.status || "Disponible"
            }));

            // Ordenar por ID ascendente
            machines.sort((a, b) => a.id - b.id);

            return machines;

        } catch (err) {
            console.error("Machines.getAll:", err);
            return [];
        }
    },

    // -------------------------------
    // Verificar si una máquina está libre
    // -------------------------------
    isAvailable(machineId, activeSessions) {
        return !activeSessions.some(s => Number(s.machine_id) === Number(machineId));
    },

    // --------------------------------
    // Obtener una máquina por ID
    // --------------------------------
    getById(machineId, machines) {
        return machines.find(m => Number(m.id) === Number(machineId)) || null;
    }
};
