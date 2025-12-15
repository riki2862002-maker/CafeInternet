// ------------------------------------------------------------
// services/sesiones.service.js
// ------------------------------------------------------------

// Importamos funciones del backend (API) para manejar máquinas y sesiones
import {
    obtener_maquinas,
    obtener_sesiones,
    iniciar_sesion,
    finalizar_sesion,
    editar_sesion,
    eliminar_sesion
} from "../api.js";

// Importamos el estado global compartido
import { estado } from "../state/estado.js";

// ------------------------------------------------------------
// Cargar datos iniciales desde el backend
// ------------------------------------------------------------
export async function cargarDatosIniciales() {
    estado.cargando = true; // Indicamos que estamos cargando datos
    try {
        // Obtenemos todas las máquinas y sesiones desde el backend
        estado.maquinas = (await obtener_maquinas()).maquinas || [];
        estado.sesiones = (await obtener_sesiones()).sesiones || [];

        // Vinculamos las sesiones activas con sus respectivas máquinas
        enlazarSesionesConMaquinas();

        // Retornamos la información cargada para uso inmediato si es necesario
        return { maquinas: estado.maquinas, sesiones: estado.sesiones };
    } finally {
        estado.cargando = false; // Finalizamos el estado de carga
    }
}

// ------------------------------------------------------------
// Enlazar sesiones activas con máquinas
// ------------------------------------------------------------
function enlazarSesionesConMaquinas() {
    estado.maquinas.forEach(m => {
        // Buscamos una sesión activa que corresponda a la máquina
        const sesion = estado.sesiones.find(s => s.id_maquina == m.id_maquina && !s.fecha_fin);

        // Marcamos la máquina como ocupada si hay sesión activa
        m.ocupada = !!sesion;

        // Guardamos el ID de la sesión actual si existe
        m.id_sesion_actual = sesion ? sesion.id_sesion : null;
    });
}

// ------------------------------------------------------------
// Operaciones CRUD de sesiones
// ------------------------------------------------------------

// Inicia una sesión en la máquina especificada
export async function servicioIniciarSesion(id_maquina) {
    // Llamamos al backend para crear la sesión
    const res = await iniciar_sesion({ id_maquina });

    // Agregamos la sesión recién creada al inicio del array de sesiones
    estado.sesiones.unshift({
        id_sesion: res.id_sesion,
        id_maquina: parseInt(id_maquina),
        fecha_inicio: new Date().toISOString(), // Fecha de inicio actual
        fecha_fin: null,
        copias_bn: 0,
        copias_color: 0,
        costo_total: 0
    });

    // Marcamos la máquina como ocupada y asociamos la sesión actual
    const maquina = estado.maquinas.find(m => m.id_maquina == parseInt(id_maquina));
    if (maquina) {
        maquina.ocupada = true;
        maquina.id_sesion_actual = res.id_sesion;
    }

    // Retornamos información útil al frontend
    return { maquina, id_sesion: res.id_sesion };
}

// Finaliza la sesión de una máquina y actualiza el estado
export async function servicioFinalizarSesion(id_maquina, datos_formulario = { copias_bn: 0, copias_color: 0 }) {
    // Buscamos la máquina correspondiente
    const maquina = estado.maquinas.find(m => m.id_maquina == parseInt(id_maquina));
    if (!maquina || !maquina.id_sesion_actual) throw new Error("No se encontró la sesión que se debe finalizar.");

    const id_sesion = maquina.id_sesion_actual;

    // Llamamos al backend para finalizar la sesión con los datos de copias
    await finalizar_sesion({ id_sesion, ...datos_formulario });

    // Refrescamos todas las sesiones desde el backend
    const resSesiones = await obtener_sesiones();
    estado.sesiones = resSesiones.sesiones;

    // Liberamos la máquina
    maquina.ocupada = false;
    maquina.id_sesion_actual = null;

    return { maquina };
}

// Edita los datos de una sesión específica
export async function servicioEditarSesion(id_sesion, copias_bn, copias_color) {
    // Actualizamos la sesión en el backend
    await editar_sesion({ id_sesion, copias_bn, copias_color });

    // Refrescamos todas las sesiones desde el backend para mantener sincronizado el estado
    estado.sesiones = (await obtener_sesiones()).sesiones;
}

// Elimina una sesión específica
export async function servicioEliminarSesion(id_sesion) {
    // Eliminamos la sesión en el backend
    await eliminar_sesion({ id_sesion });

    // Refrescamos todas las sesiones para mantener el estado actualizado
    estado.sesiones = (await obtener_sesiones()).sesiones;
}
