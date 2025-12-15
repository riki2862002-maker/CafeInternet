<?php
// iniciar_sesion.php
// Este script registra el inicio de una sesión en la tabla "sesiones".

header("Content-Type: application/json"); 
// Indicamos que la respuesta del servidor será JSON para que el frontend lo interprete correctamente

// ---------------------------------------------------
// 1. Conectar a la base de datos
// ---------------------------------------------------
require_once "./conexion.php"; 
// Incluye el archivo de conexión (PDO) que maneja errores, charset y zona horaria

// ---------------------------------------------------
// 2. Obtener datos enviados desde JavaScript (POST)
// ---------------------------------------------------
$entrada = json_decode(file_get_contents("php://input"), true); 
// file_get_contents("php://input") lee los datos crudos de la petición
// json_decode convierte el JSON recibido en un arreglo asociativo PHP

// Validación: si no se envía id_maquina, no se puede iniciar sesión
if (!isset($entrada["id_maquina"])) {
    echo json_encode(["error" => "id_maquina es obligatorio"]);
    exit; // Detiene la ejecución
}

$id_maquina = $entrada["id_maquina"]; // Guardamos el ID de la máquina

// ---------------------------------------------------
// 3. Insertar el nuevo registro de sesión
// ---------------------------------------------------
// La fecha_inicio se guarda automáticamente con CURRENT_TIMESTAMP
// Los demás campos (copias, costos, fecha_fin) empiezan en cero y se actualizan al finalizar.
try {
    $sql = "INSERT INTO sesiones (
                id_maquina
            ) VALUES (?)"; 
    // Se usa placeholder (?) para evitar inyección SQL

    $stmt = $pdo->prepare($sql); // Prepara la consulta
    $stmt->execute([$id_maquina]); // Ejecuta con el parámetro del ID de máquina

    // ---------------------------------------------------
    // 4. Obtener el id de la sesión recién creada
    // ---------------------------------------------------
    $id_sesion = $pdo->lastInsertId(); 
    // lastInsertId() devuelve el valor del campo AUTO_INCREMENT generado en el INSERT

    // Devolvemos respuesta JSON al frontend
    echo json_encode([
        "ok" => true,
        "mensaje" => "Sesion iniciada correctamente",
        "id_sesion" => $id_sesion
    ]);

} catch (Exception $e) {
    // Capturamos cualquier error y lo devolvemos en JSON
    echo json_encode([
        "error" => "Error al iniciar sesion",
        "detalle" => $e->getMessage()
    ]);
}
