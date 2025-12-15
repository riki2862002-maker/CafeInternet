<?php
// finalizar_sesion.php
header("Content-Type: application/json"); // Indicamos que la respuesta será JSON
require_once "./conexion.php";             // Incluimos la conexión a la base de datos

// --------------------------------------------------
// 1. Leer entrada JSON enviada desde el frontend
// --------------------------------------------------
$entrada = json_decode(file_get_contents("php://input"), true); 
// file_get_contents("php://input") lee el cuerpo de la petición HTTP
// json_decode convierte el JSON recibido en un arreglo asociativo PHP

if (!isset($entrada["id_sesion"])) {
    // Validamos que se haya enviado el id_sesion
    echo json_encode(["error" => "id_sesion es obligatorio"]);
    exit; // Detiene la ejecución si falta información
}

$id_sesion = (int)$entrada["id_sesion"]; // Convertimos a entero por seguridad
$copias_bn = isset($entrada["copias_bn"]) ? (int)$entrada["copias_bn"] : 0;
$copias_color = isset($entrada["copias_color"]) ? (int)$entrada["copias_color"] : 0;

// --------------------------------------------------
// Precios fijos de copias
// --------------------------------------------------
$precio_bn = 1;
$precio_color = 4;

try {
    // --------------------------------------------------
    // 2. Obtener sesión de la base de datos
    // --------------------------------------------------
    $stmt = $pdo->prepare("
        SELECT fecha_inicio 
        FROM sesiones 
        WHERE id_sesion = ?
    ");
    $stmt->execute([$id_sesion]); // Se pasa el parámetro de forma segura para evitar inyección SQL
    $sesion = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sesion) {
        // Si no existe la sesión, lanzamos excepción
        throw new Exception("Sesión no encontrada");
    }

    // --------------------------------------------------
    // 3. Calcular tiempo transcurrido
    // --------------------------------------------------
    $zona = new DateTimeZone("America/Mexico_City");        // Zona horaria de México
    $inicio = new DateTime($sesion["fecha_inicio"], $zona); // Fecha de inicio de sesión
    $fin = new DateTime("now", $zona);                     // Fecha y hora actual

    $intervalo = $inicio->diff($fin); // Diferencia entre inicio y fin (objeto DateInterval)
    $minutos = ($intervalo->days * 24 * 60)
             + ($intervalo->h * 60)
             + $intervalo->i; // Calculamos total de minutos

    if ($minutos < 1) $minutos = 1; // Garantizamos al menos 1 minuto

    // --------------------------------------------------
    // 4. Calcular costos
    // --------------------------------------------------
    $bloques = ceil($minutos / 30); // Cada bloque son 30 minutos
    $costo_tiempo = $bloques * 5;   // Costo por tiempo

    $costo_copias = ($copias_bn * $precio_bn)
                  + ($copias_color * $precio_color); // Costo por copias
    $costo_total = $costo_tiempo + $costo_copias;   // Total a cobrar

    // --------------------------------------------------
    // 5. Actualizar sesión en la base de datos
    // --------------------------------------------------
    $stmt = $pdo->prepare("
        UPDATE sesiones SET
            tiempo_minutos = ?,
            copias_bn = ?,
            copias_color = ?,
            costo_tiempo = ?,
            costo_copias = ?,
            costo_total = ?,
            fecha_fin = NOW()
        WHERE id_sesion = ?
    ");

    $stmt->execute([
        $minutos,
        $copias_bn,
        $copias_color,
        $costo_tiempo,
        $costo_copias,
        $costo_total,
        $id_sesion
    ]);

    // --------------------------------------------------
    // 6. Devolver respuesta JSON al frontend
    // --------------------------------------------------
    echo json_encode([
        "ok" => true,
        "mensaje" => "Sesión finalizada correctamente",
        "tiempo_minutos" => $minutos,
        "copias_bn" => $copias_bn,
        "copias_color" => $copias_color,
        "costo_tiempo" => $costo_tiempo,
        "costo_copias" => $costo_copias,
        "costo_total" => $costo_total
    ]);

} catch (Exception $e) {
    // Capturamos cualquier error y devolvemos JSON con detalle
    echo json_encode([
        "error" => "Error al finalizar sesión",
        "detalle" => $e->getMessage()
    ]);
}
