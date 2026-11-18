const fs = require('node:fs');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const path = require('node:path');

// Isolate environment and dependencies: tests never load .env or connect providers/DB.
function load(relativePath, stubs = {}, env = {}) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const localRequire = createRequire(filename);
  const module = { exports: {} };
  const context = {
    module, exports: module.exports, __dirname: path.dirname(filename),
    process: { env }, console: { log() {}, error() {} },
    require(name) {
      if (name === 'dotenv') return { config() {} };
      return Object.hasOwn(stubs, name) ? stubs[name] : localRequire(name);
    },
  };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return module.exports;
}

function response() {
  return {
    statusCode: 200,
    status(value) { this.statusCode = value; return this; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
  };
}

module.exports = { load, response };
