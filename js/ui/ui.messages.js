// Obtiene el contenedor donde se mostrarán los mensajes de feedback
const divMensajes = document.getElementById("mensajes");

// ------------------------------------------------------------
// Función para mostrar un mensaje en pantalla
// ------------------------------------------------------------
export function mostrarMensaje(texto, tipo = "info") {
    if (!divMensajes) return; // Si el contenedor no existe, termina la función

    // Determina el color de fondo según el tipo de mensaje
    const color =
        tipo === "error" ? "bg-red-500" :       // Rojo para errores
        tipo === "success" ? "bg-green-500" :   // Verde para éxito
        "bg-blue-500";                           // Azul por defecto (información)

    // Inserta el HTML del mensaje dentro del contenedor
    divMensajes.innerHTML = `
        <div class="${color} text-white p-4 rounded-lg shadow-lg mb-2">
            ${texto}  <!-- Texto del mensaje -->
        </div>
    `;

    // Después de 3 segundos, borra el mensaje automáticamente
    setTimeout(() => {
        // Comprueba que el mensaje aún esté visible antes de eliminarlo
        if (divMensajes.innerHTML.includes(texto)) {
            divMensajes.innerHTML = "";
        }
    }, 3000);
}

// ------------------------------------------------------------
// Función para mostrar un error
// ------------------------------------------------------------
export function mostrarError(texto) {
    // Llama a mostrarMensaje indicando que es un error
    mostrarMensaje(texto, "error");
}
