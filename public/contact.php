<?php
/**
 * Velos Shield — demo request form handler (static site + PHP)
 * Sends submissions to the team email.
 */

// Honeypot: real users never see/fill this hidden field
if (!empty($_POST['website'])) {
    header('Location: /demo/?sent=success');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /demo/');
    exit;
}

function vs_clean($v) {
    return trim(strip_tags((string)($v ?? '')));
}

$name     = vs_clean($_POST['name'] ?? '');
$email    = vs_clean($_POST['email'] ?? '');
$org      = vs_clean($_POST['organization'] ?? '');
$role     = vs_clean($_POST['role'] ?? '');
$industry = vs_clean($_POST['industry'] ?? '');
$sites    = vs_clean($_POST['sites'] ?? '');
$goal     = vs_clean($_POST['goal'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /demo/?sent=error');
    exit;
}

$to      = 'lionel@pauzible.com';
$subject = 'Velos Shield demo request — ' . $name;

$body = "New demo request (velosshield.com)\n"
      . "================================\n\n"
      . "Name:         $name\n"
      . "Email:        $email\n"
      . "Organization: $org\n"
      . "Role:         $role\n"
      . "Industry:     $industry\n"
      . "OT sites:     $sites\n"
      . "Goal:         $goal\n";

$headers = "From: Velos Shield <noreply@velosshield.com>\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: PHP/" . phpversion();

$ok = @mail($to, $subject, $body, $headers);

header('Location: /demo/?sent=' . ($ok ? 'success' : 'error'));
exit;
