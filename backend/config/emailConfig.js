const { Resend } = require('resend');
require('dotenv').config();

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || 'onboarding@resend.dev';

const resend = new Resend(resendApiKey);

// Create a transporter-like object that mimics nodemailer interface
const transporter = {
  sendMail: async (mailOptions) => {
    try {
      const response = await resend.emails.send({
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to send email via Resend');
      }
      
      return {
        messageId: response.data.id,
      };
    } catch (error) {
      throw error;
    }
  }
};

const smtpConfigSummary = {
  provider: 'Resend',
  from: resendFrom,
};

module.exports = { transporter };
module.exports.smtpConfigSummary = smtpConfigSummary;
