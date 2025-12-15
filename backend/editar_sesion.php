<?php
// ------------------------------------------------------------
// editar_sesion.php
// ------------------------------------------------------------

// Le indicamos al navegador que la respuesta será JSON
header("Content-Type: application/json");

// Incluimos la conexión a la base de datos (conexion.php)
require_once "./conexion.php";

// Leemos la entrada enviada desde el frontend (JavaScript) en formato JSON
// file_get_contents("php://input") lee todo el cuerpo de la solicitud
// json_decode convierte la cadena JSON en un arreglo asociativo de PHP
$entrada = json_decode(file_get_contents("php://input"), true);

// Validamos que los datos requeridos estén presentes
if (
    !isset($entrada["id_sesion"]) ||
    !isset($entrada["copias_bn"]) ||
    !isset($entrada["copias_color"])
) {
    echo json_encode(["error" => "Datos incompletos"]); // Retornamos error
    exit; // Detenemos ejecución si faltan datos
}

// Convertimos los valores a enteros para evitar problemas de tipo
$id_sesion = (int)$entrada["id_sesion"];
$copias_bn = (int)$entrada["copias_bn"];
$copias_color = (int)$entrada["copias_color"];

// 💰 Precios unitarios de copias
$precio_bn = 1;      // B/N
$precio_color = 4;   // Color

// Calculamos el costo total de las copias
$costo_copias = ($copias_bn * $precio_bn) + ($copias_color * $precio_color);

try {
    // Obtenemos el costo de tiempo ya registrado para la sesión
    $stmt = $pdo->prepare("
        SELECT costo_tiempo 
        FROM sesiones 
        WHERE id_sesion = ?
    ");
    $stmt->execute([$id_sesion]);   // Ejecutamos con el id_sesion recibido
    $sesion = $stmt->fetch();       // Obtenemos la primera fila del resultado

    if (!$sesion) {
        // Si no existe la sesión, lanzamos una excepción
        throw new Exception("Sesión no encontrada");
    }

    // Sumamos el costo de tiempo más el costo de las copias
    $costo_total = $sesion["costo_tiempo"] + $costo_copias;

    // Preparamos la actualización de la sesión en la base de datos
    $stmt = $pdo->prepare("
        UPDATE sesiones SET
            copias_bn = ?,
            copias_color = ?,
            costo_copias = ?,
            costo_total = ?
        WHERE id_sesion = ?
    ");

    // Ejecutamos la actualización con los valores calculados
    $stmt->execute([
        $copias_bn,
        $copias_color,
        $costo_copias,
        $costo_total,
        $id_sesion
    ]);

    // Retornamos un JSON indicando éxito
    echo json_encode([
        "ok" => true,
        "mensaje" => "Sesión actualizada correctamente"
    ]);

} catch (Exception $e) {
    // Capturamos cualquier error y lo devolvemos en formato JSON
    echo json_encode([
        "error" => "Error al editar sesión",
        "detalle" => $e->getMessage()
    ]);
}
