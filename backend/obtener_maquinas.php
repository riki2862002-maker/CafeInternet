<?php
// obtener_maquinas.php
// Este script devuelve todas las máquinas registradas en la BD en formato JSON.

header("Content-Type: application/json"); 
// Indicamos que la respuesta será JSON para que el frontend lo interprete correctamente

// ---------------------------------------------------
// 1. Conectar a la base de datos
// ---------------------------------------------------
require_once "./conexion.php"; 
// Incluye el archivo de conexión PDO configurado con manejo de errores, charset y zona horaria

try {
    // ---------------------------------------------------
    // 2. Consultar todas las máquinas
    // ---------------------------------------------------
    $sql = "SELECT id_maquina, nombre_maquina FROM maquinas ORDER BY id_maquina ASC";
    // Selecciona el ID y nombre de todas las máquinas, ordenadas de menor a mayor por ID

    $stmt = $pdo->query($sql); 
    // Ejecuta la consulta directamente (no requiere parámetros, por eso usamos query en lugar de prepare/execute)

    $maquinas = $stmt->fetchAll(); 
    // fetchAll() devuelve todas las filas como un arreglo asociativo, útil para JSON

    // ---------------------------------------------------
    // 3. Devolver datos en JSON
    // ---------------------------------------------------
    echo json_encode([
        "ok" => true,
        "maquinas" => $maquinas
    ]);
    // El frontend recibirá algo como:
    // { "ok": true, "maquinas": [ { "id_maquina": 1, "nombre_maquina": "Máq. 1" }, ... ] }

} catch (Exception $e) {
    // ---------------------------------------------------
    // Manejo de errores
    // ---------------------------------------------------
    echo json_encode([
        "error" => "Error al obtener maquinas",
        "detalle" => $e->getMessage()
    ]);
    // Siempre devolvemos JSON, incluso en caso de fallo, para que el frontend no rompa
}
