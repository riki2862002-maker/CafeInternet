<?php
header('Content-Type: application/json');
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['cliente'], $data['machine_id'], $data['inicio'])) {
    echo json_encode(["success" => false]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO sesiones (cliente, machine_id, inicio) VALUES (?, ?, ?)");
    $stmt->execute([$data['cliente'], $data['machine_id'], $data['inicio']]);
    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["success" => false]);
}
?>
