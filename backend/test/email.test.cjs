const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, response } = require('./helpers.cjs');

test('email config imports without a key and delivery fails explicitly without constructing Resend', async () => {
  const config = load('config/emailConfig.js', {
    resend: { Resend: class { constructor() { throw new Error('Must not construct provider'); } } },
  });
  assert.equal(config.smtpConfigSummary.available, false);
  await assert.rejects(config.transporter.sendMail({}), error =>
    error.code === 'EMAIL_UNAVAILABLE' && error.statusCode === 503);
});

test('installed Resend and Handlebars load without a key; rendered email fails locally without a network call', async () => {
  const config = load('config/emailConfig.js');
  const sender = load('utils/emailSender.js', { '../config/emailConfig': config });
  await assert.rejects(sender.sendEmailVerificationEmail('nobody@example.test', 'Test', 'http://localhost:3000/auth/verify-email'),
    error => error.code === 'EMAIL_UNAVAILABLE' && error.statusCode === 503);
});

test('configured email delivery reports success only after mocked provider acceptance', async () => {
  let sent = false;
  const config = load('config/emailConfig.js', {
    resend: { Resend: class { emails = { async send() { sent = true; return { data: { id: 'test-id' } }; } }; } },
  }, { RESEND_API_KEY: 'test-placeholder' });
  const result = await config.transporter.sendMail({ to: 'nobody@example.test' });
  assert.equal(sent, true);
  assert.equal(result.messageId, 'test-id');
});

test('provider rejection is never reported as successful delivery', async () => {
  const config = load('config/emailConfig.js', {
    resend: { Resend: class { emails = { async send() { return { error: { message: 'Rejected' } }; } }; } },
  }, { RESEND_API_KEY: 'test-placeholder' });
  await assert.rejects(config.transporter.sendMail({}), /Rejected/);
});

function authFixture() {
  const user = { _id: 'test-user', name: 'Test', email: 'nobody@example.test', verified: false,
    password: 'original', async save() {} };
  const unavailable = Object.assign(new Error('Email delivery is unavailable: email provider is not configured.'),
    { code: 'EMAIL_UNAVAILABLE', statusCode: 503 });
  class User {
    constructor(data) { Object.assign(this, user, data); }
    static async findOne(query) { return query.email === 'new@example.test' ? null : user; }
  }
  const auth = load('controller/authentication.js', {
    '../model/Users': User,
    bcryptjs: { async hash() { return 'hashed'; } },
    '../controller/verificationToken': { async createToken() { return 'test-verification'; } },
    '../controller/resetToken': { async createResetToken() { return 'test-reset'; },
      async findResetTokenByToken() { return null; } },
    '../controller/cart': {},
    '../utils/emailSender': {
      async sendEmailVerificationEmail() { throw unavailable; },
      async sendPasswordResetEmail() { throw unavailable; },
    },
  }, { NODE_ENV: 'production' });
  return { auth, user };
}

test('registration reports failed delivery and does not verify the account', async () => {
  const { auth, user } = authFixture(); const res = response();
  await auth.register({ body: { name: 'Test', address: 'Test', phone: '123',
    password: 'test-password', email: 'new@example.test' } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.emailSent, false);
  assert.match(res.body.message, /couldn't send/);
  assert.equal(user.verified, false);
  assert.equal(res.body.verificationLink, undefined);
});

test('unavailable reset delivery returns 503 and never changes the password or exposes a token', async () => {
  const { auth, user } = authFixture(); const res = response();
  await auth.requestPasswordReset({ body: { email: user.email } }, res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.message, /unavailable/);
  assert.equal(user.password, 'original');
  assert.ok(!JSON.stringify(res.body).includes('test-reset'));
});

test('reset still requires a valid token', async () => {
  const { auth, user } = authFixture(); const res = response();
  await auth.resetPassword({ query: { email: user.email, token: 'invalid' }, body: { newPassword: 'changed' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(user.password, 'original');
});
