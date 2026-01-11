const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { transporter } = require("../config/emailConfig");

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

function renderTemplate(name, context) {
  const filePath = path.join(__dirname, `../emails/${name}.html`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template(context);
}

async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: FROM,
    to,
    subject,
    html,
    text,
  };

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
  const context = { name, link };
  const html = renderTemplate("verification", context);
  const text = `Hello ${name}! Welcome to OdogwuBites. Please verify your email by clicking this link: ${link}`;
  
  return sendEmail({
    to,
    subject: "Verify your email",
    html,
    text,
  });
}

async function sendPasswordResetEmail(to, name, link) {
  const context = { name, link };
  const html = renderTemplate("reset", context);
  const text = `Hello ${name}! You requested a password reset. Please use this link: ${link}. If you didn't request this, please ignore this email.`;
  
  return sendEmail({
    to,
    subject: "Reset your password",
    html,
    text,
  });
}

module.exports = {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
};
