<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Ou inclua os arquivos manualmente

// Configurações do servidor SMTP
$mail = new PHPMailer(true);
try {
    // Dados do formulário
    $email = $_POST['email'];
    $nome = $_POST['nome'] ?? '';
    $tipo = $_POST['tipo']; // 'registro' ou 'recuperacao'

    // Gera código de 6 dígitos
    $codigo = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

    // Configurações do servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.seuprovedor.com'; // Ex: smtp.gmail.com
    $mail->SMTPAuth = true;
    $mail->Username = 'seuemail@dominio.com';
    $mail->Password = 'suasenha';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Remetente e destinatário
    $mail->setFrom('no-reply@seusite.com', 'SimpleShop');
    $mail->addAddress($email, $nome);

    // Conteúdo do email
    if ($tipo === 'registro') {
        $mail->Subject = 'Código de Verificação - SimpleShop';
        $mail->Body = "Olá $nome,\n\nSeu código de verificação é: $codigo\n\nUse este código para completar seu registro.";
    } else {
        $mail->Subject = 'Recuperação de Senha - SimpleShop';
        $mail->Body = "Olá,\n\nSeu código de recuperação é: $codigo\n\nUse este código para redefinir sua senha.";
    }

    // Envia o email
    $mail->send();

    // Salva o código em sessão (ou banco de dados)
    session_start();
    $_SESSION['codigo_verificacao'] = $codigo;
    $_SESSION['email_verificacao'] = $email;
    $_SESSION['tipo_verificacao'] = $tipo;
    $_SESSION['codigo_expira'] = time() + 600; // Expira em 10 minutos

    echo json_encode(['success' => true, 'message' => 'Código enviado com sucesso']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Erro ao enviar email: {$mail->ErrorInfo}"]);
}
?>