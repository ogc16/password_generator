// Character sets
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const AMBIGUOUS = /[0OoIl1I|]/g;

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Length slider + presets
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
    p.classList.toggle('active', p.dataset.length === val);
  });
}

// Entropy input tracking
const entropyInput = document.getElementById('entropy-input');
const entropyFill = document.getElementById('entropy-fill');
const entropyLabel = document.getElementById('entropy-label');

entropyInput.addEventListener('input', () => {
  const bits = calcEntropyBits(entropyInput.value);
  const pct = Math.min((bits / 128) * 100, 100);
  entropyFill.style.width = pct + '%';
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

// Build charset from toggles
function getCharset() {
  let chars = '';
  if (document.getElementById('opt-upper').checked) chars += CHARS.upper;
  if (document.getElementById('opt-lower').checked) chars += CHARS.lower;
  if (document.getElementById('opt-digits').checked) chars += CHARS.digits;
  if (document.getElementById('opt-symbols').checked) chars += CHARS.symbols;

  if (document.getElementById('opt-ambiguous').checked) {
    chars = chars.replace(AMBIGUOUS, '');
  }

  return chars;
}

// Mix user input with crypto random to produce seed
function mixEntropy(userInput) {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);

  const encoder = new TextEncoder();
  const inputBytes = encoder.encode(userInput || '');

  const mixed = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    const inputByte = i < inputBytes.length ? inputBytes[i] : 0;
    mixed[i] = randomBytes[i] ^ inputByte;
  }

  // Simple hash mixing (not cryptographic, but adds diffusion)
  let hash = 0;
  for (let i = 0; i < mixed.length; i++) {
    hash = ((hash << 5) - hash + mixed[i]) | 0;
  }

  return { mixed, hash };
}

// Generate password using Fisher-Yates with mixed entropy
function generatePassword(length, charset) {
  if (charset.length === 0) return '';

  const userInput = entropyInput.value;
  const { mixed } = mixEntropy(userInput);

  // Use mixed bytes as seed for selection
  const password = [];
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    // Mix crypto random with entropy bytes
    const entropyByte = mixed[i % mixed.length];
    const combined = (array[i] + entropyByte) % charset.length;
    password.push(charset[combined]);
  }

  return password.join('');
}

// Generate button
document.getElementById('generate-btn').addEventListener('click', () => {
  const charset = getCharset();
  if (charset.length === 0) {
    alert('Enable at least one character set');
    return;
  }

  const length = parseInt(slider.value);
  const password = generatePassword(length, charset);

  document.getElementById('generated-password').value = password;
  updateStrengthPreview(password);
});

// Copy button
document.getElementById('copy-btn').addEventListener('click', () => {
  const pw = document.getElementById('generated-password').value;
  if (!pw) return;

  navigator.clipboard.writeText(pw).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 1500);
  });
});

// Strength preview for generated password
function updateStrengthPreview(pw) {
  const result = analyzeStrength(pw);
  const fill = document.getElementById('gen-strength-fill');
  const label = document.getElementById('gen-strength-label');

  fill.style.width = result.score + '%';
  fill.className = 'strength-fill ' + result.level;
  label.textContent = result.label;
}

// Password strength analysis (entropy + pattern detection)
function analyzeStrength(password) {
  if (!password) return { score: 0, level: 'weak', label: '' };

  // 1. Character set size
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;

  // 2. Base entropy
  const entropy = password.length * Math.log2(charsetSize || 1);

  // 3. Length score (0-30 points)
  const lengthScore = Math.min(password.length * 2, 30);

  // 4. Character diversity (0-20 points)
  let diversity = 0;
  if (/[a-z]/.test(password)) diversity++;
  if (/[A-Z]/.test(password)) diversity++;
  if (/[0-9]/.test(password)) diversity++;
  if (/[^a-zA-Z0-9]/.test(password)) diversity++;
  const diversityScore = diversity * 5;

  // 5. Pattern penalties
  let penalty = 0;

  // Sequential patterns (abc, 123, xyz)
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    if (c2 - c1 === 1 && c3 - c2 === 1) penalty += 5;
    if (c1 - c2 === 1 && c2 - c3 === 1) penalty += 5;
  }

  // Repeated characters (aaa, 111)
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      penalty += 8;
    }
  }

  // Keyboard walks (qwerty, asdf)
  const keyboardWalks = ['qwerty', 'asdf', 'zxcv', 'qazwsx'];
  const lower = password.toLowerCase();
  for (const walk of keyboardWalks) {
    if (lower.includes(walk)) penalty += 10;
  }

  // 6. Entropy score (0-50 points, based on bits)
  const entropyScore = Math.min(entropy / 2, 50);

  // 7. Final score
  const rawScore = entropyScore + lengthScore + diversityScore - penalty;
  const score = Math.max(0, Math.min(100, rawScore));

  // 8. Level
  let level, label;
  if (score < 20) {
    level = 'weak';
    label = 'Weak';
  } else if (score < 40) {
    level = 'fair';
    label = 'Fair';
  } else if (score < 65) {
    level = 'strong';
    label = 'Strong';
  } else {
    level = 'very-strong';
    label = 'Very Strong';
  }

  return {
    score,
    level,
    label,
    entropy: entropy.toFixed(1),
    diversity: diversity + '/4',
    penalty,
    lengthScore
  };
}

// Check strength tab - real-time analysis
const checkInput = document.getElementById('check-input');
checkInput.addEventListener('input', () => {
  const pw = checkInput.value;
  const result = analyzeStrength(pw);

  const fill = document.getElementById('check-strength-fill');
  const label = document.getElementById('check-strength-label');

  fill.style.width = result.score + '%';
  fill.className = 'strength-fill ' + result.level;
  label.textContent = result.label;

  // Update breakdown
  document.getElementById('score-entropy').textContent = (result.entropy || '0') + ' bits';
  document.getElementById('score-length').textContent = result.lengthScore || 0;
  document.getElementById('score-diversity').textContent = result.diversity || '0/4';
  document.getElementById('score-pattern').textContent = '-' + (result.penalty || 0);
});
