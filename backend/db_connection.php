<?php
$host = "localhost";
$db = "cybercafe";
$user = "root";
$pass = ""; // Cambia si tu usuario tiene contraseña

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}
?>
