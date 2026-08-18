# Contributing

Thanks for your interest in contributing to Password Generator!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `npm install`
4. Test by loading as unpacked extension in Chrome

## Development Setup

No build step required — edit files directly and reload the extension in `chrome://extensions/`.

### Testing Changes

1. Make edits to `popup.js`, `popup.html`, or `popup.css`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Password Generator card
4. Click the extension icon to test

### Running Tests

```bash
npm test        # Run unit tests
npm run lint    # Run ESLint
```

CI runs automatically on push and PR to `main`.

## Code Style

- Vanilla JavaScript (no frameworks)
- Vault code is wrapped in an IIFE — keep it isolated
- Use `crypto.getRandomValues()` for any randomness — never `Math.random()`
- Use Web Crypto API for hashing and encryption
- Keep functions focused and under 50 lines

## Architecture

- **Generate tab**: Entropy mixing, length/charset config, password generation
- **Check tab**: Real-time strength analysis, HIBP k-anonymity breach check, common word detection
- **Vault tab**: AES-256-GCM encryption via PBKDF2-derived keys, IndexedDB storage

### Vault Code

The vault uses an IIFE pattern to isolate its state. When modifying vault code:
- Never store the passphrase or raw key
- Keep PBKDF2 iterations at 600,000 minimum
- Use AES-GCM (not AES-CBC) for authenticated encryption
- Store only encrypted data in IndexedDB

## Pull Requests

1. Create a feature branch from `main`
2. Keep PRs focused on one change
3. Run `npm test` and `npm run lint` before submitting
4. Describe what you changed and why

## Reporting Issues

- Describe the bug clearly
- Include Chrome version
- Steps to reproduce
- Expected vs actual behavior

## Feature Requests

Open an issue with:
- Problem you're trying to solve
- Proposed solution
- Any mockups or examples

## Security Issues

Report security vulnerabilities privately — do not open a public issue.
