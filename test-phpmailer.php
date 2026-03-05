<?php
// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Load Composer's autoloader
require 'vendor/autoload.php';

// Test PHPMailer configuration
echo "<h2>PHPMailer Test</h2>";

try {
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'choudharykausar2005@gmail.com';
    $mail->Password   = 'zoum iudq kvmb qdqx';  // Use your actual App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('choudharykausar2005@gmail.com', 'Healing Website Test');
    $mail->addAddress('choudharykausar2005@gmail.com', 'Test Recipient');

    // Content
    $mail->isHTML(false);
    $mail->Subject = 'PHPMailer Test Email';
    $mail->Body = "This is a test email from PHPMailer.\n\nIf you receive this, PHPMailer is working correctly!";

    // Send email
    if($mail->send()) {
        echo "<p style='color: green; font-weight: bold;'>✅ SUCCESS: Email sent successfully!</p>";
        echo "<p>Check your inbox at choudharykausar2005@gmail.com</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ ERROR: Email failed to send</p>";
        echo "<p>Error: " . $mail->ErrorInfo . "</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ EXCEPTION: " . $e->getMessage() . "</p>";
}
?>
