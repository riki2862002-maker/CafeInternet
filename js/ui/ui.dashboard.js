// Importa la función para calcular métricas del dashboard
import { calcularMetrics } from "../services/dashboard.service.js";
// Importa las sesiones desde el estado global
import { getSesiones } from "../state/estado.js";

// ------------------------------------------------------------
// Función para renderizar el dashboard completo
// ------------------------------------------------------------
export function renderDashboard() {
    // Calcula métricas como sesiones activas, máquinas disponibles, ingresos y copias
    const metrics = calcularMetrics();

    // Obtiene referencias a los elementos del DOM donde se mostrarán las métricas
    const activeCount = document.getElementById("active-sessions");
    const available = document.getElementById("available-machines");
    const dailyIncome = document.getElementById("daily-income");
    const todayPrints = document.getElementById("today-prints");

    // Si algunos elementos clave no existen, termina la función
    if (!activeCount || !available) return;

    // Actualiza los valores en el DOM
    activeCount.textContent = metrics.sesionesActivas;
    available.textContent = `${metrics.disponibles}/${metrics.totalMaquinas}`;
    if (dailyIncome) dailyIncome.textContent = `$${metrics.ingresosTotales.toFixed(2)}`;
    if (todayPrints) todayPrints.textContent = metrics.impresionesTotales;

    // ----------------------------
    // Render de sesiones activas en tabla
    // ----------------------------
    const dashboardCont = document.getElementById("active-sessions-table");
    if (!dashboardCont) return;

    // Limpia la tabla antes de volver a dibujarla
    dashboardCont.innerHTML = "";

    const sesiones = getSesiones();

    sesiones.forEach(s => {
        if (!s.fecha_fin) { // Solo sesiones activas (sin fecha_fin)
            const inicio = new Date(s.fecha_inicio);

            // Calcula minutos transcurridos desde el inicio de la sesión
            const minutosTranscurridos = Math.floor((new Date() - inicio) / 60000);

            // Calcula costo actual por bloques de 30 minutos
            // Math.max se asegura de que al menos cuente 1 minuto
            const bloques = Math.ceil(Math.max(minutosTranscurridos, 1) / 30);
            const costoActual = bloques * 5; // Precio fijo por bloque

            // Crea una fila de la tabla con la información de la sesión
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-3">${s.id_maquina}</td>
                <td class="p-3">${inicio.toLocaleTimeString()}</td>
                <td class="p-3">${minutosTranscurridos} min</td>
                <td class="p-3">$${costoActual.toFixed(2)}</td>
            `;
            dashboardCont.appendChild(row); // Añade fila a la tabla
        }
    });
}
