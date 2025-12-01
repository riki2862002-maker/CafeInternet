<?php
header('Content-Type: application/json');
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'], $data['fin'], $data['prints_bw'], $data['prints_color'], $data['total'])) {
    echo json_encode(["success" => false]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE sesiones SET fin = ?, impresiones_bn = ?, impresiones_color = ?, total = ? WHERE id = ?");
    $stmt->execute([$data['fin'], $data['prints_bw'], $data['prints_color'], $data['total'], $data['id']]);
    echo json_encode(["success" => true]);
} catch(PDOException $e) {
    echo json_encode(["success" => false]);
}
?>
