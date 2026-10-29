"""Build the social card (1200x630, mark-only per brief) and faviconico .ico master."""
import shutil
import resvg_py
from pathlib import Path

BRAND = Path("docs/static/img/brand")
IMG = Path("docs/static/img")

# --- 1. Navbar logo: the official fullcolor horizontal lockup ---
shutil.copyfile(BRAND / "svg" / "locify-lockup-horizontal-fullcolor.svg", IMG / "logo.svg")

# --- 2. Social card 1200x630: mark-only on Azul Profundo, mark centered ---
# mark 96-box scaled 4.4x = 422 px; ink ~76*4.4 = 336 px wide inside it.
k = 4.4
w = 96 * k                      # 422.4
x = (1200 - w) / 2
y = (630 - w) / 2
card = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">'
        f'<rect width="1200" height="630" fill="#244A80"/>'
        f'<g transform="translate({x},{y}) scale({k})">'
        f'<path d="M 82 40 L 82 34 A 20 20 0 0 0 62 14 L 34 14 A 20 20 0 0 0 14 34 '
        f'L 14 62 A 20 20 0 0 0 34 82 L 62 82 A 20 20 0 0 0 82 62 L 82 58 L 68 58 L 68 38 L 82 38 Z '
        f'M 36 28 L 60 28 A 8 8 0 0 1 68 36 L 68 60 A 8 8 0 0 1 60 68 L 36 68 A 8 8 0 0 1 28 60 '
        f'L 28 36 A 8 8 0 0 1 36 28 Z" fill="#2F5D9F" fill-rule="evenodd"/>'
        f'<path d="M 27 45 L 40 58 L 90 43" stroke="#00C853" stroke-width="12" fill="none" stroke-linejoin="miter"/>'
        f'</g></svg>')
watch = BRAND / "svg" / "locify-social-card-1200x630.svg"
watch.write_text(card)
(IMG / "social-card.png").write_bytes(resvg_py.svg_to_bytes(svg_string=card, width=1200, height=630))

# --- 3. Favicon set: copy brand renders as standard web names ---
pairs = {
    "locify-marca-via-libre-fullcolor-16.png": "favicon-16.png",
    "locify-marca-via-libre-fullcolor-32.png": "favicon-32.png",
    "locify-marca-via-libre-fullcolor-180.png": "apple-touch-icon.png",
    "locify-marca-via-libre-fullcolor-192.png": "android-chrome-192.png",
    "locify-marca-via-libre-fullcolor-512.png": "android-chrome-512.png",
}
for src, dst in pairs.items():
    shutil.copyfile(BRAND / "png" / src, IMG / dst)

# --- 4. favicon.ico (multi-size, from the mark masters) ---
from PIL import Image  # noqa: E402

base = Image.open(IMG / "android-chrome-512.png")
base.save(IMG / "favicon.ico", format="ICO",
          sizes=[(16, 16), (32, 32), (48, 48)])
print("assets done")
