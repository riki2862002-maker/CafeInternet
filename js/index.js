// index.js

// ------------------------------------------------------------
// Importaciones de módulos
// ------------------------------------------------------------
// `cargarDatosIniciales` y `iniciarActualizacionDashboard` se importan desde main.js
// para manejar la carga inicial de datos y el refresco automático del dashboard
import { cargarDatosIniciales, iniciarActualizacionDashboard } from "./main.js";

// Funciones de UI para sesiones
// `inicializarUI` configura los eventos de los botones y formularios
// `actualizarSelects` actualiza los <select> de máquinas y sesiones activas
import { inicializarUI, actualizarSelects } from "./ui/ui.sesiones.js";

// Función que renderiza las tarjetas de máquinas disponibles en el frontend
import { renderMaquinas } from "./ui/ui.maquinas.js";

// Función que renderiza el dashboard con métricas e información de sesiones
import { renderDashboard } from "./ui/ui.dashboard.js";

// Función para mostrar mensajes de éxito o error al usuario
import { mostrarMensaje } from "./ui/ui.messages.js";

// ------------------------------------------------------------
// Espera a que el DOM esté completamente cargado
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    // Inicializa la UI: botones, formularios y listeners
    inicializarUI();

    try {
        // Carga los datos iniciales desde el backend (máquinas y sesiones)
        await cargarDatosIniciales();

        // Renderiza las tarjetas de máquinas en la UI
        renderMaquinas();

        // Actualiza los <select> de máquinas y sesiones activas
        await actualizarSelects();

        // Renderiza el dashboard con métricas iniciales
        renderDashboard();

        // Inicia el refresco automático del dashboard cada cierto intervalo
        // para que las métricas se actualicen en tiempo real
        iniciarActualizacionDashboard();

        // Muestra un mensaje de éxito indicando que el sistema está listo
        mostrarMensaje("Sistema listo", "success");
    } catch (err) {
        // Si ocurre un error en cualquiera de los pasos anteriores, se imprime en consola
        console.error(err);
    }
});
