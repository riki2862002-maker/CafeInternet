// main.js

// ------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------
// Traemos la función que carga los datos iniciales desde el servicio de sesiones.
// Esto nos permite acceder a la información de máquinas y sesiones que viene del backend.
import { cargarDatosIniciales } from "./services/sesiones.service.js";

// Traemos la función que actualiza el dashboard en la interfaz.
// Renderizar significa "dibujar" o "mostrar" la información en pantalla.
import { renderDashboard } from "./ui/ui.dashboard.js";

// ------------------------------------------------------------
// FUNCIONES
// ------------------------------------------------------------

// Esta función inicia la actualización automática del dashboard.
// Cada segundo, refresca la información que se muestra, como sesiones activas,
// máquinas disponibles, ingresos y copias impresas.
export async function iniciarActualizacionDashboard() {
    // Primero dibujamos el dashboard una vez inmediatamente
    renderDashboard();

    // setInterval ejecuta repetidamente una función cada cierto tiempo.
    // En este caso, cada 1000 milisegundos (1 segundo) se vuelve a dibujar el dashboard.
    setInterval(() => renderDashboard(), 1000);
}

// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
// Exportamos la función que carga los datos iniciales para que otros módulos (archivos)
// puedan llamarla cuando sea necesario.
export { cargarDatosIniciales };
