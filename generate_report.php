<?php
// generate_report.php
include 'db_connection.php';
require __DIR__ . '/../vendor/autoload.php'; // TCPDF

$data = json_decode(file_get_contents('php://input'), true);
$type = $data['type'] ?? 'daily';

// Definir rango según tipo
switch($type){
    case 'daily':
        $where = "DATE(fecha_registro) = CURDATE()";
        break;
    case 'weekly':
        $where = "YEARWEEK(fecha_registro, 1) = YEARWEEK(CURDATE(), 1)";
        break;
    case 'monthly':
        $where = "MONTH(fecha_registro) = MONTH(CURDATE()) AND YEAR(fecha_registro) = YEAR(CURDATE())";
        break;
    default:
        $where = "1";
}

$stmt = $conn->prepare("SELECT * FROM sesiones WHERE $where");
$stmt->execute();
$sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Crear PDF
$pdf = new \TCPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 12);

$html = "<h2>Reporte " . ucfirst($type) . "</h2>
<table border='1' cellpadding='4'>
<tr>
<th>Cliente</th>
<th>Máquina</th>
<th>Inicio</th>
<th>Fin</th>
<th>Total</th>
</tr>";

foreach ($sessions as $s) {
    $html .= "<tr>
    <td>{$s['cliente']}</td>
    <td>{$s['machine_id']}</td>
    <td>" . date('Y-m-d H:i', $s['inicio']/1000) . "</td>
    <td>" . ($s['fin'] ? date('Y-m-d H:i', $s['fin']/1000) : '-') . "</td>
    <td>{$s['total']}</td>
    </tr>";
}

$html .= "</table>";
$pdf->writeHTML($html);
$pdf->Output('reporte.pdf', 'I'); // 'I' abre en navegador
?>
