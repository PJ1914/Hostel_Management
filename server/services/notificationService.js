const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/User');

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configure Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendEmail = async (to, subject, text) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log('SMS sent successfully to:', to);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }
};

const checkAndSendFeeReminders = async () => {
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const users = await User.find({
      'feeStatus.nextDue': {
        $gte: new Date(),
        $lte: twoDaysFromNow
      }
    });

    for (const user of users) {
      const message = `
        Dear ${user.name},
        
        This is a reminder that your hostel fee payment of Rs.${user.feeStatus.amount} is due on ${user.feeStatus.nextDue.toLocaleDateString()}.
        
        Please ensure timely payment to avoid any inconvenience.
        
        Regards,
        Sreemaan Hostel Management
      `;

      // Send email to student and parent
      if (user.notificationPreferences.email) {
        await sendEmail(user.email, 'Hostel Fee Payment Reminder', message);
        await sendEmail(user.parentEmail, 'Hostel Fee Payment Reminder', message);
      }

      // Send SMS to student and parent
      if (user.notificationPreferences.sms) {
        const smsMessage = `Sreemaan Hostel: Your fee payment of Rs.${user.feeStatus.amount} is due on ${user.feeStatus.nextDue.toLocaleDateString()}. Please pay on time.`;
        await sendSMS(user.phoneNumber, smsMessage);
        await sendSMS(user.parentPhoneNumber, smsMessage);
      }
    }
  } catch (error) {
    console.error('Fee reminder check failed:', error);
  }
};

module.exports = {
  sendEmail,
  sendSMS,
  checkAndSendFeeReminders
}; 