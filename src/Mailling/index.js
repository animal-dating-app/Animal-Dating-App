const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '@gmail.com',
    pass: '',
  },
});

exports.sendEmailNotification = functions.firestore
  .document('animals/{animalId}')
  .onCreate(async (snapshot, context) => {
    const animalDetails = snapshot.data();
    const userEmails = ['@gmail.com'];

    const mailOptions = {
      from: '@gmail.com',
      subject: 'New Available Pet Notification',
      text: `A new pet is available! Details: ${JSON.stringify(animalDetails)}`,
    };

    try {
      for (const userEmail of userEmails) {
        mailOptions.to = userEmail;
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
      }
      return null;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return null;
    }
  });
