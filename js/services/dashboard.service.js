// ------------------------------------------------------------
// services/dashboard.service.js
// ------------------------------------------------------------

// Importamos el estado global para obtener máquinas y sesiones
import { getMaquinas, getSesiones } from "../state/estado.js";

// ------------------------------------------------------------
// Calcula métricas que se muestran en el dashboard
// ------------------------------------------------------------
export function calcularMetrics() {
    // Obtenemos todas las máquinas y sesiones desde el estado global
    const maquinas = getMaquinas();
    const sesiones = getSesiones();
    const hoy = new Date(); // Fecha actual para calcular ingresos/impresiones del día

    // Variables para almacenar métricas
    let sesionesActivas = 0;      // Cantidad de sesiones actualmente activas
    let ingresosTotales = 0;      // Ingresos acumulados del día
    let impresionesTotales = 0;   // Total de impresiones del día (B/N + color)

    // Iteramos sobre cada sesión para calcular métricas
    sesiones.forEach(s => {
        const inicio = new Date(s.fecha_inicio); // Fecha de inicio de la sesión
        const costo = Number(s.costo_total || 0); // Costo total de la sesión
        const copias_bn = Number(s.copias_bn || 0); // Copias en blanco y negro
        const copias_color = Number(s.copias_color || 0); // Copias a color

        // Si la sesión no tiene fecha de fin, está activa
        if (!s.fecha_fin) sesionesActivas++;

        // Verificamos si la sesión ocurrió hoy (para métricas diarias)
        const mismaFecha = inicio.getFullYear() === hoy.getFullYear() &&
                           inicio.getMonth() === hoy.getMonth() &&
                           inicio.getDate() === hoy.getDate();

        // Si es de hoy, sumamos a ingresos y total de impresiones
        if (mismaFecha) {
            ingresosTotales += costo;
            impresionesTotales += copias_bn + copias_color;
        }
    });

    // Retornamos un objeto con todas las métricas calculadas
    return {
        sesionesActivas,                          // Número de sesiones activas
        disponibles: maquinas.filter(m => !m.ocupada).length, // Máquinas libres
        totalMaquinas: maquinas.length,           // Total de máquinas
        ingresosTotales,                          // Total de ingresos del día
        impresionesTotales                        // Total de impresiones del día
    };
}
