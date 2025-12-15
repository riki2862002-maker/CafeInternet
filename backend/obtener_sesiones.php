<?php
// obtener_sesiones.php
// Este script devuelve todas las sesiones registradas en la base de datos, incluyendo finalizadas y activas

header("Content-Type: application/json");
// Indicamos que la respuesta será JSON, para que el frontend pueda procesarla directamente

// ---------------------------------------------------
// 1. Conexión a la base de datos
// ---------------------------------------------------
require_once "./conexion.php";
// Incluye la conexión PDO que ya tiene host, usuario, contraseña, base de datos y configuración de zona horaria

// ---------------------------------------------------
// 2. Consulta general del historial de sesiones
// ---------------------------------------------------
try {
    $sql = "SELECT 
                id_sesion,
                id_maquina,
                tiempo_minutos,
                copias_bn,
                copias_color,
                costo_tiempo,
                costo_copias,
                costo_total,
                fecha_inicio,
                fecha_fin
            FROM sesiones
            ORDER BY fecha_inicio DESC";
    /* 
        Explicación de campos:
        - id_sesion -> ID único de la sesión
        - id_maquina -> ID de la máquina usada
        - tiempo_minutos -> tiempo total de la sesión
        - copias_bn -> número de copias en blanco y negro
        - copias_color -> número de copias a color
        - costo_tiempo -> costo calculado por tiempo
        - costo_copias -> costo calculado por las copias
        - costo_total -> suma de tiempo + copias
        - fecha_inicio -> fecha/hora en que se inició la sesión
        - fecha_fin -> fecha/hora en que finalizó (null si sigue activa)
        - ORDER BY fecha_inicio DESC -> las sesiones más recientes aparecen primero
    */

    $stmt = $pdo->query($sql);
    // Ejecuta la consulta. Se usa query() porque no hay parámetros dinámicos que requieran prepare()

    $sesiones = $stmt->fetchAll();
    // fetchAll() devuelve todas las filas como arreglo asociativo
    // Ejemplo de salida:
    // [
    //   { "id_sesion": 1, "id_maquina": 2, "tiempo_minutos": 45, ... },
    //   ...
    // ]

    // ---------------------------------------------------
    // 3. Devolver datos en JSON
    // ---------------------------------------------------
    echo json_encode([
        "ok" => true,
        "sesiones" => $sesiones
    ]);
    // Esto permite al frontend renderizar el historial completo de sesiones

} catch (Exception $e) {
    // ---------------------------------------------------
    // 4. Manejo de errores
    // ---------------------------------------------------
    echo json_encode([
        "error" => "Error al obtener sesiones",
        "detalle" => $e->getMessage()
    ]);
    // Siempre se devuelve JSON incluso si hay un error, para que el JS no rompa
}
