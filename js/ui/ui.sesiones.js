// Importaciones desde otros módulos
// ------------------------------------------------------------
// getSesiones: función para obtener el estado global de sesiones
// servicioIniciarSesion, servicioFinalizarSesion, servicioEditarSesion, servicioEliminarSesion: 
// funciones que realizan las operaciones CRUD y actualizan el estado global
// renderMaquinas, actualizarSelectMaquinas: funciones de UI para renderizar las máquinas y actualizar los selects
// mostrarMensaje, mostrarError: funciones para mostrar mensajes de feedback al usuario
import { getSesiones } from "../state/estado.js";
import { 
    servicioIniciarSesion, 
    servicioFinalizarSesion, 
    servicioEditarSesion, 
    servicioEliminarSesion 
} from "../services/sesiones.service.js";
import { renderMaquinas, actualizarSelectMaquinas } from "./ui.maquinas.js";
import { mostrarMensaje, mostrarError } from "./ui.messages.js";

// Elementos del DOM que se usan en los formularios y selects
const selectFinalizar = document.getElementById("session-select");
const btnIniciar = document.querySelector("#session-form button");
const btnFinalizar = document.querySelector("#end-session-form button");

const inputBN = document.getElementById("copias-bn");
const inputColor = document.getElementById("copias-color");

// ------------------------------------------------------------
// Inicialización de la UI
// ------------------------------------------------------------
// Se agregan los listeners a los botones para iniciar y finalizar sesiones
export function inicializarUI() {
    btnIniciar?.addEventListener("click", iniciarSeleccionada);
    btnFinalizar?.addEventListener("click", finalizarSeleccionada);
}

// ------------------------------------------------------------
// Función para iniciar sesión
// ------------------------------------------------------------
async function iniciarSeleccionada(e) {
    e.preventDefault(); // Previene que el formulario recargue la página
    const id = document.getElementById("machine-select").value; // Obtiene la máquina seleccionada
    if (!id) return mostrarError("Seleccione una máquina"); // Validación simple

    try {
        // Llama al servicio para iniciar sesión y actualiza el estado
        const { maquina } = await servicioIniciarSesion(id);

        // Feedback al usuario
        mostrarMensaje(`Sesión iniciada en máquina ${maquina.id_maquina}`, "success");

        // Actualiza los selects y la visualización de máquinas
        actualizarSelects();
        renderMaquinas();
    } catch (err) {
        mostrarError(err.message); // Muestra error en caso de fallo
    }
}

// ------------------------------------------------------------
// Función para finalizar sesión
// ------------------------------------------------------------
async function finalizarSeleccionada(e) {
    e.preventDefault();
    const id = selectFinalizar.value; // Obtiene la sesión seleccionada para finalizar
    if (!id) return mostrarError("Seleccione una sesión"); // Validación simple

    // Obtiene los valores de copias del formulario, o 0 si están vacíos
    const copias_bn = parseInt(inputBN?.value) || 0;
    const copias_color = parseInt(inputColor?.value) || 0;

    try {
        // Llama al servicio para finalizar sesión y actualiza el estado
        const { maquina } = await servicioFinalizarSesion(id, { copias_bn, copias_color });

        // Feedback al usuario
        mostrarMensaje(`Sesión finalizada en máquina ${maquina.id_maquina}`, "success");

        // Limpia los inputs del formulario
        if (inputBN) inputBN.value = "";
        if (inputColor) inputColor.value = "";

        // Actualiza selects y renderiza las máquinas
        actualizarSelects();
        renderMaquinas();
    } catch (err) {
        mostrarError(err.message);
    }
}

// ------------------------------------------------------------
// Función para renderizar el historial de sesiones
// ------------------------------------------------------------
export function renderHistorial() {
    const tbody = document.getElementById("sessions-history");
    if (!tbody) return; // Si no existe la tabla, termina la función

    tbody.innerHTML = ""; // Limpia el historial previo

    // Recorre todas las sesiones del estado global
    getSesiones().forEach(s => {
        const row = document.createElement("tr");
        row.className = "border-b hover:bg-gray-50"; // Estilo de fila

        // Genera el HTML de cada fila, incluyendo botones Editar y Eliminar
        row.innerHTML = `
            <td class="p-3">${s.id_maquina}</td>
            <td class="p-3">${new Date(s.fecha_inicio).toLocaleString()}</td>
            <td class="p-3">${s.fecha_fin ? new Date(s.fecha_fin).toLocaleString() : "-"}</td>
            <td class="p-3">${s.copias_bn || 0}</td>
            <td class="p-3">${s.copias_color || 0}</td>
            <td class="p-3">$${s.costo_total || 0}</td>
            <td class="p-3">
                <div class="flex gap-2">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded btn-editar">
                        Editar
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded btn-eliminar">
                        Eliminar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);

        // Event listener para el botón Editar
        row.querySelector(".btn-editar").addEventListener("click", async () => {
            const copias_bn = prompt("Copias B/N:", s.copias_bn || 0); // Pide nuevo valor
            const copias_color = prompt("Copias Color:", s.copias_color || 0);
            if (copias_bn === null || copias_color === null) return; // Cancelar si se presiona cancelar

            try {
                await servicioEditarSesion(s.id_sesion, parseInt(copias_bn), parseInt(copias_color));
                mostrarMensaje("Sesión actualizada correctamente", "success");
                actualizarSelects();
                renderMaquinas();
            } catch (err) {
                mostrarError(err.message);
            }
        });

        // Event listener para el botón Eliminar
        row.querySelector(".btn-eliminar").addEventListener("click", async () => {
            if (!confirm("¿Desea eliminar esta sesión?")) return; // Confirmación de usuario

            try {
                await servicioEliminarSesion(s.id_sesion);
                mostrarMensaje("Sesión eliminada correctamente", "success");
                actualizarSelects();
                renderMaquinas();
            } catch (err) {
                mostrarError(err.message);
            }
        });
    });
}

// ------------------------------------------------------------
// Función para actualizar los selects
// ------------------------------------------------------------
export async function actualizarSelects() {
    // Actualiza el select de máquinas para iniciar sesión
    actualizarSelectMaquinas();

    // Si el select de finalizar no existe, termina la función
    if (!selectFinalizar) return;

    // Limpia el select y agrega solo las sesiones activas (sin fecha_fin)
    selectFinalizar.innerHTML = "";
    getSesiones().filter(s => !s.fecha_fin).forEach(s => {
        const option = document.createElement("option");
        option.value = s.id_maquina;
        option.textContent = `Máquina ${s.id_maquina}`;
        selectFinalizar.appendChild(option);
    });

    // Renderiza el historial actualizado
    renderHistorial();
}
