const path = require('path');
const fs = require('fs');

const { transporter } = require('../config/emailConfig');

const DEFAULT_SEND_TIMEOUT_MS = Number.parseInt(
  process.env.EMAIL_SEND_TIMEOUT_MS || '15000',
  10
);

function getFromAddress() {
  // Gmail and most SMTP providers behave much better when `from` contains a real mailbox.
  // Allow overriding via env for deployments.
  const mailbox = process.env.MAIL_FROM || process.env.USER_NAME;
  if (!mailbox) return 'Odogwu Bites';
  return `"Odogwu Bites" <${mailbox}>`;
}

function getLogoAttachment() {
  const logoPath = path.join(__dirname, 'logo.png');
  if (!fs.existsSync(logoPath)) return [];
  return [
    {
      filename: 'logo.png',
      path: logoPath,
      cid: 'logo',
    },
  ];
}

async function sendMailWithTimeout(mailOptions, timeoutMs = DEFAULT_SEND_TIMEOUT_MS) {
  const sendPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Email send timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    // best-effort: avoid keeping event loop alive if send finishes
    timer.unref?.();
  });

  const info = await Promise.race([sendPromise, timeoutPromise]);
  if (info?.rejected?.length) {
    throw new Error(`Email rejected by SMTP server: ${info.rejected.join(', ')}`);
  }
  return info;
}

const sendEmailVerificationEmail = async (to, name, link) => {
  const info = await sendMailWithTimeout({
    from: getFromAddress(),
    to,
    subject: 'Verify your Email!',
    template: 'verification',
    context: {
      name,
      link,
    },
    attachments: getLogoAttachment(),
  });

  return info;
};

const sendPasswordResetEmail = async (to, name, link) => {
  const info = await sendMailWithTimeout({
    from: getFromAddress(),
    to,
    subject: 'Reset Your password',
    template: 'reset',
    context: {
      name,
      link,
    },
    attachments: getLogoAttachment(),
  });

  return info;
};

module.exports = { sendEmailVerificationEmail, sendPasswordResetEmail };

