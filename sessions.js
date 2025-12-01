// sessions.js
// Maneja la lógica de sesiones e interactúa con DataAPI (backend)

import { DataAPI } from "./data.js";

export const Sessions = {

    // --------------------------------------
    // Obtener TODAS las sesiones desde MySQL
    // --------------------------------------
    async getAll() {
        const data = await DataAPI.getSessions();

        // Ordenar sesiones activas por hora ascendente
        data.active.sort((a, b) => Number(a.inicio) - Number(b.inicio));

        // Ordenar historial por fecha descendente
        data.history.sort((a, b) => Number(b.fin) - Number(a.fin));

        return data;
    },

    // --------------------------------------
    // Calcular minutos transcurridos
    // --------------------------------------
    calculateMinutes(startTimestamp) {
        const now = Date.now();
        const diff = now - Number(startTimestamp);
        return Math.floor(diff / 60000); // minutos exactos
    },

    // --------------------------------------
    // Iniciar una nueva sesión
    // --------------------------------------
    async start({ cliente, machine_id, inicio }) {
        if (!cliente || !machine_id || !inicio) return false;

        const session = {
            cliente,
            machine_id,
            inicio: Number(inicio)
        };

        return await DataAPI.startSession(session);
    },

    // --------------------------------------
    // Finalizar sesión existente
    // --------------------------------------
    async end({ id, fin, prints_bw, prints_color, total }) {
        if (!id || !fin) return false;

        const session = {
            id,
            fin: Number(fin),
            prints_bw: Number(prints_bw),
            prints_color: Number(prints_color),
            total: Number(total)
        };

        return await DataAPI.endSession(session);
    }
};
