const { Resend } = require('resend');
require('dotenv').config();

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFrom = process.env.RESEND_FROM || 'onboarding@resend.dev';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const transporter = {
  sendMail: async (mailOptions) => {
    if (!resend) {
      const error = new Error('Email delivery is unavailable: email provider is not configured.');
      error.code = 'EMAIL_UNAVAILABLE';
      error.statusCode = 503;
      throw error;
    }
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
  available: Boolean(resend),
  from: resendFrom,
};

module.exports = { transporter };
module.exports.smtpConfigSummary = smtpConfigSummary;
