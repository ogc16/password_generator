# Chrome Web Store Listing — SecurePass Generator & Vault

## Store Name
SecurePass Generator & Vault

## Short Description
Generate cryptographically secure passwords with user-provided entropy, check breach status via HIBP, and store them in an AES-256 encrypted local vault.

## Detailed Description

**SecurePass** is a security-first Chrome extension for generating, checking, and storing passwords — entirely in your browser.

**Generate** — Create passwords up to 128 characters with full control over character sets (uppercase, lowercase, digits, symbols), optional ambiguous character exclusion, and 6 length presets (12–128). Mix your own text entropy with cryptographic randomness for additional unpredictability.

**Check Strength** — Real-time strength analysis with entropy scoring, character diversity, pattern detection, and common word penalties. Breach status checked live via the Have I Been Pwned API using k-anonymity (only the first 5 characters of a SHA-1 hash are sent — your password never leaves your device).

**Vault** — Save generated passwords in an AES-256-GCM encrypted vault using IndexedDB. Encryption key derived via PBKDF2 with 600,000 iterations and SHA-256. Your master passphrase is never stored — only the derived key exists in memory while unlocked.

**Security Features:**
- Memory hardening: all cryptographic buffers zeroed after use (secureWipe)
- Side-channel resistance: byte-level Uint8Array operations, no string heap allocation
- Clipboard auto-wipe after 30 seconds
- Common password instant-fail (80+ known breached passwords)
- Modulo bias elimination via rejection sampling
- All data stored locally — no external servers

**Accessibility:**
- Full keyboard navigation (arrow keys, Home/End, Tab)
- Screen reader announcements via ARIA live regions
- ARIA labels on all interactive elements

## Category
Productivity > Security & Privacy

## Language
English

## Screenshots

| # | File | Caption |
|---|------|---------|
| 1 | `screenshot1-generate.png` | Generate secure passwords with customizable character sets and length |
| 2 | `screenshot2-check.png` | Real-time strength analysis with breach detection |
| 3 | `screenshot3-vault.png` | Encrypted local vault for password storage |
| 4 | `screenshot4-security.png` | Security features overview |

## Privacy Policy URL
https://github.com/ogc16/password/blob/main/PRIVACY.md

## Source Code URL
https://github.com/ogc16/password

## Permissions Justification

| Permission | Reason |
|------------|--------|
| `clipboardWrite` | Copy generated passwords to clipboard |
| `host_permissions` (api.pwnedpasswords.com) | Check password breach status via HIBP k-anonymity API |
