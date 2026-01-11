const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
let logoSrc = "";
const logoPath = path.join(__dirname, "logo.png");
if (fs.existsSync(logoPath)) {
  const base64 = fs.readFileSync(logoPath, "base64");
  logoSrc = `data:image/png;base64,${base64}`;
}

function renderTemplate(name, context) {
  const filePath = path.join(__dirname, `../emails/${name}.html`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template({ ...context, logoSrc });
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not set");
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
  });
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
