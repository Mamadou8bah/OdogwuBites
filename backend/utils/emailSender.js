const path = require('path');
const fs = require('fs');

const { transporter, smtpConfigSummary } = require('../config/emailConfig');

const DEFAULT_SEND_TIMEOUT_MS = Number.parseInt(
  process.env.EMAIL_SEND_TIMEOUT_MS || '60000',
  10
);

const EMAIL_DISABLED = (process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

class EmailSendError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'EmailSendError';
    this.details = details;
  }
}

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

let verifyOncePromise;
async function ensureTransporterReady() {
  if (EMAIL_DISABLED) return;
  if (!verifyOncePromise) {
    verifyOncePromise = transporter
      .verify()
      .catch((error) => {
        throw new EmailSendError('SMTP verification failed', {
          smtp: smtpConfigSummary,
          code: error?.code,
          message: error?.message,
          response: error?.response,
          command: error?.command,
        });
      });
  }
  return verifyOncePromise;
}

async function sendMailWithTimeout(mailOptions, timeoutMs = DEFAULT_SEND_TIMEOUT_MS) {
  if (EMAIL_DISABLED) {
    return {
      messageId: 'email-disabled',
      accepted: [mailOptions?.to].filter(Boolean),
      rejected: [],
    };
  }

  await ensureTransporterReady();

  const sendPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      reject(
        new EmailSendError(`Email send timed out after ${timeoutMs}ms`, {
          smtp: smtpConfigSummary,
          timeoutMs,
        })
      );
    }, timeoutMs);
    // best-effort: avoid keeping event loop alive if send finishes
    timer.unref?.();
  });

  // If the timeout wins the race, make sure the send promise doesn't become an unhandled rejection later.
  sendPromise.catch(() => {});

  let info;
  try {
    info = await Promise.race([sendPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof EmailSendError) throw error;
    throw new EmailSendError(error?.message || 'Email send failed', {
      smtp: smtpConfigSummary,
      code: error?.code,
      message: error?.message,
      response: error?.response,
      command: error?.command,
    });
  }

  if (info?.rejected?.length) {
    throw new EmailSendError(`Email rejected by SMTP server: ${info.rejected.join(', ')}`, {
      smtp: smtpConfigSummary,
      rejected: info.rejected,
    });
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

module.exports = { sendEmailVerificationEmail, sendPasswordResetEmail, EmailSendError };

