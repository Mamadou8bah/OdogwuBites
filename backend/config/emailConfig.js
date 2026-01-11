const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.USER_PASSWORD,
  },
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
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

transporter.use('compile', hbs.default(handlebarOptions));

module.exports = { transporter };
