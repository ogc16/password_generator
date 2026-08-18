# Permission Justification — SecurePass Generator & Vault

## clipboardWrite

**Why this permission is needed:**
The extension's core function is to generate and retrieve passwords. Users must be able to copy passwords to their clipboard to paste them into login forms, password fields, and other applications. Without clipboardWrite, the extension cannot fulfill its primary purpose of providing usable passwords.

**How it is used:**
- Copy button on the Generate tab writes the generated password to the system clipboard
- Copy button on each Vault entry writes the decrypted password to the system clipboard
- No other clipboard operations are performed; the permission is never used for reading clipboard content

**Why it cannot be removed:**
Removing clipboardWrite would force users to manually select and copy password text from a read-only field, which is error-prone (partial selections leak weak fragments) and defeats the purpose of a secure password generator.

---

## host_permissions: https://api.pwnedpasswords.com/*

**Why this permission is needed:**
The extension checks whether a user's password has appeared in known data breaches using the Have I Been Pwned (HIBP) API. This is a critical security feature that prevents users from selecting compromised passwords.

**How it is used:**
- Only the first 5 characters of a SHA-1 hash of the password are sent (k-anonymity model)
- The full password is never transmitted to any server
- The API returns a list of hash suffixes; the extension checks locally whether the user's hash appears in the list
- No other hosts or URLs are accessed; this is the only external network request the extension makes

**Why it cannot be removed:**
Without this permission, the extension cannot warn users about breached passwords, which is a key security feature. The k-anonymity approach ensures user privacy is preserved — the API cannot determine the actual password from the prefix alone.
