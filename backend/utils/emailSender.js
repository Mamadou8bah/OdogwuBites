const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { transporter } = require("../config/emailConfig");

const FROM = process.env.SMTP_FROM || process.env.USER_NAME || "onboarding@resend.dev";
const logoPath = path.join(__dirname, "logo.png");

function renderTemplate(name, context) {
  const filePath = path.join(__dirname, `../emails/${name}.html`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  // We use cid:logo so the image is embedded in the email
  return template({ ...context, logoSrc: "cid:logo" });
}

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: FROM,
    to,
    subject,
    html,
    attachments: []
  };

  if (fs.existsSync(logoPath)) {
    mailOptions.attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'logo' // matches logoSrc in template
    });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email delivery error:", error);
    throw new Error(error.message || "Email delivery failed");
  }
}

async function sendEmailVerificationEmail(to, name, link) {
  const html = renderTemplate("verification", { name, link });
  return sendEmail({
    to,
    subject: "Verify your email",
    html,
  });
}

async function sendPasswordResetEmail(to, name, link) {
  const html = renderTemplate("reset", { name, link });
  return sendEmail({
    to,
    subject: "Reset your password",
    html,
  });
}

module.exports = {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
};
