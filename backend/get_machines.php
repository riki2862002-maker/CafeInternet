<?php
header('Content-Type: application/json');
include 'db_connection.php';

try {
    $stmt = $conn->query("SELECT id, nombre AS name, estado AS status FROM maquinas ORDER BY id ASC");
    $machines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($machines);
} catch(PDOException $e) {
    echo json_encode([]);
}
?>
