#!/usr/bin/env node
/**
 * Creates or updates the single admin account.
 *
 * Run it yourself: `npm run admin:password`. The password is read from the
 * terminal with echo turned off, hashed with scrypt, and only the salt and
 * derived key are written to the database (or server/data/content.json). The plaintext is never
 * stored, printed or passed as an argument (which would leave it in shell
 * history and the process list).
 */
import '../server/env.js';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';
import { hashPassword } from '../server/auth.js';
import { getAdmin, setAdmin } from '../server/store.js';

function ask(question) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  return new Promise((resolve) => rl.question(question, (answer) => (rl.close(), resolve(answer))));
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: stdin, output: stdout, terminal: true });
    // Swallow the echoed characters while the answer is being typed.
    const onWrite = (chunk, encoding, callback) => {
      if (!rl.__muted) stdout.write(chunk, encoding);
      if (callback) callback();
    };
    rl._writeToOutput = (text) => onWrite(rl.__muted ? '' : text);

    stdout.write(question);
    rl.__muted = true;
    rl.question('', (answer) => {
      rl.__muted = false;
      stdout.write('\n');
      rl.close();
      resolve(answer);
    });
    rl.on('error', reject);
  });
}

const existing = await getAdmin();
if (existing) {
  console.log(`Updating the existing admin account "${existing.username}".`);
} else {
  console.log('Creating the admin account.');
}

const username = (await ask(`Username${existing ? ` [${existing.username}]` : ''}: `)).trim()
  || existing?.username;

if (!username) {
  console.error('A username is required.');
  process.exit(1);
}

const password = await askHidden('Password (not shown): ');
if (password.length < 14) {
  console.error('Use at least 14 characters.');
  process.exit(1);
}

const confirm = await askHidden('Confirm password: ');
if (password !== confirm) {
  console.error('The two passwords did not match.');
  process.exit(1);
}

await setAdmin({ username, ...hashPassword(password) });
console.log(`\nSaved. Sign in at /admin as "${username}".`);
