"""Outline 'LOCIFY' as SVG paths (hand-authoring contract: masters are paths only).

Run: uv run --with uharfbuzz --with fonttools outline.py
Implements the tested snippet from brand-identity reference.md.
"""
import json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.teePen import TeePen
from fontTools.pens.transformPen import TransformPen

FONT = "docs/static/img/brand/.Poppins-SemiBold.ttf"


def text_to_path(text, font_path, size=100, tracking=0, font_number=0):
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob, font_number)
    font = hb.Font(face)
    scale = size / face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf)
    tt = TTFont(font_path, fontNumber=font_number)
    glyph_set = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    pen, bounds = SVGPathPen(glyph_set), BoundsPen(glyph_set)
    x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        tpen = TransformPen(TeePen(pen, bounds), (scale, 0, 0, -scale,
                          (x + pos.x_offset) * scale, -pos.y_offset * scale))
        glyph_set[order[info.codepoint]].draw(tpen)
        x += pos.x_advance + tracking / scale
    advance = x * scale - tracking if buf.glyph_infos else 0.0
    return pen.getCommands(), advance, bounds.bounds


d, advance, b = text_to_path("LOCIFY", FONT, size=100, tracking=20)
out = {"d": d, "advance": advance, " bounds": b}
x0, y0, x1, y1 = b
out["ink"] = {"w": round(x1 - x0, 2), "h": round(y1 - y0, 2),
              "x0": round(x0, 2), "y0": round(y0, 2), "x1": round(x1, 2), "y1": round(y1, 2)}
with open("docs/static/img/brand/.brandwork/wordmark.json", "w") as f:
    json.dump(out, f)
print("advance:", round(advance, 2), "ink:", out["ink"], "path len:", len(d))
