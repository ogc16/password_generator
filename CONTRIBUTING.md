# Contributing

Thanks for your interest in contributing to Password Generator!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Make your changes in the `password/` directory
4. Test by loading as unpacked extension in Chrome

## Development Setup

No build step required — edit files directly and reload the extension in `chrome://extensions/`.

### Testing Changes

1. Make edits to `popup.js`, `popup.html`, or `popup.css`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Password Generator card
4. Click the extension icon to test

## Code Style

- Vanilla JavaScript (no frameworks)
- CSS with custom properties for theming
- Keep functions focused and under 50 lines
- Use `crypto.getRandomValues()` for any randomness — never `Math.random()`

## Pull Requests

1. Create a feature branch from `main`
2. Keep PRs focused on one change
3. Describe what you changed and why
4. Test the extension before submitting

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
