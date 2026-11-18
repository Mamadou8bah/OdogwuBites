const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, response } = require('./helpers.cjs');

function fixture(configured = false, status = 'pending', transactionId = 'test-transaction') {
  const calls = [];
  const user = { balance: 10, async save() { calls.push('user.save'); } };
  const payment = { amount: 25, transactionId, paymentStatus: 'Pending',
    async save() { calls.push('payment.save'); } };
  const controller = load('controller/payment.js', {
    'modem-pay': class {
      paymentIntents = {
        async create() { calls.push('provider.create'); throw new Error('Unexpected payment initiation'); },
        async retrieve() { calls.push('provider.retrieve'); return { data: { status } }; },
      };
    },
    '../model/Users': { async findById() { calls.push('user.find'); return user; } },
    '../model/Payments': {
      findOne() { calls.push('payment.find'); return { async sort() { return payment; } }; },
      async findById() { calls.push('payment.find'); return payment; },
      async create() { calls.push('payment.create'); },
    },
  }, configured ? { MODEM_PAY_SECRET_KEY: 'test-placeholder' } : {});
  return { controller, calls, user, payment };
}

for (const handler of ['deposit', 'verifyDeposit', 'confirmPayment']) {
  test(`${handler}: missing configuration returns 503 before any DB/provider access`, async () => {
    const f = fixture(); const res = response();
    await f.controller[handler]({ user: { _id: '507f1f77bcf86cd799439011' },
      body: { amount: 25 }, query: { userId: '507f1f77bcf86cd799439011', amount: '25' },
      params: { paymentId: '507f1f77bcf86cd799439012' } }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.body.message, /unavailable/i);
    assert.deepEqual(f.calls, []);
    assert.equal(f.user.balance, 10);
    assert.equal(f.payment.paymentStatus, 'Pending');
  });
}

for (const amount of [0, -1, '25', 'abc', Infinity, NaN, {}, []]) {
  test(`deposit rejects invalid amount ${String(amount)} without provider or DB access`, async () => {
    const f = fixture(true); const res = response();
    await f.controller.deposit({ user: { _id: 'test-user' }, body: { amount } }, res);
    assert.equal(res.statusCode, 400);
    assert.deepEqual(f.calls, []);
  });
}

test('verification rejects missing transaction instead of completing a payment', async () => {
  const f = fixture(true, 'paid', ''); const res = response();
  await f.controller.verifyDeposit({ query: { userId: '507f1f77bcf86cd799439011', amount: '25' } }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(f.user.balance, 10);
  assert.equal(f.payment.paymentStatus, 'Pending');
  assert.ok(!f.calls.some(c => c.endsWith('.save') || c.startsWith('provider.')));
});

test('unverified provider status never credits a wallet', async () => {
  const f = fixture(true); const res = response();
  await f.controller.verifyDeposit({ query: { userId: '507f1f77bcf86cd799439011', amount: '25' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(f.user.balance, 10);
  assert.equal(f.payment.paymentStatus, 'Pending');
  assert.ok(f.calls.includes('provider.retrieve'));
  assert.ok(!f.calls.some(c => c.endsWith('.save')));
});

test('a verified provider result preserves the intended credit flow (mocked only)', async () => {
  const f = fixture(true, 'paid'); const res = response();
  await f.controller.verifyDeposit({ query: { userId: '507f1f77bcf86cd799439011', amount: '25' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(f.user.balance, 35);
  assert.equal(f.payment.paymentStatus, 'Completed');
  assert.ok(f.calls.indexOf('provider.retrieve') < f.calls.indexOf('payment.save'));
});

test('deposit route requires JWT authentication before reaching its controller', async () => {
  let reached = false;
  const { isLoggedIn, isAdmin } = load('middleware/authMiddleware.js', {
    '../model/Users': { findById() { throw new Error('Unexpected database access'); } },
  });
  const router = load('route/payment.js', {
    '../controller/payment': Object.fromEntries(['deposit', 'verifyDeposit', 'getAllPayments',
      'getUserPayments', 'confirmPayment'].map(name => [name, () => { reached = true; }])),
    '../middleware/authMiddleware': { isLoggedIn, isAdmin },
  });
  const route = router.stack.find(layer => layer.route?.path === '/deposit').route;
  assert.equal(route.methods.post, true);
  const res = response();
  await route.stack[0].handle({ headers: {} }, res, () => route.stack[1].handle());
  assert.equal(res.statusCode, 401);
  assert.equal(reached, false);
});
