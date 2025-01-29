const cron = require('node-cron');
const { checkAndSendFeeReminders } = require('./services/notificationService');

// Run every day at 10:00 AM
cron.schedule('0 10 * * *', async () => {
  console.log('Running fee reminder check...');
  await checkAndSendFeeReminders();
}); 