#!/usr/bin/env python3
"""Generate Chrome Web Store promo tiles for SecurePass."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))

def font(size):
    try:
        return ImageFont.truetype('arial.ttf', size)
    except:
        try:
            return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', size)
        except:
            return ImageFont.load_default()

def draw_rounded_rect(d, xy, r, fill):
    d.rounded_rectangle(xy, radius=r, fill=fill)

BG    = '#1a1a2e'
PANEL = '#16213e'
ACCENT= '#0f3460'
BLUE  = '#2979ff'
GREEN = '#00c853'
WHITE = '#ffffff'
GRAY  = '#aaaaaa'

# ===== Small promo tile 440x280 =====
img = Image.new('RGB', (440, 280), BG)
d = ImageDraw.Draw(img)

# Accent strip
d.rectangle([0, 0, 440, 8], fill=BLUE)

# Shield icon (simple polygon)
d.polygon([(200, 40), (250, 60), (250, 100), (225, 120), (200, 130), (175, 120), (150, 100), (150, 60)], fill=BLUE)
d.text((190, 65), '\u2713', font=font(36), fill=WHITE)

# Title
d.text((20, 155), 'SecurePass', font=font(34), fill=WHITE)
d.text((20, 198), 'Generator & Vault', font=font(20), fill=GRAY)

# Feature bullets
features = ['Entropy Mixing', 'HIBP Breach Check', 'AES-256 Vault']
for i, f in enumerate(features):
    d.ellipse([25, 240+i*0, 35, 250+i*0], fill=GREEN) if False else None
for i, f in enumerate(features):
    x = 20 + i*140
    d.text((x, 245), f, font=font(12), fill=GRAY)

img.save(os.path.join(OUT, 'promo-small-440x280.png'))
print('Small promo tile saved (440x280)')

# ===== Marquee promo tile 1400x560 =====
img = Image.new('RGB', (1400, 560), BG)
d = ImageDraw.Draw(img)

# Gradient-style accent bar
d.rectangle([0, 0, 1400, 12], fill=BLUE)

# Left panel - shield
d.polygon([(650, 80), (750, 120), (750, 220), (700, 260), (650, 280), (600, 260), (550, 220), (550, 120)], fill=BLUE)
d.text((625, 140), '\u2713', font=font(72), fill=WHITE)

# Title
d.text((60, 100), 'SecurePass', font=font(72), fill=WHITE)
d.text((60, 190), 'Generator & Vault', font=font(36), fill=GRAY)

# Tagline
d.text((60, 260), 'Generate. Check. Store. All locally.', font=font(24), fill=BLUE)

# Feature cards
cards = [
    ('Secure Generation', 'Cryptographic randomness\nwith user entropy mixing'),
    ('Breach Detection', 'HIBP k-anonymity check\nin real-time'),
    ('Encrypted Vault', 'AES-256-GCM storage\nwith PBKDF2 key derivation'),
    ('Memory Hardening', 'All buffers zeroed\nafter cryptographic use'),
]
for i, (title, desc) in enumerate(cards):
    x = 60 + i*335
    y = 340
    draw_rounded_rect(d, (x, y, x+310, y+180), 10, PANEL)
    d.text((x+20, y+15), title, font=font(20), fill=WHITE)
    for j, line in enumerate(desc.split('\n')):
        d.text((x+20, y+50+j*28), line, font=font(15), fill=GRAY)

# Bottom bar
d.rectangle([0, 540, 1400, 560], fill=ACCENT)
d.text((60, 543), 'Open Source  |  MIT License  |  v0.0.2', font=font(14), fill=GRAY)

img.save(os.path.join(OUT, 'promo-marquee-1400x560.png'))
print('Marquee promo tile saved (1400x560)')
