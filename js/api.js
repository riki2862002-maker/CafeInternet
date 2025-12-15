// api.js - Comunicación con el backend (PHP + MySQL)
// ------------------------------------------------------------

// Base URL donde se encuentran todos los endpoints del backend
const API_BASE = './backend/';

// ------------------------------------------------------------
// FUNCIÓN GENÉRICA PARA HACER LLAMADAS AL BACKEND
// ------------------------------------------------------------
// Esta función se encarga de enviar solicitudes HTTP (GET o POST) a cualquier endpoint
// del backend y devolver la respuesta como objeto JSON.
async function llamar_api(endpoint, data = null) {
    try {
        // Construye la URL completa combinando la base con el endpoint
        const url = API_BASE + endpoint;

        // Si se envían datos, se hace una solicitud POST con JSON
        // Si no, se hace una solicitud GET
        const opciones = data
            ? {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data) // Convierte el objeto JS a JSON
              }
            : { method: "GET" };

        // Realiza la llamada al backend usando fetch y espera la respuesta
        const respuesta = await fetch(url, opciones);

        // Convierte la respuesta del servidor a objeto JSON
        const json = await respuesta.json();

        // Si la respuesta no es correcta o el JSON indica error, lanza un error
        if (!respuesta.ok || json.error) {
            throw new Error(json.error || "Error desconocido en el servidor.");
        }

        // Retorna los datos recibidos del backend
        return json;
    } catch (e) {
        // Si algo falla, lo muestra en la consola y lo vuelve a lanzar
        console.error("ERROR API:", e);
        throw e;
    }
}

// ------------------------------------------------------------
// FUNCIONES ESPECÍFICAS DEL BACKEND
// ------------------------------------------------------------

// Obtener todas las máquinas disponibles
export async function obtener_maquinas() {
    // Retorna un objeto { ok: true, maquinas: [...] }
    return await llamar_api('obtener_maquinas.php');
}

// Obtener sesiones activas para mostrar en el dashboard
export async function obtener_sesiones_activas() {
    // Retorna { ok: true, sesiones: [...] }
    return await llamar_api('obtener_sesiones_activas.php');
}

// Obtener historial completo de sesiones para reportes o historial
export async function obtener_sesiones() {
    // Retorna { ok: true, sesiones: [...] }
    return await llamar_api('obtener_sesiones.php');
}

// Iniciar sesión en una máquina específica
export async function iniciar_sesion(data) {
    // data = { id_maquina }
    // El backend devuelve el id de la sesión creada y la fecha de inicio
    return await llamar_api('iniciar_sesion.php', data);
}

// Finalizar sesión existente
export async function finalizar_sesion(data) {
    // data = { id_sesion }
    // El backend calcula automáticamente:
    // tiempo_minutos, costo_tiempo, costo_copias y costo_total
    return await llamar_api('finalizar_sesion.php', data);
}

// Editar una sesión existente (modificar copias en B/N y color)
export async function editar_sesion(data) {
    // data = { id_sesion, copias_bn, copias_color }
    return await llamar_api('editar_sesion.php', data);
}

// Eliminar una sesión del historial
export async function eliminar_sesion(data) {
    // data = { id_sesion }
    return await llamar_api('eliminar_sesion.php', data);
}
