#!/usr/bin/env python3
"""Builds the two case-study cover images the /resources/ lineup was missing.

Why this exists: the A.P. Moller - Maersk and Heathrow Airport case studies were entered in the CMS
without a coverImage, so their tiles render the empty fallback. The only brand assets in the media
library are the two logos, and both are wide marks (Heathrow is a 3.24:1 wordmark) - dropping them in
as-is lets object-cover crop the wordmark in half. So each logo is composed onto a portrait canvas at
the tile's aspect (372:396) with breathing room, then uploaded through the CMS like any other asset.

Output: media/case-study-cover-<slug>.png (1600x1700), transparent-free, light metallic gradient
matching the site's card treatment.

Usage: python3 scripts/generate-case-study-covers.py
"""
from PIL import Image, ImageDraw

W, H = 1600, 1700
TOP = (247, 249, 252)      # near-white, cool
BOTTOM = (228, 234, 243)   # soft slate
ACCENT = (255, 97, 42)     # brand orange #FF612A

SRC = {
    'maersk': 'media/A.P.-Møller-Mærsk-Logo.svg.webp',
    'heathrow-airport': 'media/Heathrow_Airport-Logo.wine.png',
}
# Share of the canvas width the *visible* logo is allowed to occupy. Heathrow is a wordmark, so it
# gets more room; the Maersk mark is a square plate and reads better smaller.
WIDTH_SHARE = {'maersk': 0.46, 'heathrow-airport': 0.66}
OUT = 'media/case-study-cover-{}.png'


def background():
    canvas = Image.new('RGB', (W, H), TOP)
    draw = ImageDraw.Draw(canvas)
    for y in range(H):
        t = y / (H - 1)
        draw.line(
            [(0, y), (W, y)],
            fill=tuple(round(TOP[i] + (BOTTOM[i] - TOP[i]) * t) for i in range(3)),
        )
    # Faint diagonal sheen, top-left to bottom-right, to keep the flat gradient from looking muddy.
    sheen = Image.new('L', (W, H), 0)
    sd = ImageDraw.Draw(sheen)
    for step in range(0, 1400, 4):
        sd.line([(step, 0), (step + 900, H)], fill=max(0, 26 - step // 60))
    canvas = Image.composite(Image.new('RGB', (W, H), (255, 255, 255)), canvas, sheen)
    return canvas


def logo(path, share):
    mark = Image.open(path).convert('RGBA')
    box = mark.split()[3].getbbox()
    if box:
        mark = mark.crop(box)
    target_w = round(W * share)
    scale = target_w / mark.width
    resample = getattr(Image, 'Resampling', Image).LANCZOS
    return mark.resize((target_w, round(mark.height * scale)), resample)


for slug, path in SRC.items():
    canvas = background()
    mark = logo(path, WIDTH_SHARE[slug])
    x = (W - mark.width) // 2
    y = (H - mark.height) // 2 - 40
    canvas.paste(mark, (x, y), mark)
    # Brand hairline under the mark: one small intentional detail, nothing decorative.
    rule_y = y + mark.height + 110
    rule_w = 132
    ImageDraw.Draw(canvas).rectangle(
        [((W - rule_w) // 2, rule_y), ((W + rule_w) // 2, rule_y + 6)], fill=ACCENT
    )
    out = OUT.format(slug)
    canvas.save(out, 'PNG', optimize=True)
    print(f'{out}  {canvas.width}x{canvas.height}  logo {mark.width}x{mark.height} at ({x},{y})')
