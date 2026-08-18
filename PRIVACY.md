# Privacy Policy — SecurePass Generator & Vault

**Last updated:** August 2026

## Overview

SecurePass Generator & Vault is a Chrome extension that generates and stores passwords entirely on your device. We do not collect, transmit, or store any of your data on external servers.

## Data Collection

**We do not collect any personal data.**

All password generation, strength checking, and vault storage happens locally in your browser. No data is sent to any server except:

- **HIBP breach check**: When you check a password strength, the extension sends only the first 5 characters of a SHA-1 hash to the Have I Been Pwned API (`api.pwnedpasswords.com`). Your full password is never transmitted. This is a k-anonymity approach — the API cannot determine your actual password.

## Data Storage

- All passwords are stored locally in your browser's IndexedDB
- Vault data is encrypted with AES-256-GCM using a key derived from your master passphrase via PBKDF2 (600,000 iterations, SHA-256)
- Your passphrase is never stored — only the derived encryption key is held in memory while the vault is unlocked
- Locking the vault clears the key from memory

## Third-Party Services

| Service | Purpose | Data Sent |
|---------|---------|-----------|
| Have I Been Pwned | Breach checking | First 5 chars of SHA-1 hash only |

## Permissions

| Permission | Why |
|------------|-----|
| `clipboardWrite` | Copy generated passwords to clipboard |

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected in the extension's repository.

## Contact

For questions about this privacy policy, open an issue at the project's GitHub repository.
