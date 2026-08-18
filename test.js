// Tests for password generator core logic
const assert = require('assert');

// Extract pure functions from popup.js logic for testing
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'passw0rd',
  '123456', '12345678', 'qwerty', 'admin', 'letmein',
  'welcome', 'monkey', 'dragon', 'master', 'login',
  'abc123', 'iloveyou', 'trustno1', 'sunshine',
]);

const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'in', 'that', 'have',
  'love', 'happy', 'birthday', 'baby', 'angel', 'family',
  'home', 'house', 'school', 'water', 'computer', 'internet',
]);

function analyzeStrength(password) {
  if (!password) return { score: 0, level: 'weak', label: '' };

  const lower = password.toLowerCase();
  const stripped = lower.replace(/[^a-z0-9]/g, '');

  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(stripped)) {
    return { score: 0, level: 'weak', label: 'Very Weak (common password)', common: true };
  }

  let commonPenalty = 0;
  for (const word of COMMON_WORDS) {
    if (word.length >= 3 && lower.includes(word)) commonPenalty += 15;
  }

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;

  const entropy = password.length * Math.log2(charsetSize || 1);
  const lengthScore = Math.min(password.length * 2, 30);

  let diversity = 0;
  if (/[a-z]/.test(password)) diversity++;
  if (/[A-Z]/.test(password)) diversity++;
  if (/[0-9]/.test(password)) diversity++;
  if (/[^a-zA-Z0-9]/.test(password)) diversity++;
  const diversityScore = diversity * 5;

  let penalty = 0;
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i), c2 = password.charCodeAt(i + 1), c3 = password.charCodeAt(i + 2);
    if (c2 - c1 === 1 && c3 - c2 === 1) penalty += 5;
    if (c1 - c2 === 1 && c2 - c3 === 1) penalty += 5;
  }
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) penalty += 8;
  }
  const keyboardWalks = ['qwerty', 'asdf', 'zxcv', 'qazwsx'];
  for (const walk of keyboardWalks) {
    if (lower.includes(walk)) penalty += 10;
  }

  const entropyScore = Math.min(entropy / 2, 50);
  const rawScore = entropyScore + lengthScore + diversityScore - penalty - commonPenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  let level, label;
  if (score < 20) { level = 'weak'; label = 'Weak'; }
  else if (score < 40) { level = 'fair'; label = 'Fair'; }
  else if (score < 65) { level = 'strong'; label = 'Strong'; }
  else { level = 'very-strong'; label = 'Very Strong'; }

  return { score, level, label, entropy: entropy.toFixed(1), diversity: diversity + '/4', penalty, lengthScore, commonPenalty };
}

// Tests
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } catch (e) {
    failed++;
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    ${e.message}`);
  }
}

console.log('\nPassword Strength Analyzer Tests\n');

// Common password detection
test('detects "password" as common', () => {
  const r = analyzeStrength('password');
  assert.strictEqual(r.score, 0);
  assert.strictEqual(r.common, true);
});

test('detects "123456" as common', () => {
  const r = analyzeStrength('123456');
  assert.strictEqual(r.score, 0);
});

test('detects "qwerty" as common', () => {
  const r = analyzeStrength('qwerty');
  assert.strictEqual(r.score, 0);
});

test('detects "password123" as common', () => {
  const r = analyzeStrength('password123');
  assert.strictEqual(r.score, 0);
});

// Common word penalties
test('penalizes passwords containing common words', () => {
  const r = analyzeStrength('myHappyBaby99!');
  assert.ok(r.commonPenalty > 0, 'Expected commonPenalty > 0');
});

// Strong password
test('recognizes strong random passwords', () => {
  const r = analyzeStrength('xK9$mN2@pL5!qR8');
  assert.ok(r.score >= 40, `Expected score >= 40, got ${r.score}`);
});

// Pattern detection
test('penalizes sequential characters (abc)', () => {
  const r1 = analyzeStrength('abc');
  const r2 = analyzeStrength('axc');
  assert.ok(r1.penalty > r2.penalty, 'Sequential should have higher penalty');
});

test('penalizes repeated characters (aaa)', () => {
  const r1 = analyzeStrength('aaa');
  const r2 = analyzeStrength('axa');
  assert.ok(r1.penalty > r2.penalty, 'Repeated should have higher penalty');
});

test('penalizes keyboard walks (qwerty)', () => {
  const r = analyzeStrength('qwerty123');
  assert.ok(r.penalty >= 10, 'Expected keyboard walk penalty');
});

// Empty input
test('returns zero score for empty string', () => {
  const r = analyzeStrength('');
  assert.strictEqual(r.score, 0);
});

// Diversity scoring
test('rewards character diversity', () => {
  const r1 = analyzeStrength('abcdefgh');
  const r2 = analyzeStrength('Abcdefg1!');
  assert.ok(r2.score > r1.score, 'More diverse should score higher');
});

// Length scoring
test('longer passwords get higher length scores', () => {
  const r1 = analyzeStrength('abc');
  const r2 = analyzeStrength('abcdefghijklmnop');
  assert.ok(r2.lengthScore > r1.lengthScore, 'Longer should have higher length score');
});

console.log(`\n  \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m\n`);

if (failed > 0) process.exit(1);
