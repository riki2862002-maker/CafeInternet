<?php
header('Content-Type: application/json');
include 'db_connection.php';

try {
    // Sesiones activas
    $stmt = $conn->prepare("SELECT * FROM sesiones WHERE fin IS NULL ORDER BY inicio ASC");
    $stmt->execute();
    $active = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Historial
    $stmt = $conn->prepare("SELECT * FROM sesiones WHERE fin IS NOT NULL ORDER BY fin DESC");
    $stmt->execute();
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["active" => $active, "history" => $history]);
} catch(PDOException $e) {
    echo json_encode(["active" => [], "history" => []]);
}
?>
