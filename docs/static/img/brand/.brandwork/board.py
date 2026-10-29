"""Assemble the self-contained presentation board (brand-identity skill step 9)."""
import base64
import re
from pathlib import Path

BRAND = Path("docs/static/img/brand")

def inline_svg(rel: str) -> str:
    s = (BRAND / rel).read_text()
    s = re.sub(r"<svg ([^>]*?)>", r'<svg \1 style="max-width:100%;height:auto;display:block">', s, count=1)
    return s

def data_uri(rel: str) -> str:
    b = (BRAND / rel).read_bytes()
    return "data:image/png;base64," + base64.b64encode(b).decode()

css = """
:root { --azul:#2F5D9F; --profundo:#244A80; --grafito:#1F2937; --verde:#00C853;
        --borde:#dbe2ec; --fondo:#f7f9fc; --tinta:#1F2937; }
* { box-sizing: border-box; }
body { font-family: -apple-system, 'Segoe UI', system-ui, sans-serif; color: var(--tinta);
       margin: 0 auto; max-width: 1080px; padding: 24px 32px 64px; background: #fff; line-height: 1.6; }
h1 { font-size: 2rem; margin: 0 0 .2rem; }
h2 { font-size: 1.25rem; border-top: 3px solid var(--azul); padding-top: .6rem; margin-top: 2.6rem; }
h3 { font-size: 1.05rem; margin: 1.4rem 0 .3rem; }
.tag { display:inline-block; background: var(--fondo); border:1px solid var(--borde);
       border-radius: 999px; padding: .1rem .7rem; font-size:.85rem; margin: 0 .3rem .4rem 0; }
table { border-collapse: collapse; width: 100%; font-size: .95rem; }
th, td { border: 1px solid var(--borde); padding: .45rem .6rem; text-align: left; vertical-align: top; }
th { background: var(--fondo); }
.cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.card { border: 1px solid var(--borde); border-radius: 12px; padding: 16px; }
.card h3 { margin-top: 0; }
.tile-dark { background: var(--profundo); display: inline-flex; padding: 14px; border-radius: 10px; }
.sketch { background: var(--fondo); border-radius: 10px; padding: 14px; display: flex;
          align-items: center; justify-content: center; min-height: 150px; }
.reco { border: 2px solid var(--verde); }
.muted { color:#5b6472; font-size: .92rem; }
img.px { display:block; image-rendering: pixelated; }
.pull { background:#eef7f0; border-left: 4px solid var(--verde); padding: .7rem 1rem; margin: .6rem 0; }
.warn { background:#fdf2e3; border-left: 4px solid #d97706; padding: .7rem 1rem; margin: .6rem 0; }
"""

html = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LOCIFY — Board de identidad visual (logo)</title><style>{css}</style></head>
<body>
<h1>LOCIFY — Board de identidad visual</h1>
<p class="muted">Entrega de la skill <code>brand-identity</code> · 2026-10-28 · v1 (solo logo) · Recomendación pendiente de aprobación.</p>

<h2>1 · Brief</h2>
<table>
<tr><th>Pregunta</th><th>Respuesta</th></tr>
<tr><td>Nombre</td><td><strong>LOCIFY</strong> (todo en mayúsculas)</td></tr>
<tr><td>Tagline</td><td>Ninguna definida <span class="tag">(asumido)</span> — el logotipo no la necesita</td></tr>
<tr><td>Meta del negocio</td><td>Plataforma SaaS que gestiona cupos de parqueadero, reservas, cobros y reconciliación entre operadores, clientes y administración <span class="tag">(del proyecto)</span></td></tr>
<tr><td>Atributos</td><td>Confianza · rapidez · tecnología · sostenibilidad <span class="tag">(dado)</span></td></tr>
<tr><td>Producto/servicio</td><td>SaaS (multi-tenant): PWA cliente, dashboard de operador, admin-api, motor de reglas, pagos, QR de acceso <span class="tag">(del proyecto)</span></td></tr>
<tr><td>Mercado objetivo</td><td>Operadores de parqueadero y administradores en Colombia; conductores como usuarios finales <span class="tag">(asumido)</span></td></tr>
<tr><td>Competidores</td><td><span class="tag">(asumido)</span> ParkeApp / ParkU / Parkimeter / T2 — ver advertencia en «Colisión de nombre»</td></tr>
<tr><td>Reputación deseada</td><td>«Lo que ves es lo que hay»: la plataforma que nunca miente sobre la disponibilidad <span class="tag">(asumido)</span></td></tr>
<tr><td>Color</td><td>Azul Acero #2F5D9F · Azul Profundo #244A80 · Grafito #1F2937 · acento Verde #00C853 <span class="tag">(dado)</span></td></tr>
</table>

<h2>2 · Posicionamiento</h2>
<div class="pull"><strong>«Para operadores de parqueaderos y administradores de movilidad, LOCIFY es la plataforma SaaS que convierte los cupos físicos en datos confiables al instante — lo que ves es lo que hay, y cada operación queda confirmada.»</strong></div>
<p>El logotipo traduce esto en dos decisiones: el verde representa un <em>estado</em> (celda libre / confirmación), nunca decoración; y la forma nunca encierra del todo: siempre queda una puerta por donde el sistema sigue fluyendo.</p>

<h2>3 · Panorama y clichés</h2>
<p><strong>Defaults visuales del sector:</strong> azul genérico de confianza sobre foto de auto en fuga, marcas de tipo «friendly rounded app» y símbolos literales (autos, medidores).</p>
<table>
<tr><th>Cliché del rubro</th><th>¿Se usa aquí?</th></tr>
<tr><td>Letra «P» en placa / señal de parking</td><td>❌ Prohibida explícitamente por el brief del cliente.</td></tr>
<tr><td>Pin de mapa</td><td>❌ Descartado: es el símbolo de todas las apps de movilidad.</td></tr>
<tr><td>Auto estilizado / medidor</td><td>❌ Habla del conductor, no del SaaS del operador.</td></tr>
<tr><td>Tech/SaaS: trazas de circuito, engranaje, rejilla de cuadrados redondeados, swoosh, hexágono</td><td>⚠️ La rejilla aparece solo con <strong>giro nombrado</strong> en C-2: una celda <em>se enciende</em> porque es el estado real del producto (cupos libres) — no es un patrón decorativo.</td></tr>
<tr><td>Eco: hoja, globo, gota</td><td>❌ La sostenibilidad vive en el verde-estado y en la economía del trazo, no en iconos de naturaleza.</td></tr>
</table>
<div class="pull"><strong>Decisión:</strong> <em>diferenciarse</em>. El valor único de LOCIFY es el estado confiable al instante; el símbolo lo dice sin recurrir a un símbolo genérico ni a una P. El verde #00C853 se trata como <em>semáforo de disponibilidad</em>, coherente con la paleta del brief.</div>

<h2>4 · Divergencia (ideas antes de dibujar)</h2>
<p class="muted">1. P en placa ✗ · 2. Pin verde ✗ · 3. Auto en contrapicado ✗ · 4. Semáforo ✗ · 5. Hexágono con tick ✗ · 6. Traza de circuito ✗ · 7. Engranaje ✗ · 8. Hoja eco ✗ · 9. Candado abierto ✗ · 10. O como lente/radar ✗ · 11. Rejilla de celdas con una encendida ✓ · 12. Celda con puerta + tick que sale por ella ✓ · 13. Wordmark de un solo trazo con punto terminal verde ✓ · 14. «Y» bifurcada en chevron (descartada, débil)</p>
<p>Supervivientes agrupados en <strong>3 direcciones</strong>: <strong>A «Estado, no iconografía»</strong> · <strong>B «Infraestructura vista desde arriba»</strong> · <strong>C «Wordmark técnico ligado»</strong>.</p>
<div class="cols">
  <div class="card reco"><div class="sketch">{inline_svg('conceptos/concepto-1-via-libre.svg')}</div>
    <h3>C-1 «Vía libre» <span class="tag">Dirección A</span> <span class="tag">recomendado</span></h3>
    <p><em>Idea:</em> la celda (anillo cuadrado redondeado) tiene una puerta siempre abierta; el tick verde la confirma saliendo por ella. Disponibilidad = estado, no decoración.</p></div>
  <div class="card"><div class="sketch">{inline_svg('conceptos/concepto-2-la-celda-encendida.svg')}</div>
    <h3>C-2 «La celda encendida» <span class="tag">Dirección B</span></h3>
    <p><em>Idea:</em> el parqueadero visto desde arriba: todas las celdas silenciosas en azul, la celda libre en verde.</p></div>
  <div class="card"><div class="sketch">{inline_svg('conceptos/concepto-3-punto-y-seguido.svg')}</div>
    <h3>C-3 «Punto y seguido» <span class="tag">Dirección C</span></h3>
    <p><em>Idea:</em> wordmark de un trazo que termina en un punto verde: cada reserva termina bien. Wordmark-first.</p></div>
</div>

<h2>5 · Recomendación y racional</h2>
<p><strong>Se recomienda construir y producir C-1 «Vía libre».</strong></p>
<ul>
<li><strong>Acorde al posicionamiento:</strong> el tick verde que sale de una puerta siempre abierta es «cada operación queda confirmada» sin cerrar el sistema; a 16 px (favicon de la PWA) el símbolo sobrevive solo, sin nombre (gate wordmark: su idea «disponibilidad confirmada» se sostiene en una frase).</li>
<li><strong>Acorde al panorama:</strong> evita la P prohibida, el pin y el auto; nombra un único gesto (el check verde) como ancla, igual que la estrategia de marca: un solo dato nuevo destacado (estado) sobre una estructura confiable (celda azul).</li>
<li><strong>Runner-up C-2:</strong> simple y simpático, pero su diferencial vive del check interior y, a tamaño chico, la rejilla se lee como «símbolo de app genérica otra vez».</li>
<li><strong>Runner-up C-3:</strong> honesto con la regla wordmark-first, pero no deja símbolo: el favicon sería «LOCIFY.» con el verde desapareciendo a 16 px, y sin trazo propio no hay marca defendible en el favicon.</li>
</ul>

<h2>6 · Variantes (concepto recomendado)</h2>
<div class="cols">
  <div class="card"><h3>Lockup horizontal, full-color</h3>{inline_svg('svg/locify-lockup-horizontal-fullcolor.svg')}</div>
  <div class="card"><h3>Marca sola (mark-only), full-color</h3><div class="sketch">{inline_svg('svg/locify-marca-via-libre-fullcolor.svg')}</div></div>
</div>
<div class="cols">
  <div class="card"><h3>Lockup mono (grafito)</h3><div class="sketch">{inline_svg('svg/locify-lockup-horizontal-mono-grafito.svg')}</div></div>
  <div class="card"><h3>Lockup reverse sobre Azul Profundo</h3><div class="tile-dark"><div style="width:360px">{inline_svg('svg/locify-lockup-horizontal-reverse-blanco.svg')}</div></div></div>
</div>
<div class="cols">
  <div class="card"><h3>Marca mono</h3><div class="sketch">{inline_svg('svg/locify-marca-via-libre-mono-grafito.svg')}</div></div>
  <div class="card"><h3>Marca reverse (mostrar sobre azul profundo)</h3><div class="tile-dark">{inline_svg('svg/locify-marca-via-libre-reverse-blanco.svg')}</div></div>
  <div class="card"><h3>Stacked</h3><p class="muted">No se construye en v1: el nombre es una palabra corta y el lockup horizontal ya cubre los casos (header del dashboard, PWA standalone, botones de acción). Reabrir solo si aparece señalización física premium.</p></div>
</div>

<h2>7 · Validación por renderizado (inspeccionada, no afirmada)</h2>
<p>Renderizado con resvg sobre tiles claros/oscuros. <strong>Iteraciones:</strong> r1 se descartó (slash sobre el anillo = señal de prohibición) y se rediseñó como puerta+check; r2 centró el check en la puerta y escaló la marca 1.12× sobre la cap-height en el lockup.</p>
<img src="{data_uri('png/hoja-validacion.png')}" alt="Hoja de validación: marca a 16/32/48 px en claro y oscuro, lockups mono y reverse" style="width:100%;border:1px solid var(--borde);border-radius:10px">
<h3>Favicon real</h3>
<div style="display:flex;align-items:center;gap:18px">
  <img class="px" src="{data_uri('png/locify-marca-via-libre-fullcolor-16.png')}" width="16" height="16" alt="16 px">
  <img class="px" src="{data_uri('png/locify-marca-via-libre-fullcolor-32.png')}" width="32" height="32" alt="32 px">
  <img class="px" src="{data_uri('png/locify-marca-via-libre-fullcolor-48.png')}" width="48" height="48" alt="48 px">
  <span class="muted">← 16 / 32 / 48 px reales; la puerta mantiene el aire del check verde</span>
</div>

<h2>8 · Especificación (logo v1)</h2>
<h3>Posicionamiento</h3>
<p>«…convierte los cupos físicos en datos confiables al instante — lo que ves es lo que hay, y cada operación queda confirmada.»</p>
<h3>Colores (rol, no decor)</h3>
<table>
<tr><th>Nombre</th><th>HEX</th><th>Trabajo</th></tr>
<tr><td>Azul Acero</td><td>#2F5D9F</td><td>Celda (estructura de la marca) y acción primaria.</td></tr>
<tr><td>Azul Profundo</td><td>#244A80</td><td>Fondos para la versión reverse y estados hover.</td></tr>
<tr><td>Grafito</td><td>#1F2937</td><td>Wordmark y todas las versiones mono.</td></tr>
<tr><td>Verde (acento)</td><td>#00C853</td><td><strong>Solo</strong> estado: check / celda libre / confirmación. Nunca relleno decorativo, nunca &gt;25 % de la superficie.</td></tr>
<tr><td>Blanco</td><td>#FFFFFF</td><td>Versión reverse.</td></tr>
</table>
<h3>Tipografía</h3>
<p>Wordmark: <strong>Poppins SemiBold</strong> (SIL OFL 1.1) <em>delineado a paths en los masters — no se usa la fuente viva en ningún SVG.</em> Fallback UI: <code>system-ui, 'Segoe UI', sans-serif</code> para el resto del sistema visual v2.</p>
<h3>Área de exclusión (clearspace)</h3>
<p><strong>x = 25 % de la altura de la marca</strong> (≈ 16 px de la caja de 96). Mantener <em>x</em> en los cuatro lados; el check sale por la puerta y necesita ese aire: nada invade el área marcada, ni siquiera otros elementos de la marca.</p>
<h3>Tamaños mínimos</h3>
<ul>
<li>Marca sola: 16 px (favicon) — validado en la hoja de la sección 7.</li>
<li>Lockup horizontal: 96 px de alto en pantalla; 28 mm en impreso.</li>
</ul>
<h3>Tres no-hacer (específicas de esta marca)</h3>
<ol>
<li><strong>No recolorear ni rotar el check</strong>: el verde es un estado del producto, no un acento; rotarlo rompe identidad (r1 se descartó por eso).</li>
<li><strong>No reconstruir el wordmark con la fuente viva</strong> (ni con otra): los masters son paths; la única fuente correcta es el archivo Poppins OFL adjunto.</li>
<li><strong>No usar el lockup full-color sobre verde, ni sobre foto con caos de contraste</strong>: usar mono/reverse con banda, o cambiar el fondo.</li>
</ol>

<h2>9 · Manifiesto de archivos + colisión de nombre</h2>
<table>
<tr><th>Archivo</th><th>Qué es</th></tr>
<tr><td><code>svg/locify-marca-via-libre-fullcolor.svg</code></td><td>Master de la marca full-color (recomendado C-1)</td></tr>
<tr><td><code>svg/locify-marca-via-libre-mono-grafito.svg</code> · <code>…reverse-blanco.svg</code></td><td>Colorways de la marca (misma geometría, un color).</td></tr>
<tr><td><code>svg/locify-lockup-horizontal-fullcolor.svg</code> (+ mono, + reverse)</td><td>Lockup horizontal (marca + LOCIFY en Poppins delineada).</td></tr>
<tr><td><code>conceptos/concepto-1-via-libre.svg</code> · <code>-2-la-celda-encendida.svg</code> · <code>-3-punto-y-seguido.svg</code></td><td>Bocetos de los 3 conceptos (evidencia de divergencia).</td></tr>
<tr><td><code>png/locify-marca-via-libre-fullcolor-16/32/48/180/192/512.png</code></td><td>Set de favicon / PWA (180 = apple-touch, 192/512 = Android).</td></tr>
<tr><td><code>png/hoja-validacion.png</code> · <code>png/locify-lockup-horizontal-*.png</code></td><td>Evidencia de render validada a la vista.</td></tr>
<tr><td><code>especificacion-logo.md</code> · <code>board-locify.html</code> · <code>.brandwork/</code></td><td>Espec, este board y los scripts reproducibles (outline Poppins + compose).</td></tr>
</table>
<h3>Masters: paths only ✅</h3>
<p class="muted">Gate automatizado <code>Select-String</code> sobre <code>svg/*.svg</code> y <code>conceptos/*.svg</code> buscando <code>font-family|&lt;text|&lt;image|href</code>: <strong>0 coincidencias</strong>. Tipografía usada: Poppins (SIL OFL 1.1, libre) — licencia documentada.</p>
<div class="warn"><strong>Colisión de nombre — sin verificar.</strong> La búsqueda web no estuvo disponible en esta sesión; no se detectó de forma automatizada si «LOCIFY» ya está en uso en el rubro (ni el estado del dominio <code>locify.com</code>). Antes de invertir en la marca: registrar el dominio y hacer búsqueda de marca (movilidad/SaaS). Este aviso no es asesoría legal.</div>

</body></html>"""

out = BRAND / "board-locify.html"
out.write_text(html)
print("board written:", out, len(html), "bytes")
