<?php
// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Load Composer's autoloader
require 'vendor/autoload.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $date = $_POST['datetime'];
    $service = $_POST['service'];
    $notes = $_POST['notes'];

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();                                    // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';               // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                           // Enable SMTP authentication
        $mail->Username   = 'choudharykausar25@gmail.com';         // SMTP username (your Gmail)
        $mail->Password   = 'Kausar@2005';            // Your regular Gmail password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;    // Enable implicit TLS encryption
        $mail->Port       = 465;                            // TCP port to connect to

        // Recipients
        $mail->setFrom('choudharykausar2005@gmail.com', 'Healing Website');
        $mail->addAddress('choudharykausar2005@gmail.com', 'Kausar Choudhary');     // Add a recipient
        $mail->addReplyTo($email, $name);                   // Reply to the user's email

        // Content
        $mail->isHTML(false);                               // Set email format to plain text
        $mail->Subject = 'New Booking Request';
        
        $body = "
Name: $name
Email: $email
Phone: $phone
Preferred Date: $date
Service: $service
Notes: $notes
        ";
        
        $mail->Body = $body;

        $mail->send();
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Booking request sent successfully!']);
        exit();
        
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
        exit();
    }
}
?>
