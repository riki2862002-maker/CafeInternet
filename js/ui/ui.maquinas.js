// Importa el estado global de máquinas
import { getMaquinas } from "../state/estado.js";

// Contenedor principal donde se mostrarán las tarjetas de máquinas
const contenedor = document.getElementById("contenedor-maquinas");
// Select para elegir una máquina al iniciar sesión
const selectIniciar = document.getElementById("machine-select");

// ------------------------------------------------------------
// Función para renderizar las tarjetas de máquinas en el DOM
// ------------------------------------------------------------
export function renderMaquinas(lista = getMaquinas()) {
    if (!contenedor) return; // Si el contenedor no existe, termina la función

    // Limpia cualquier contenido previo
    contenedor.innerHTML = "";

    // Itera sobre cada máquina y crea su tarjeta visual
    lista.forEach(m => {
        const card = document.createElement("div");
        card.className = "maquina-card bg-white p-6 rounded-xl shadow-md";

        // Inserta HTML de la tarjeta con estado de la máquina
        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-2">
                Máquina ${m.id_maquina}
            </h3>
            <p class="flex items-center">
                <!-- Indicador de ocupación: rojo = ocupada, verde = disponible -->
                <span class="inline-block w-3 h-3 rounded-full mr-2
                    ${m.ocupada ? 'bg-red-500' : 'bg-green-500'}"></span>
                <span class="${m.ocupada ? 'text-red-600' : 'text-green-600'} font-semibold">
                    ${m.ocupada ? 'Ocupada' : 'Disponible'}
                </span>
            </p>
        `;
        contenedor.appendChild(card); // Añade la tarjeta al contenedor
    });
}

// ------------------------------------------------------------
// Función para actualizar el select de máquinas disponibles
// ------------------------------------------------------------
export function actualizarSelectMaquinas() {
    if (!selectIniciar) return; // Si el select no existe, termina

    // Limpia opciones previas
    selectIniciar.innerHTML = "";

    // Solo agrega máquinas que no estén ocupadas
    getMaquinas().filter(m => !m.ocupada).forEach(m => {
        const option = document.createElement("option");
        option.value = m.id_maquina;
        option.textContent = `Máquina ${m.id_maquina}`;
        selectIniciar.appendChild(option); // Añade opción al select
    });
}
