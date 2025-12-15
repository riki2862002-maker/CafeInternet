<?php
// obtener_sesiones_activas.php
// Este script devuelve todas las sesiones que aún están activas (no tienen fecha_fin) en formato JSON

header("Content-Type: application/json");
// Indicamos que la respuesta será JSON, para que el frontend la pueda interpretar correctamente

require_once "./db/conexion.php";
// Incluye la conexión PDO configurada (host, usuario, password, base de datos, charset y zona horaria)

// ---------------------------------------------------
// 1. Consultar sesiones activas
// ---------------------------------------------------
try {
    $sql = "SELECT s.id_sesion, s.id_maquina, m.nombre_maquina, s.fecha_inicio
            FROM sesiones s
            JOIN maquinas m ON s.id_maquina = m.id_maquina
            WHERE s.fecha_fin IS NULL
            ORDER BY s.fecha_inicio ASC";
    /* 
        - Selecciona:
            s.id_sesion -> ID de la sesión
            s.id_maquina -> ID de la máquina
            m.nombre_maquina -> Nombre de la máquina
            s.fecha_inicio -> Fecha/hora en que se inició la sesión
        - JOIN con la tabla `maquinas` para obtener el nombre de la máquina asociada
        - WHERE s.fecha_fin IS NULL -> solo sesiones activas
        - ORDER BY s.fecha_inicio ASC -> ordena desde la más antigua a la más reciente
    */

    $stmt = $pdo->query($sql);
    // Ejecuta la consulta (query() porque no hay parámetros dinámicos)

    $sesiones = $stmt->fetchAll();
    // fetchAll() devuelve todas las filas como un arreglo asociativo
    // Ejemplo de salida:
    // [
    //   { "id_sesion": 1, "id_maquina": 2, "nombre_maquina": "Máq. 2", "fecha_inicio": "2025-12-13 10:00:00" },
    //   ...
    // ]

    // ---------------------------------------------------
    // 2. Devolver JSON
    // ---------------------------------------------------
    echo json_encode([
        "ok" => true,
        "sesiones" => $sesiones
    ]);
    // JSON devuelto al frontend, que luego se procesa en JS para mostrar en dashboard

} catch (Exception $e) {
    // ---------------------------------------------------
    // Manejo de errores
    // ---------------------------------------------------
    echo json_encode([
        "error" => "Error al obtener sesiones activas",
        "detalle" => $e->getMessage()
    ]);
    // Siempre devolvemos JSON incluso en caso de error, para que el frontend no rompa
}
