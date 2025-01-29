const { sendEmail, sendSMS } = require('./services/notificationService');

async function testNotifications() {
  try {
    // Test email
    await sendEmail(
      'test@example.com',
      'Test Email',
      'This is a test email from Hostel Management System'
    );

    // Test SMS
    await sendSMS(
      '+91XXXXXXXXXX',
      'Test SMS from Hostel Management System'
    );

    console.log('Test notifications sent successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testNotifications(); 