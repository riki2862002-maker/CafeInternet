// data.js
// Capa de comunicación con el backend (PHP + MySQL)

export const DataAPI = {

    // --------------------------
    // Obtener lista de máquinas
    // --------------------------
    async getMachines() {
        try {
            const res = await fetch("./backend/get_machines.php");
            if (!res.ok) throw new Error("Error al obtener máquinas");
            return await res.json();
        } catch (err) {
            console.error("DataAPI.getMachines:", err);
            return [];
        }
    },

    // -----------------------------------------
    // Obtener sesiones activas + historial
    // -----------------------------------------
    async getSessions() {
        try {
            const res = await fetch("./backend/get_sessions.php");
            if (!res.ok) throw new Error("Error al obtener sesiones");

            const data = await res.json();

            return {
                active: data.active || [],
                history: data.history || []
            };

        } catch (err) {
            console.error("DataAPI.getSessions:", err);
            return { active: [], history: [] };
        }
    },

    // --------------------------
    // Iniciar sesión
    // --------------------------
    async startSession(sessionData) {
        try {
            const res = await fetch("./backend/start_session.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sessionData)
            });

            const result = await res.json();
            return result.success === true;

        } catch (err) {
            console.error("DataAPI.startSession:", err);
            return false;
        }
    },

    // --------------------------
    // Finalizar sesión
    // --------------------------
    async endSession(sessionData) {
        try {
            const res = await fetch("./backend/end_session.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sessionData)
            });

            const result = await res.json();
            return result.success === true;

        } catch (err) {
            console.error("DataAPI.endSession:", err);
            return false;
        }
    }
};
