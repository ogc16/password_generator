#!/usr/bin/env python3
"""Generate Chrome Web Store screenshots (1280x800) for SecurePass."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUT, exist_ok=True)

W, H = 1280, 800

# Colors
BG       = '#1a1a2e'
PANEL    = '#16213e'
ACCENT   = '#0f3460'
GREEN    = '#00c853'
RED      = '#ff1744'
ORANGE   = '#ff9100'
WHITE    = '#ffffff'
GRAY     = '#aaaaaa'
BLUE     = '#2979ff'

def font(size):
    try:
        return ImageFont.truetype('arial.ttf', size)
    except:
        try:
            return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', size)
        except:
            return ImageFont.load_default()

def draw_rounded_rect(d, xy, r, fill):
    x0, y0, x1, y1 = xy
    d.rounded_rectangle(xy, radius=r, fill=fill)

def screenshot1():
    """Generate tab - password generator"""
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    # Title bar
    d.rectangle([0, 0, W, 60], fill=ACCENT)
    d.text((30, 16), 'SecurePass Generator & Vault', font=font(26), fill=WHITE)
    d.text((W-120, 20), 'v0.0.2', font=font(16), fill=GRAY)

    # Tab bar
    tabs = [('Generate', 30), ('Check Strength', 200), ('Vault', 420)]
    for label, x in tabs:
        active = label == 'Generate'
        draw_rounded_rect(d, (x, 80, x+150, 120), 8, BLUE if active else PANEL)
        d.text((x+15, 87), label, font=font(18), fill=WHITE)

    # Main panel
    draw_rounded_rect(d, (30, 140, W-30, H-30), 12, PANEL)

    # Character set toggles
    d.text((60, 160), 'Character Sets', font=font(20), fill=WHITE)
    toggles = [('Uppercase A-Z', True), ('Lowercase a-z', True), ('Digits 0-9', True), ('Symbols !@#', True), ('Exclude ambiguous', False)]
    for i, (label, on) in enumerate(toggles):
        y = 200 + i*36
        color = GREEN if on else GRAY
        d.ellipse([60, y, 80, y+20], fill=color)
        d.text((90, y-2), label, font=font(16), fill=WHITE)

    # Length slider
    d.text((60, 400), 'Password Length', font=font(20), fill=WHITE)
    d.rounded_rectangle([60, 440, W-80, 456], radius=8, fill=ACCENT)
    d.rounded_rectangle([60, 440, 500, 456], radius=8, fill=BLUE)
    d.text((510, 432), '32', font=font(22), fill=WHITE)

    # Presets
    presets = ['12', '16', '24', '32', '64', '128']
    for i, p in enumerate(presets):
        x = 60 + i*80
        active = p == '32'
        draw_rounded_rect(d, (x, 475, x+65, 505), 6, BLUE if active else ACCENT)
        d.text((x+20, 479), p, font=font(16), fill=WHITE)

    # Entropy input
    d.text((60, 530), 'Your Entropy (optional text)', font=font(20), fill=WHITE)
    draw_rounded_rect(d, (60, 565, W-80, 605), 8, ACCENT)
    d.text((70, 572), 'Type anything for additional entropy...', font=font(16), fill=GRAY)
    d.text((60, 615), '0.0 bits added', font=font(14), fill=GRAY)

    # Generate button
    draw_rounded_rect(d, (60, 650, 300, 695), 10, BLUE)
    d.text((110, 657), 'Generate', font=font(22), fill=WHITE)

    # Output field
    draw_rounded_rect(d, (320, 650, W-80, 695), 8, ACCENT)
    d.text((330, 658), 'xK9#mP2$vL8nQ4wR!jH7bT3yF6c', font=font(18), fill=GREEN)

    # Strength bar
    d.rounded_rectangle([60, 720, W-80, 740], radius=6, fill=ACCENT)
    d.rounded_rectangle([60, 720, 700, 740], radius=6, fill=GREEN)
    d.text((710, 718), 'Very Strong', font=font(16), fill=GREEN)

    img.save(os.path.join(OUT, 'screenshot1-generate.png'))
    print('Screenshot 1 saved')

def screenshot2():
    """Check Strength tab"""
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 60], fill=ACCENT)
    d.text((30, 16), 'SecurePass Generator & Vault', font=font(26), fill=WHITE)
    d.text((W-120, 20), 'v0.0.2', font=font(16), fill=GRAY)

    tabs = [('Generate', 30), ('Check Strength', 200), ('Vault', 420)]
    for label, x in tabs:
        active = label == 'Check Strength'
        draw_rounded_rect(d, (x, 80, x+150, 120), 8, BLUE if active else PANEL)
        d.text((x+15, 87), label, font=font(18), fill=WHITE)

    draw_rounded_rect(d, (30, 140, W-30, H-30), 12, PANEL)

    # Password input
    d.text((60, 160), 'Enter a password to check', font=font(20), fill=WHITE)
    draw_rounded_rect(d, (60, 195, W-80, 235), 8, ACCENT)
    d.text((70, 203), 'P@ssw0rd!2024', font=font(18), fill=WHITE)

    # Strength bar
    d.rounded_rectangle([60, 260, W-80, 280], radius=6, fill=ACCENT)
    d.rounded_rectangle([60, 260, 450, 280], radius=6, fill=ORANGE)
    d.text((460, 258), 'Fair', font=font(18), fill=ORANGE)

    # Breakdown
    d.text((60, 310), 'Score Breakdown', font=font(22), fill=WHITE)
    rows = [
        ('Entropy', '56.2 bits', WHITE),
        ('Length Score', '24', WHITE),
        ('Character Diversity', '4/4', GREEN),
        ('Pattern Penalty', '-5', RED),
        ('Common Word Penalty', '-15', RED),
        ('HIBP Breach Check', 'None found', GREEN),
    ]
    for i, (label, value, color) in enumerate(rows):
        y = 350 + i*44
        d.text((80, y), label, font=font(18), fill=GRAY)
        d.text((W-250, y), value, font=font(18), fill=color)

    # Warning box
    draw_rounded_rect(d, (60, 630, W-80, 700), 8, '#3e1a1a')
    d.text((80, 645), 'Warning: This password contains a common dictionary word.', font=font(16), fill=ORANGE)
    d.text((80, 672), 'Consider using a fully random password for better security.', font=font(14), fill=GRAY)

    img.save(os.path.join(OUT, 'screenshot2-check.png'))
    print('Screenshot 2 saved')

def screenshot3():
    """Vault tab"""
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 60], fill=ACCENT)
    d.text((30, 16), 'SecurePass Generator & Vault', font=font(26), fill=WHITE)
    d.text((W-120, 20), 'v0.0.2', font=font(16), fill=GRAY)

    tabs = [('Generate', 30), ('Check Strength', 200), ('Vault', 420)]
    for label, x in tabs:
        active = label == 'Vault'
        draw_rounded_rect(d, (x, 80, x+150, 120), 8, BLUE if active else PANEL)
        d.text((x+15, 87), label, font=font(18), fill=WHITE)

    draw_rounded_rect(d, (30, 140, W-30, H-30), 12, PANEL)

    # Vault manage header
    d.text((60, 160), 'Encrypted Vault', font=font(24), fill=WHITE)
    d.text((60, 195), 'AES-256-GCM  |  PBKDF2 600K iterations  |  All data local', font=font(14), fill=GRAY)

    # Save entry row
    d.text((60, 240), 'Save Generated Password', font=font(18), fill=WHITE)
    draw_rounded_rect(d, (60, 270, 500, 305), 8, ACCENT)
    d.text((70, 278), 'Label (e.g. GitHub, Gmail)', font=font(16), fill=GRAY)
    draw_rounded_rect(d, (520, 270, 650, 305), 8, BLUE)
    d.text((555, 278), 'Save', font=font(16), fill=WHITE)

    # Vault entries
    entries = [
        ('GitHub', '2026-08-18'),
        ('Gmail', '2026-08-18'),
        ('Bank of America', '2026-08-17'),
        ('Netflix', '2026-08-16'),
        ('AWS Console', '2026-08-15'),
        ('Slack', '2026-08-14'),
    ]
    d.text((60, 335), 'Vault Entries (6)', font=font(20), fill=WHITE)

    for i, (label, date) in enumerate(entries):
        y = 375 + i*54
        draw_rounded_rect(d, (60, y, W-80, y+46), 6, ACCENT)
        d.text((80, y+12), label, font=font(16), fill=WHITE)
        d.text((350, y+12), date, font=font(14), fill=GRAY)
        # Copy button
        draw_rounded_rect(d, (W-300, y+8, W-210, y+38), 6, BLUE)
        d.text((W-285, y+14), 'Copy', font=font(14), fill=WHITE)
        # Delete button
        draw_rounded_rect(d, (W-195, y+8, W-100, y+38), 6, '#5c1a1a')
        d.text((W-185, y+14), 'Delete', font=font(14), fill=RED)

    # Lock button
    draw_rounded_rect(d, (60, H-80, 220, H-40), 8, '#5c1a1a')
    d.text((100, H-72), 'Lock Vault', font=font(18), fill=RED)

    img.save(os.path.join(OUT, 'screenshot3-vault.png'))
    print('Screenshot 3 saved')

def screenshot4():
    """Security features overview"""
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    d.rectangle([0, 0, W, 60], fill=ACCENT)
    d.text((30, 16), 'SecurePass Generator & Vault', font=font(26), fill=WHITE)
    d.text((W-120, 20), 'v0.0.2', font=font(16), fill=GRAY)

    d.text((60, 90), 'Security Features', font=font(32), fill=WHITE)

    features = [
        ('Memory Hardening', 'All cryptographic buffers zeroed after use via secureWipe()', GREEN),
        ('Side-Channel Resistance', 'Uint8Array byte-level operations — no heap string allocation', GREEN),
        ('Modulo Bias Elimination', 'Rejection sampling for uniform random character selection', GREEN),
        ('Clipboard Auto-Wipe', 'Clipboard cleared automatically after 30 seconds', GREEN),
        ('HIBP Breach Detection', 'k-anonymity check — only first 5 chars of SHA-1 hash sent', BLUE),
        ('Common Password Filter', 'Instant-fail for 80+ known breached passwords', BLUE),
        ('Encrypted Vault', 'AES-256-GCM with PBKDF2 (600,000 iterations, SHA-256)', BLUE),
        ('Zero-Knowledge Storage', 'All data stays local — no external servers except HIBP prefix', BLUE),
    ]

    for i, (title, desc, color) in enumerate(features):
        y = 150 + i * 75
        draw_rounded_rect(d, (60, y, W-60, y+65), 8, PANEL)
        d.ellipse([80, y+15, 100, y+35], fill=color)
        d.text((115, y+10), title, font=font(20), fill=WHITE)
        d.text((115, y+38), desc, font=font(15), fill=GRAY)

    # Footer
    d.text((60, H-45), 'Open source  |  MIT License  |  github.com/ogc16/password', font=font(14), fill=GRAY)

    img.save(os.path.join(OUT, 'screenshot4-security.png'))
    print('Screenshot 4 saved')

screenshot1()
screenshot2()
screenshot3()
screenshot4()
print('All store screenshots generated')
