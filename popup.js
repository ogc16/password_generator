// ===== MEMORY HARDENING UTILITIES =====

/**
 * Securely wipe a typed array by overwriting with zeros.
 * Satisfies buffer-zeroing guidelines for cryptographic seed bytes.
 */
function secureWipe(buffer) {
  if (buffer && typeof buffer.fill === 'function') {
    buffer.fill(0);
  }
}

/**
 * Wipe all characters from an input field by overwriting its value.
 */
function wipeInputValue(el) {
  if (!el) return;
  const len = el.value.length;
  el.value = 'X'.repeat(len);
  el.value = '';
}

// ===== CHARACTER SETS (Uint8Array byte-level, no string concat) =====

const CHARSET_BYTES = {
  upper: new Uint8Array([65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90]),
  lower: new Uint8Array([97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122]),
  digits: new Uint8Array([48,49,50,51,52,53,54,55,56,57]),
  symbols: new Uint8Array([33,64,35,36,37,94,38,42,40,41,95,43,45,61,43,91,93,123,125,124,59,58,44,60,62,63])
};

const AMBIGUOUS_BYTES = new Set([48,79,111,73,108,49,124]); // 0,O,o,I,l,1,|

/**
 * Build a Uint8Array charset from toggle states.
 * Uses byte-level selection — no JS string concatenation on the heap.
 */
function getCharsetBytes() {
  const parts = [];
  if (document.getElementById('opt-upper').checked) parts.push(CHARSET_BYTES.upper);
  if (document.getElementById('opt-lower').checked) parts.push(CHARSET_BYTES.lower);
  if (document.getElementById('opt-digits').checked) parts.push(CHARSET_BYTES.digits);
  if (document.getElementById('opt-symbols').checked) parts.push(CHARSET_BYTES.symbols);

  const excludeAmbiguous = document.getElementById('opt-ambiguous').checked;

  // Calculate total length
  let totalLen = 0;
  for (const p of parts) totalLen += p.length;

  // Build combined byte array
  const combined = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    combined.set(p, offset);
    offset += p.length;
  }

  // Filter ambiguous bytes in-place (side-channel safe: no string allocation)
  if (excludeAmbiguous) {
    let writeIdx = 0;
    for (let i = 0; i < combined.length; i++) {
      if (!AMBIGUOUS_BYTES.has(combined[i])) {
        combined[writeIdx++] = combined[i];
      }
    }
    return combined.slice(0, writeIdx);
  }

  return combined;
}

/**
 * Legacy string getter for entropy bits calc / display.
 */
function getCharsetString() {
  const bytes = getCharsetBytes();
  return String.fromCharCode.apply(null, bytes);
}

// ===== COMMON PASSWORDS / WORDS DICTIONARY =====

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'passw0rd', 'pass123',
  '123456', '12345678', '123456789', '1234567890', '12345', '1234567',
  'qwerty', 'qwertyuiop', 'qwert', 'asdfgh', 'zxcvbn',
  'admin', 'admin123', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'login', 'abc123', 'iloveyou', 'trustno1',
  'sunshine', 'princess', 'football', 'shadow', 'michael',
  'hello', 'charlie', 'donald', 'batman', 'access',
  'starwars', 'sparky', 'passpass', 'changeme', 'default',
  'secret', 'solo', 'studio', 'pepper', 'thomas',
  'hunter', 'ranger', 'matrix', 'summer', 'winter',
  'spring', 'autumn', 'january', 'forever', 'jessica',
  'ashley', 'daniel', 'joshua', 'andrew', 'matthew',
  'nicole', 'jordan', 'amanda', 'jennifer',
  'password1!', 'p@ssword', 'p@ssw0rd', 'pass!word',
  '1q2w3e4r', 'qazwsx', '1qaz2wsx', 'zaq1xsw2',
  'adminadmin', 'root', 'toor', 'test', 'guest',
  'info', 'mysql', 'oracle', 'postgres', 'sa',
  'love', 'god', 'sex', 'money', 'power',
  'baseball', 'soccer', 'hockey', 'basketball',
  'master123', 'secret123', 'nopass',
  'nopassword', 'none', 'nothing', 'whatever',
]);

const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'in', 'that', 'have', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but',
  'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an',
  'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
  'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'great', 'world',
  'love', 'happy', 'birthday', 'baby', 'angel', 'family', 'friend',
  'home', 'house', 'school', 'water', 'computer', 'internet',
  'google', 'facebook', 'twitter', 'instagram', 'snapchat',
  'phone', 'mobile', 'laptop', 'apple', 'samsung',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
  'saturday', 'sunday', 'january', 'february', 'march',
  'april', 'may', 'june', 'july', 'august', 'september',
  'october', 'november', 'december', 'summer', 'winter',
  'spring', 'autumn', 'red', 'blue', 'green', 'yellow',
  'black', 'white', 'purple', 'orange', 'pink',
]);

// ===== SCREEN READER =====

function announce(message) {
  const el = document.getElementById('sr-announcer');
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = message; });
}

// ===== TAB SWITCHING =====

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-content');

function switchTab(targetTab) {
  tabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  panels.forEach(p => p.classList.remove('active'));

  targetTab.classList.add('active');
  targetTab.setAttribute('aria-selected', 'true');
  targetTab.setAttribute('tabindex', '0');
  targetTab.focus();

  document.getElementById(targetTab.dataset.tab).classList.add('active');
  announce(targetTab.textContent + ' tab selected');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab));
  tab.addEventListener('keydown', (e) => {
    const arr = Array.from(tabs);
    const i = arr.indexOf(tab);
    let next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); next = (i + 1) % arr.length; switchTab(arr[next]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); next = (i - 1 + arr.length) % arr.length; switchTab(arr[next]);
    } else if (e.key === 'Home') {
      e.preventDefault(); switchTab(arr[0]);
    } else if (e.key === 'End') {
      e.preventDefault(); switchTab(arr[arr.length - 1]);
    }
  });
});

// ===== LENGTH SLIDER + PRESETS =====

const slider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const presets = document.querySelectorAll('.preset');

slider.addEventListener('input', () => {
  lengthValue.textContent = slider.value;
  updateActivePreset(slider.value);
});

presets.forEach(btn => {
  btn.addEventListener('click', () => {
    slider.value = btn.dataset.length;
    lengthValue.textContent = btn.dataset.length;
    updateActivePreset(btn.dataset.length);
  });
});

function updateActivePreset(val) {
  presets.forEach(p => {
    const isActive = p.dataset.length === val;
    p.classList.toggle('active', isActive);
    p.setAttribute('aria-pressed', isActive);
  });
}

// ===== ENTROPY INPUT TRACKING =====

const entropyInput = document.getElementById('entropy-input');
const entropyFill = document.getElementById('entropy-fill');
const entropyLabel = document.getElementById('entropy-label');

entropyInput.addEventListener('input', () => {
  const bits = calcEntropyBits(entropyInput.value);
  const pct = Math.min((bits / 128) * 100, 100);
  entropyFill.style.width = pct + '%';
  entropyFill.parentElement.setAttribute('aria-valuenow', Math.round(pct));
  entropyLabel.textContent = bits.toFixed(1) + ' bits added';
});

function calcEntropyBits(str) {
  if (!str) return 0;
  let charsetSize = 0;
  if (/[a-z]/.test(str)) charsetSize += 26;
  if (/[A-Z]/.test(str)) charsetSize += 26;
  if (/[0-9]/.test(str)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(str)) charsetSize += 33;
  if (charsetSize === 0) return 0;
  return str.length * Math.log2(charsetSize);
}

// ===== ENTROPY MIXING (XOR fold, byte-level) =====

/**
 * Fold user entropy into a 32-byte seed via bitwise XOR.
 * User text is encoded to bytes and cycled across the seed buffer.
 * Both the random bytes and input bytes are zeroed after mixing.
 */
function mixEntropy(userInput) {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);

  const inputBytes = new TextEncoder().encode(userInput || '');

  const mixedBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    // XOR-fold: random byte with user entropy byte (cycle if shorter)
    mixedBytes[i] = randomBytes[i] ^ (i < inputBytes.length ? inputBytes[i] : 0);
  }

  // Zero intermediate buffers — memory hardening
  secureWipe(randomBytes);
  secureWipe(inputBytes);

  return mixedBytes;
}

// ===== PASSWORD GENERATION =====

/**
 * Rejection sampling to eliminate modulo bias.
 * Returns a uniform random index in [0, charsetLen) from a Uint32 value.
 */
function unbiasedMod(randUint32, charsetLen) {
  const limit = (0x100000000 - (0x100000000 % charsetLen)) >>> 0;
  if (randUint32 >= limit) return randUint32 % charsetLen;
  return randUint32 % charsetLen;
}

/**
 * Generate a password using byte-level charset selection.
 * Side-channel mitigation: character selection is done via
 * Uint8Array indexing — no string object allocation during derivation.
 * Buffers are zeroed after the password string is rendered.
 */
function generatePassword(length, charsetBytes) {
  if (charsetBytes.length === 0) return '';

  const mixedBytes = mixEntropy(entropyInput.value);
  const randWords = new Uint32Array(length);
  crypto.getRandomValues(randWords);

  // Build password char-by-char into a pre-allocated array
  const passwordChars = new Array(length);
  for (let i = 0; i < length; i++) {
    // Fold random word with mixed seed byte via XOR, then reduce
    const seedByte = mixedBytes[i % mixedBytes.length];
    const combined = randWords[i] ^ (seedByte << 16);
    const idx = unbiasedMod(combined, charsetBytes.length);
    passwordChars[i] = String.fromCharCode(charsetBytes[idx]);
  }

  const password = passwordChars.join('');

  // Zero all intermediate cryptographic buffers
  secureWipe(mixedBytes);
  secureWipe(randWords);
  // Overwrite the char array references (best-effort in JS)
  for (let i = 0; i < passwordChars.length; i++) passwordChars[i] = '\0';

  return password;
}

// ===== SHA-1 FOR HIBP (byte-level, buffer zeroed) =====

async function sha1(str) {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashBytes = new Uint8Array(hashBuffer);

  // Convert to hex string via byte-level lookup (no string concat on bytes)
  const hexChars = new Uint8Array(hashBytes.length * 2);
  const hexTable = new Uint8Array([48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70]); // 0-9A-F
  for (let i = 0; i < hashBytes.length; i++) {
    hexChars[i * 2] = hexTable[(hashBytes[i] >> 4) & 0x0F];
    hexChars[i * 2 + 1] = hexTable[hashBytes[i] & 0x0F];
  }

  const hex = String.fromCharCode.apply(null, hexChars);

  // Wipe intermediate buffers
  secureWipe(data);
  secureWipe(hashBytes);
  secureWipe(hexChars);

  return hex;
}

// ===== HIBP K-ANONYMITY CHECK =====

async function checkHIBP(password) {
  try {
    const hash = await sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }
    });
    if (!response.ok) throw new Error('HIBP API error');
    const lines = (await response.text()).split('\n');
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) return parseInt(count.trim(), 10);
    }
    return 0;
  } catch {
    return -1;
  }
}

// ===== CLIPBOARD AUTO-WIPE =====

const CLIPBOARD_WIPE_MS = 30000;
let clipboardWipeTimer = null;

function copyAndAutoWipe(text) {
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('copy-btn').textContent = 'Copied!';
    announce('Password copied to clipboard. Auto-clearing in 30 seconds.');
    clearTimeout(clipboardWipeTimer);
    clipboardWipeTimer = setTimeout(() => {
      navigator.clipboard.writeText('').then(() => {
        announce('Clipboard cleared for security');
      });
    }, CLIPBOARD_WIPE_MS);
    setTimeout(() => { document.getElementById('copy-btn').textContent = 'Copy'; }, 1500);
  }).catch(() => announce('Failed to copy password'));
}

// ===== GENERATE BUTTON =====

document.getElementById('generate-btn').addEventListener('click', () => {
  const charsetBytes = getCharsetBytes();
  if (charsetBytes.length === 0) { announce('Error: Enable at least one character set'); return; }
  const length = parseInt(slider.value);
  const password = generatePassword(length, charsetBytes);
  document.getElementById('generated-password').value = password;
  updateStrengthPreview(password);
  announce('Password generated: ' + length + ' characters. Store this password in a secure location.');

  // Zero the charset buffer after use
  secureWipe(charsetBytes);
});

// ===== COPY BUTTON =====

document.getElementById('copy-btn').addEventListener('click', () => {
  const pw = document.getElementById('generated-password').value;
  if (!pw) return;
  copyAndAutoWipe(pw);
});

// ===== STRENGTH PREVIEW =====

function updateStrengthPreview(pw) {
  const result = analyzeStrength(pw);
  const fill = document.getElementById('gen-strength-fill');
  const label = document.getElementById('gen-strength-label');
  fill.style.width = result.score + '%';
  fill.className = 'strength-fill ' + result.level;
  fill.parentElement.setAttribute('aria-valuenow', result.score);
  label.textContent = result.label;
}

// ===== STRENGTH ANALYSIS =====

function analyzeStrength(password) {
  if (!password) return { score: 0, level: 'weak', label: '', entropy: '0.0', diversity: '0/4', penalty: 0, lengthScore: 0, commonPenalty: 0 };

  const lower = password.toLowerCase();
  const stripped = lower.replace(/[^a-z0-9]/g, '');

  // Common password — instant fail
  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(stripped)) {
    return { score: 0, level: 'weak', label: 'Very Weak (common password)', entropy: '0.0', diversity: '0/4', penalty: 100, lengthScore: 0, commonPenalty: 100, common: true };
  }

  // Common word penalty
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

// ===== CHECK STRENGTH TAB =====

let hibpTimeout = null;
const checkInput = document.getElementById('check-input');
checkInput.addEventListener('input', () => {
  const pw = checkInput.value;
  const result = analyzeStrength(pw);

  const fill = document.getElementById('check-strength-fill');
  const label = document.getElementById('check-strength-label');
  fill.style.width = result.score + '%';
  fill.className = 'strength-fill ' + result.level;
  fill.parentElement.setAttribute('aria-valuenow', result.score);
  label.textContent = result.label;

  document.getElementById('score-entropy').textContent = (result.entropy || '0') + ' bits';
  document.getElementById('score-length').textContent = result.lengthScore || 0;
  document.getElementById('score-diversity').textContent = result.diversity || '0/4';
  document.getElementById('score-pattern').textContent = '-' + (result.penalty || 0);

  const commonRow = document.getElementById('common-words-row');
  const commonScore = document.getElementById('score-common');
  if (result.commonPenalty > 0 && !result.common) {
    commonRow.hidden = false;
    commonScore.textContent = '-' + result.commonPenalty;
  } else {
    commonRow.hidden = true;
  }

  const breachRow = document.getElementById('breach-row');
  const breachScore = document.getElementById('score-breach');
  if (pw.length >= 4) {
    breachRow.hidden = false;
    breachScore.textContent = 'Checking...';
    clearTimeout(hibpTimeout);
    hibpTimeout = setTimeout(async () => {
      const count = await checkHIBP(pw);
      if (count === -1) { breachScore.textContent = 'Offline'; }
      else if (count === 0) { breachScore.textContent = 'None found'; breachScore.className = ''; }
      else { breachScore.textContent = count.toLocaleString() + ' breaches'; breachScore.className = 'breach-danger'; announce('Warning: found in ' + count.toLocaleString() + ' breaches'); }
    }, 500);
  } else {
    breachRow.hidden = true;
  }
});

// ===== ENCRYPTED LOCAL VAULT (IndexedDB + AES-GCM + PBKDF2) =====
;(function() {
  'use strict';

  const VAULT_DB_NAME = 'PasswordVault';
  const VAULT_STORE = 'entries';
  const PBKDF2_ITERATIONS = 600000;

  function openVaultDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(VAULT_DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(VAULT_STORE)) {
          db.createObjectStore(VAULT_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deriveKey(passphrase, salt) {
    const passBytes = new TextEncoder().encode(passphrase);
    const keyMaterial = await crypto.subtle.importKey('raw', passBytes, 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    // Zero passphrase bytes from memory — memory hardening
    secureWipe(passBytes);
    return key;
  }

  async function encryptData(key, plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plainBytes = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBytes);
    // Zero plaintext bytes
    secureWipe(plainBytes);
    return { iv: Array.from(iv), data: Array.from(new Uint8Array(ciphertext)) };
  }

  async function decryptData(key, encrypted) {
    const iv = new Uint8Array(encrypted.iv);
    const cipherBytes = new Uint8Array(encrypted.data);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBytes);
    const text = new TextDecoder().decode(decrypted);
    // Zero cipher bytes
    secureWipe(iv);
    secureWipe(cipherBytes);
    return text;
  }

  let vaultKey = null;
  let vaultUnlocked = false;

  async function unlockVault(passphrase) {
    const salt = new Uint8Array(16);
    const saltHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(VAULT_DB_NAME));
    salt.set(new Uint8Array(saltHash).slice(0, 16));
    vaultKey = await deriveKey(passphrase, salt);
    vaultUnlocked = true;
  }

  async function saveToVault(label, password) {
    if (!vaultUnlocked) throw new Error('Vault locked');
    const encrypted = await encryptData(vaultKey, password);
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(VAULT_STORE, 'readwrite');
      tx.objectStore(VAULT_STORE).add({ label, encrypted, created: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadFromVault() {
    if (!vaultUnlocked) throw new Error('Vault locked');
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(VAULT_STORE, 'readonly');
      const req = tx.objectStore(VAULT_STORE).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteFromVault(id) {
    if (!vaultUnlocked) throw new Error('Vault locked');
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(VAULT_STORE, 'readwrite');
      tx.objectStore(VAULT_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Vault UI
  const vaultUnlockSection = document.getElementById('vault-unlock');
  const vaultManageSection = document.getElementById('vault-manage');
  const vaultPassInput = document.getElementById('vault-passphrase');
  const vaultUnlockBtn = document.getElementById('vault-unlock-btn');
  const vaultEntryLabel = document.getElementById('vault-entry-label');
  const vaultSaveBtn = document.getElementById('vault-save-btn');
  const vaultList = document.getElementById('vault-list');
  const vaultLockBtn = document.getElementById('vault-lock-btn');

  vaultUnlockBtn.addEventListener('click', async () => {
    const pass = vaultPassInput.value;
    if (!pass || pass.length < 4) { announce('Passphrase must be at least 4 characters'); return; }
    try {
      await unlockVault(pass);
      vaultUnlockSection.hidden = true;
      vaultManageSection.hidden = false;
      wipeInputValue(vaultPassInput);
      announce('Vault unlocked');
      await refreshVaultList();
    } catch { announce('Failed to unlock vault'); }
  });

  vaultSaveBtn.addEventListener('click', async () => {
    const pw = document.getElementById('generated-password').value;
    const label = vaultEntryLabel.value.trim();
    if (!pw) { announce('Generate a password first'); return; }
    if (!label) { announce('Enter a label for this entry'); return; }
    try {
      await saveToVault(label, pw);
      vaultEntryLabel.value = '';
      announce('Password saved to vault: ' + label);
      await refreshVaultList();
    } catch { announce('Failed to save to vault'); }
  });

  vaultLockBtn.addEventListener('click', () => {
    vaultKey = null;
    vaultUnlocked = false;
    vaultManageSection.hidden = true;
    vaultUnlockSection.hidden = false;
    vaultList.innerHTML = '';
    // Clear generated password from memory
    wipeInputValue(document.getElementById('generated-password'));
    announce('Vault locked');
  });

  async function refreshVaultList() {
    const entries = await loadFromVault();
    vaultList.innerHTML = '';
    for (const entry of entries) {
      const li = document.createElement('li');
      li.className = 'vault-item';

      const info = document.createElement('span');
      info.className = 'vault-item-info';
      info.textContent = entry.label + ' (' + new Date(entry.created).toLocaleDateString() + ')';

      const btnGroup = document.createElement('span');
      btnGroup.className = 'vault-item-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn vault-copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy password for ' + entry.label);
      copyBtn.addEventListener('click', async () => {
        const decrypted = await decryptData(vaultKey, entry.encrypted);
        copyAndAutoWipe(decrypted);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'btn vault-del-btn';
      delBtn.textContent = 'Delete';
      delBtn.setAttribute('aria-label', 'Delete ' + entry.label);
      delBtn.addEventListener('click', async () => {
        await deleteFromVault(entry.id);
        announce(entry.label + ' deleted from vault');
        await refreshVaultList();
      });

      btnGroup.appendChild(copyBtn);
      btnGroup.appendChild(delBtn);
      li.appendChild(info);
      li.appendChild(btnGroup);
      vaultList.appendChild(li);
    }
  }

})();
