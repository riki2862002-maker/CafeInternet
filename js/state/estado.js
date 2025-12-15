// ------------------------------------------------------------
// Estado global compartido
// ------------------------------------------------------------
// Este objeto mantiene toda la información en memoria mientras
// la aplicación está corriendo. Es la "fuente de la verdad" 
// para máquinas, sesiones y estado de carga.
export const estado = {
    maquinas: [],    // Lista de todas las máquinas del cibercafé
    sesiones: [],    // Lista de todas las sesiones (activas o finalizadas)
    cargando: false  // Indicador de si se están cargando datos desde el backend
};

// ------------------------------------------------------------
// Getters para acceder al estado
// ------------------------------------------------------------

// Retorna el arreglo de máquinas
export function getMaquinas() {
    return estado.maquinas;
}

// Retorna el arreglo de sesiones
export function getSesiones() {
    return estado.sesiones;
}
