<?php
session_start();

$codigo_digitado = $_POST['codigo'];
$codigo_correto = $_SESSION['codigo_verificacao'] ?? '';
$email = $_SESSION['email_verificacao'] ?? '';
$tipo = $_SESSION['tipo_verificacao'] ?? '';
$expira = $_SESSION['codigo_expira'] ?? 0;

// Verifica se o código está correto e não expirou
if (time() > $expira) {
    echo json_encode(['success' => false, 'message' => 'Código expirado']);
} elseif ($codigo_digitado === $codigo_correto) {
    echo json_encode(['success' => true, 'email' => $email, 'tipo' => $tipo]);
} else {
    echo json_encode(['success' => false, 'message' => 'Código inválido']);
}
?>