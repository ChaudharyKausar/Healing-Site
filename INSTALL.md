# Email Setup Instructions

## Option 1: Using PHPMailer (Recommended)

### Step 1: Install PHPMailer
1. Download and install Composer from https://getcomposer.org/
2. Open Command Prompt in your project directory (C:\xampp\htdocs\Healing)
3. Run: `composer install`

### Step 2: Configure Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Update the credentials in `send-mail-phpmailer.php`:
   - Replace `your-gmail@gmail.com` with your Gmail address
   - Replace `your-app-password` with the generated app password

### Step 3: Update your form
Change your form's action attribute to point to `send-mail-phpmailer.php` instead of `send-mail.php`

## Option 2: Configure XAMPP Mail Server (Advanced)

### Step 1: Install hMailServer
1. Download hMailServer from https://www.hmailserver.com/
2. Install and configure it to run on localhost port 25

### Step 2: Update php.ini
Edit `C:\xampp\php\php.ini` and modify:
```ini
SMTP=localhost
smtp_port=25
sendmail_from = your-email@domain.com
```

### Step 3: Restart Apache
Restart XAMPP Apache service for changes to take effect.

## Testing
After setup, test the form submission. Check your spam folder if emails don't appear in inbox.
