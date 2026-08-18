# Password Generator Chrome Extension

A secure password generator Chrome extension that combines cryptographic randomness with user-provided entropy. Includes a real-time password strength checker with HIBP breach detection, common password filtering, and an encrypted local vault.

## Features

- **Entropy-mixed generation**: Type random characters to add your own entropy to the cryptographic seed
- **Configurable length**: Slider (8-128) with preset buttons (12, 16, 24, 32, 64, 128)
- **Character toggles**: Uppercase, lowercase, digits, symbols — all configurable
- **Exclude ambiguous characters**: Skip `0/O`, `l/1/I`, `|` for cleaner passwords
- **Strength checker**: Real-time analysis with entropy calculation and pattern detection
- **Common password detection**: Flags known weak passwords and common words instantly
- **HIBP breach check**: k-anonymity API check against Have I Been Pwned (password never leaves client)
- **Encrypted local vault**: Save passwords locally with AES-256-GCM encryption (PBKDF2 key derivation)
- **Screen-reader compatible**: ARIA live regions, keyboard navigation, proper focus management
- **Copy to clipboard**: One-click copy with confirmation

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select this `password` directory
5. The extension icon appears in your toolbar

## Usage

### Generate Password

1. Click the extension icon
2. (Optional) Type random characters in the entropy field for extra security
3. Adjust length with the slider or preset buttons
4. Toggle character sets on/off
5. Click **Generate Password**
6. Click **Copy** to copy to clipboard

### Check Password Strength

1. Switch to the **Check** tab
2. Type or paste any password
3. View the strength meter and detailed breakdown:
   - Entropy bits
   - Length score
   - Character diversity (0-4 sets)
   - Pattern penalties
   - Common word penalties
   - HIBP breach count

### Encrypted Vault

1. Switch to the **Vault** tab
2. Set a master passphrase (min 4 characters)
3. After generating a password, enter a label and click **Save**
4. Saved passwords are encrypted with AES-256-GCM using PBKDF2-derived keys
5. Click **Copy** next to any entry to decrypt and copy
6. Click **Lock Vault** to clear the key from memory

## Strength Scoring

| Component | Points | Description |
|-----------|--------|-------------|
| Entropy | 0-50 | Based on `log2(charsetSize ^ length)` |
| Length | 0-30 | Characters * 2, capped at 30 |
| Diversity | 0-20 | 5 points per character set used |
| Patterns | -5 to -10 | Penalties for sequences, repeats, keyboard walks |
| Common Words | -15 each | Penalty for each common word found in password |
| Common Password | instant 0 | Known weak passwords score 0 immediately |

### Rating Thresholds

| Score | Rating |
|-------|--------|
| 0-19 | Weak |
| 20-39 | Fair |
| 40-64 | Strong |
| 65-100 | Very Strong |

## Security

- Uses `crypto.getRandomValues()` for cryptographic randomness
- User entropy is XOR-mixed with random bytes before generation
- HIBP k-anonymity: only the first 5 chars of a SHA-1 hash are sent — full password never leaves the client
- Vault encryption: AES-256-GCM with PBKDF2 key derivation (600,000 iterations, SHA-256)
- All data stored locally in IndexedDB — no external storage
- Manifest V3 with minimal permissions (`clipboardWrite` only)

## Files

```
password/
├── manifest.json        # Extension configuration (Manifest V3)
├── popup.html           # UI structure with 3 tabs
├── popup.js             # Core logic (generator, strength, vault)
├── popup.css            # Styling + vault UI
├── icons/               # Extension icons (16, 48, 128px)
├── test.js              # Unit tests for strength analyzer
├── eslint.config.js     # ESLint configuration
├── package.json         # Node.js project config
├── .github/workflows/   # CI pipeline
│   └── ci.yml
├── README.md            # This file
├── CONTRIBUTING.md      # Contribution guidelines
└── LICENSE              # MIT License
```

## Development

```bash
npm install
npm run lint    # Run ESLint
npm test        # Run unit tests
```

## License

MIT License — see [LICENSE](LICENSE) for details.
