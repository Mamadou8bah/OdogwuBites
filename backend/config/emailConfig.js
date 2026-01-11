const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config();

const enableDebug = process.env.SMTP_DEBUG === 'true';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number.parseInt(process.env.SMTP_PORT || '465', 10),
  secure: (process.env.SMTP_SECURE || 'true') === 'true',
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.USER_PASSWORD,
  },
  // Reduce latency for subsequent sends by keeping connections open.
  pool: true,
  maxConnections: Number.parseInt(process.env.SMTP_MAX_CONNECTIONS || '3', 10),
  maxMessages: Number.parseInt(process.env.SMTP_MAX_MESSAGES || '50', 10),
  // Prevent requests hanging forever in production.
  connectionTimeout: Number.parseInt(process.env.SMTP_CONNECTION_TIMEOUT_MS || '10000', 10),
  greetingTimeout: Number.parseInt(process.env.SMTP_GREETING_TIMEOUT_MS || '10000', 10),
  socketTimeout: Number.parseInt(process.env.SMTP_SOCKET_TIMEOUT_MS || '15000', 10),
  logger: enableDebug,
  debug: enableDebug,
});

const viewPath = path.resolve(__dirname, '../emails');

const handlebarOptions = {
  viewEngine: {
    extname: '.html',
    partialsDir: viewPath,
    layoutsDir: viewPath,
    defaultLayout: false,
  },
  viewPath,
  extName: '.html',
};

// Some bundlers / environments expose the plugin differently.
try {
  const hbsPlugin = typeof hbs === 'function' ? hbs : hbs?.default;
  if (!hbsPlugin) {
    throw new Error('nodemailer-express-handlebars plugin not found');
  }
  transporter.use('compile', hbsPlugin(handlebarOptions));
} catch (error) {
  // Fail fast in dev; in prod we still want SMTP available even if templates break.
  if (process.env.NODE_ENV !== 'production') {
    throw error;
  }
  console.error('Email template setup failed:', error?.message || error);
}

module.exports = { transporter };
