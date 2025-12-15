<?php
// ------------------------------------------------------------
// eliminar_sesion.php
// ------------------------------------------------------------

// Indicamos que la respuesta será en formato JSON
header("Content-Type: application/json");

// Incluimos la conexión a la base de datos
require_once "./conexion.php";

// Leemos la entrada enviada desde el frontend (JavaScript) en formato JSON
$entrada = json_decode(file_get_contents("php://input"), true);

// Validamos que el id_sesion esté presente
if (!isset($entrada["id_sesion"])) {
    echo json_encode(["error" => "id_sesion es obligatorio"]); // Retornamos error si falta
    exit; // Detenemos ejecución
}

// Convertimos id_sesion a entero para seguridad
$id_sesion = (int)$entrada["id_sesion"];

try {
    // Preparamos la consulta para eliminar la sesión
    $stmt = $pdo->prepare("DELETE FROM sesiones WHERE id_sesion = ?");
    
    // Ejecutamos la consulta usando el id_sesion recibido
    $stmt->execute([$id_sesion]);

    // Verificamos si efectivamente se eliminó algún registro
    if ($stmt->rowCount() === 0) {
        // Si no se eliminó ninguna fila, lanzamos una excepción
        throw new Exception("Sesión no encontrada");
    }

    // Retornamos JSON indicando éxito
    echo json_encode([
        "ok" => true,
        "mensaje" => "Sesión eliminada correctamente"
    ]);

} catch (Exception $e) {
    // Capturamos cualquier error y lo retornamos en formato JSON
    echo json_encode([
        "error" => "Error al eliminar sesión",
        "detalle" => $e->getMessage()
    ]);
}
