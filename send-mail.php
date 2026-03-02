<?php
if($_SERVER["REQUEST_METHOD"] == "POST"){

    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $date = $_POST['datetime'];
    $service = $_POST['service'];
    $notes = $_POST['notes'];

    $to = "choudharykausar2005@gmail.com";   // Yaha apna email daalna
    $subject = "New Booking Request";

    $message = "
    Name: $name
    Email: $email
    Phone: $phone
    Preferred Date: $date
    Service: $service
    Notes: $notes
    ";

    $headers = "From: $email";

    if(mail($to, $subject, $message, $headers)){
        echo "Booking request sent successfully!";
    } else {
        echo "Something went wrong.";
    }
}
?>