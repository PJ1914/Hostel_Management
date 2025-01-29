const { checkAndSendFeeReminders } = require('./services/notificationService');

async function testCron() {
  console.log('Testing fee reminders...');
  await checkAndSendFeeReminders();
}

testCron(); 