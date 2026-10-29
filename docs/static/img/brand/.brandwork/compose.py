"""Compose LOCIFY logo masters + concept sketches, then rasterize for validation.

Design contract (brand-identity skill): masters are paths only — no <text>, no font-family,
no <image>, no external href. Mono/reverse are single-color fill/stroke swaps of the same geometry.
"""
import json
import re
from pathlib import Path

ROOT = Path(".")
BRAND = ROOT / "docs/static/img/brand"
WORK = BRAND / ".brandwork"

AZUL_ACERO = "#2F5D9F"
VERDE = "#00C853"
GRAFITO = "#1F2937"
AZUL_PROFUNDO = "#244A80"

wm = json.loads((WORK / "wordmark.json").read_text())
d_word = wm["d"]
# Normalize ink of the wordmark to (0,0): x0=6.9, y0=-70.8 (baseline 0, ink above it)
# Then place it in the lockup canvas.
WM = "LOCIFY"


def svg(width, height, body, comment=""):
    head = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
            f'width="{round(width)}" height="{round(height)}">')
    if comment:
        head += f"<!-- {comment} -->"
    return head + body + "</svg>"


# ----------------------------------------------------------------------------
# MARK — Concept 1 "via libre": rounded-square ring (una celda) with a "door"
# opening on its right wall, and a green check whose tip exits through it.
# Paths only; center (48,48); outer rounded rect 14..82 (r 20), weight 14.
# ----------------------------------------------------------------------------
# Ring as one path: outer boundary (counterclockwise in y-down), door cut into
# the right wall between y=38 and y=58, closed back along the door edges;
# inner rounded rect as second subpath (fill-rule evenodd).
ring_door = ("M 82 40 L 82 34 A 20 20 0 0 0 62 14 L 34 14 A 20 20 0 0 0 14 34 "
             "L 14 62 A 20 20 0 0 0 34 82 L 62 82 A 20 20 0 0 0 82 62 L 82 58 "
             "L 68 58 L 68 38 L 82 38 Z "
             "M 36 28 L 60 28 A 8 8 0 0 1 68 36 L 68 60 A 8 8 0 0 1 60 68 "
             "L 36 68 A 8 8 0 0 1 28 60 L 28 36 A 8 8 0 0 1 36 28 Z")
# Green check: tail inside the cell, vertex low, tip exits through the door
# (door spans y 38..58 on x 68..82; tip line stays inside it while crossing).
check = "M 27 45 L 40 58 L 90 43"

MARK_BODY = (
    f'<path d="{ring_door}" fill="{AZUL_ACERO}" fill-rule="evenodd"/>'
    f'<path d="{check}" stroke="{VERDE}" stroke-width="12" fill="none" stroke-linejoin="miter"/>'
)
MARK_BODY_MONO = (
    f'<path d="{ring_door}" fill="{GRAFITO}" fill-rule="evenodd"/>'
    f'<path d="{check}" stroke="{GRAFITO}" stroke-width="12" fill="none" stroke-linejoin="miter"/>'
)
MARK_BODY_REVERSE = (
    f'<path d="{ring_door}" fill="#FFFFFF" fill-rule="evenodd"/>'
    f'<path d="{check}" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linejoin="miter"/>'
)

# Mark-only masters (favicon workhorse + colorway gate)
print("SVGs written")
(BRAND / "svg" / "locify-marca-via-libre-mono-grafito.svg").write_text(
    svg(96, 96, MARK_BODY_MONO, "Mark mono: un solo color (grafito). Misma geometría, un color por archivo."))
(BRAND / "svg" / "locify-marca-via-libre-reverse-blanco.svg").write_text(
    svg(96, 96, MARK_BODY_REVERSE, "Mark reverse: blanco (mostrar sobre azul profundo)."))


# ----------------------------------------------------------------------------
# LOCKUP horizontal: mark scaled 1.12× about its center (optical: mark taller
# than cap height), outlined Poppins wordmark, cap ~71.5, ink top at y=12.25.
# ----------------------------------------------------------------------------
MARK_LOCK = f'<g transform="translate(-5.76,-5.76) scale(1.12)">{MARK_BODY}</g>'
word_tx = (104 - 6.9)  # shift x so ink x0 lands at 104 (clears scaled mark edge 86.1)
word_ty = 12.25 + 70.8  # shift y so ink top lands at 12.25
word_path = f'<path d="{d_word}" transform="translate({word_tx}, {word_ty})"/>'


def lockup(word_fill, mark_body):
    return svg(542, 96,
               mark_body + word_path.replace("/>", f' fill="{word_fill}"/>'),
               "LOCIFY lockup horizontal. Mark: celda con puerta y check verde. Wordmark: Poppins SemiBold (OFL 1.1) delineado en paths.")


(BRAND / "svg" / "locify-lockup-horizontal-fullcolor.svg").write_text(lockup(GRAFITO, MARK_LOCK))
(BRAND / "svg" / "locify-lockup-horizontal-mono-grafito.svg").write_text(
    svg(542, 96,
        f'<g transform="translate(-5.76,-5.76) scale(1.12)">'
        f'<path d="{ring_door}" fill="{GRAFITO}" fill-rule="evenodd"/>'
        f'<path d="{check}" stroke="{GRAFITO}" stroke-width="12" fill="none" stroke-linejoin="miter"/></g>'
        + word_path.replace("/>", f' fill="{GRAFITO}"/>'),
    "Lockup mono (todo grafito)."))
(BRAND / "svg" / "locify-lockup-horizontal-reverse-blanco.svg").write_text(
    svg(542, 96,
        f'<g transform="translate(-5.76,-5.76) scale(1.12)">'
        f'<path d="{ring_door}" fill="#FFFFFF" fill-rule="evenodd"/>'
        f'<path d="{check}" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linejoin="miter"/></g>'
        + word_path.replace("/>", ' fill="#FFFFFF"/>'),
    "Lockup reverse (blanco; mostrar sobre azul profundo)."))


# ----------------------------------------------------------------------------
# CONCEPT SKETCHES (3 concepts, board evidence)
# ----------------------------------------------------------------------------
# C-1 sketch = the mark above (clean draft of the recommended shape).
(BRAND / "conceptos" / "concepto-1-via-libre.svg").write_text(
    svg(96, 96, MARK_BODY, "Concepto 1 'via libre': celdas (anillo cuadrado redondeado) con puerta a la derecha por donde sale un tick verde."))

# C-2 "la celda encendida": 2x2 grid of cells, top-right cell green (available).
c2 = (
    f'<rect x="8" y="8" width="36" height="36" rx="10" fill="{AZUL_ACERO}"/>'
    f'<rect x="52" y="8" width="36" height="36" rx="10" fill="{AZUL_ACERO}"/>'
    f'<rect x="8" y="52" width="36" height="36" rx="10" fill="{AZUL_ACERO}"/>'
    f'<rect x="50" y="50" width="40" height="40" rx="11" fill="{VERDE}"/>'
    '<path d="M 60 70 L 68 78.5 L 82 60" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
)
(BRAND / "conceptos" / "concepto-2-la-celda-encendida.svg").write_text(
    svg(96, 96, c2, "Concepto 2 'la celda encendida': el parqueadero visto desde arriba; una celda libre (verde), el resto disponibles (azul)."))

# C-3 "punto y seguido": the Poppins wordmark outlined + terminal green state dot.
c3_w = 444.4 + 30
c3 = (f'<path d="{d_word}" transform="translate({-2.9},{70.8})" fill="{GRAFITO}"/>'
      f'<circle cx="{437.5 + 22}" cy="{71.5 - 10}" r="9" fill="{VERDE}"/>')
(BRAND / "conceptos" / "concepto-3-punto-y-seguido.svg").write_text(
    svg(round(c3_w), 84, c3, "Concepto 3 'punto y seguido': wordmark de solo-trazo con un punto terminal verde (la operacion termino bien). Wordmark-first."))

# Mark-only masters (favicon workhorse + colorway gate)
(BRAND / "svg" / "locify-marca-via-libre-fullcolor.svg").write_text(
    svg(96, 96, MARK_BODY, "LOCIFY mark — concepto 'via libre'. Celda con puerta + check verde (celda libre confirmada)."))
(BRAND / "svg" / "locify-marca-via-libre-mono-grafito.svg").write_text(
    svg(96, 96, MARK_BODY_MONO, "Mark mono: un solo color (grafito). Misma geometría, un color por archivo."))
(BRAND / "svg" / "locify-marca-via-libre-reverse-blanco.svg").write_text(
    svg(96, 96, MARK_BODY_REVERSE, "Mark reverse: blanco (mostrar sobre azul profundo)."))

print("SVGs written")

# ----------------------------------------------------------------------------
# Rasterize (resvg-py wheel, per skill fallback chain)
# ----------------------------------------------------------------------------
import resvg_py  # noqa: E402

SIZES = [16, 32, 48, 180, 192, 512]

def rasterize(svg_path, stem, sizes):
    for s in sizes:
        out = BRAND / "png" / f"{stem}-{s}.png"
        out.write_bytes(resvg_py.svg_to_bytes(svg_path=str(svg_path), width=s, height=s))

rasterize(BRAND / "svg" / "locify-marca-via-libre-fullcolor.svg", "locify-marca-via-libre-fullcolor", SIZES)
(BRAND / "png" / "locify-lockup-horizontal-fullcolor.png").write_bytes(
    resvg_py.svg_to_bytes(svg_path=str(BRAND / "svg" / "locify-lockup-horizontal-fullcolor.svg"), width=538))
(BRAND / "png" / "locify-lockup-horizontal-mono-grafito.png").write_bytes(
    resvg_py.svg_to_bytes(svg_path=str(BRAND / "svg" / "locify-lockup-horizontal-mono-grafito.svg"), width=538))
(BRAND / "png" / "locify-lockup-horizontal-reverse-blanco.png").write_bytes(
    resvg_py.svg_to_bytes(svg_path=str(BRAND / "svg" / "locify-lockup-horizontal-reverse-blanco.svg"), width=538))
print("PNGs written")

# ----------------------------------------------------------------------------
# Validation sheet (not a master): white/light/dark tiles at real pixel sizes,
# so every render can be inspected by eye.
# ----------------------------------------------------------------------------
def tile(x, y, size, bg, inner_xml, scale):
    return (f'<rect x="{x}" y="{y}" width="{size + 24}" height="{size + 24}" fill="{bg}"/>'
            f'<g transform="translate({x + 12},{y + 12}) scale({scale})">{inner_xml}</g>')

rows = []
x = 12
for s in (16, 32, 48):
    k = s / 96.0
    rows.append(tile(x, 12, s, "#FFFFFF", MARK_BODY, k))
    rows.append(tile(x + s + 36, 12, s, "#F6F8FC", MARK_BODY_MONO, k))
    rows.append(tile(x + 2 * (s + 36), 12, s, AZUL_PROFUNDO, MARK_BODY_REVERSE, k))
    x += 3 * (s + 36) + 18
# lockup: mono on white and reverse on dark, at 96px height
lock_body = (
    f'<g transform="translate(-5.76,-5.76) scale(1.12)">'
    f'<path d="{ring_door}" fill="{GRAFITO}" fill-rule="evenodd"/>'
    f'<path d="{check}" stroke="{GRAFITO}" stroke-width="12" fill="none" stroke-linejoin="miter"/></g>'
    + word_path.replace("/>", f' fill="{GRAFITO}"/>'))
rows.append(f'<g transform="translate(12,100)">{lock_body}</g>')
lock_body_reverse = (
    f'<g transform="translate(-5.76,-5.76) scale(1.12)">'
    f'<path d="{ring_door}" fill="#FFFFFF" fill-rule="evenodd"/>'
    f'<path d="{check}" stroke="#FFFFFF" stroke-width="12" fill="none" stroke-linejoin="miter"/></g>'
    + word_path.replace("/>", ' fill="#FFFFFF"/>'))
rows.append(f'<g transform="translate(590,100)"><rect x="0" y="0" width="542" height="96" fill="{AZUL_PROFUNDO}"/>{lock_body_reverse}</g>')

sheet = svg(1165, 240, "".join(rows), "Hoja de validacion LOCIFY: marcas reales 16/32/48 px en claro y oscuro; lockups a 96 px.")
(BRAND / "png" / "hoja-validacion.png").write_bytes(resvg_py.svg_to_bytes(svg_string=sheet, width=1160))
print("validation sheet written")
