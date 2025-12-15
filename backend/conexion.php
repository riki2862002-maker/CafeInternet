<?php
// ------------------------------------------------------------
// conexion.php
// ------------------------------------------------------------

// Configuración de la conexión a la base de datos
$host = "localhost";        // Servidor de base de datos (localhost = mismo servidor)
$usuario = "root";          // Usuario de la base de datos
$contrasena = "";           // Contraseña del usuario
$base_datos = "internet";   // Nombre de la base de datos que vamos a usar

try {
    // Creamos una nueva conexión PDO
    // PDO permite conectarse a varias bases de datos y manejar errores de manera más segura
    $pdo = new PDO(
        "mysql:host=$host;dbname=$base_datos;charset=utf8", // DSN: especifica tipo de DB, host y base
        $usuario,                                           // Usuario
        $contrasena,                                        // Contraseña
        [
            // Mostrar errores de manera clara si algo falla en la consulta
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            // Devuelve los resultados como arreglo asociativo (clave => valor)
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Ajustar la zona horaria a México (CDMX)
    // Esto asegura que las fechas/hours que guardemos o consultemos sean correctas
    // Asegúrate de hacer lo mismo pero con tu país de residencia
    $pdo->exec("SET time_zone = '-06:00'");

} catch (PDOException $e) {
    // Si ocurre un error de conexión, devolvemos un JSON con la información del error
    header('Content-Type: application/json'); // Le decimos al navegador que es JSON
    echo json_encode(['error' => "Error en la conexión: " . $e->getMessage()]);
    exit; // Detenemos la ejecución para que no continue el script
}
?>
