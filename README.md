# Password Generator Chrome Extension

A secure password generator Chrome extension that combines cryptographic randomness with user-provided entropy. Includes a real-time password strength checker with pattern detection.

## Features

- **Entropy-mixed generation**: Type random characters to add your own entropy to the cryptographic seed
- **Configurable length**: Slider (8-64) with preset buttons (12, 16, 24, 32)
- **Character toggles**: Uppercase, lowercase, digits, symbols — all configurable
- **Exclude ambiguous characters**: Skip `0/O`, `l/1/I`, `|` for cleaner passwords
- **Strength checker**: Real-time analysis with entropy calculation and pattern detection
- **Pattern penalties**: Detects sequential characters, repeats, and keyboard walks
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

1. Switch to the **Check Strength** tab
2. Type or paste any password
3. View the strength meter and detailed breakdown:
   - Entropy bits
   - Length score
   - Character diversity (0-4 sets)
   - Pattern penalties

## Strength Scoring

| Component | Points | Description |
|-----------|--------|-------------|
| Entropy | 0-50 | Based on `log2(charsetSize ^ length)` |
| Length | 0-30 | Characters * 2, capped at 30 |
| Diversity | 0-20 | 5 points per character set used |
| Patterns | -5 to -10 | Penalties for sequences, repeats, keyboard walks |

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
- No data is stored or transmitted — all processing is local
- Manifest V3 with minimal permissions (`clipboardWrite` only)

## Files

```
password/
├── manifest.json      # Extension configuration
├── popup.html         # UI structure
├── popup.js           # Core logic
├── popup.css          # Styling
├── icons/             # Extension icons
├── README.md          # This file
├── CONTRIBUTING.md    # Contribution guidelines
└── LICENSE            # MIT License
```

## License

MIT License — see [LICENSE](LICENSE) for details.
