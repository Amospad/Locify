export interface DatosOtp {
  emailDestino: string;
  codigo: string;
  remitente: string;
}

export interface CorreoOtp {
  asunto: string;
  texto: string;
  html: string;
}

const MINUTOS_VIGENCIA = 15;

const ENTIDADES_HTML: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Los valores vienen del dominio y del entorno; se escapan antes de tocar HTML. */
function escaparHtml(valor: string): string {
  return valor.replace(/[&<>"']/g, (caracter) => ENTIDADES_HTML[caracter] ?? caracter);
}

/**
 * Plantilla del código OTP: HTML + texto plano.
 */
export function construirOtp(datos: DatosOtp): CorreoOtp {
  const codigo = escaparHtml(datos.codigo);
  const remitente = escaparHtml(datos.remitente);

  return {
    asunto: 'Tu código de verificación LOCIFY',
    texto: [
      'Hola,',
      '',
      `Tu código de verificación para LOCIFY es: ${datos.codigo}`,
      '',
      `Este código expira en ${MINUTOS_VIGENCIA} minutos.`,
      'Si no solicitaste este código, ignora este correo.',
      '',
      remitente,
    ].join('\n'),
    html: `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <tr>
        <td>
          <h1 style="margin:0 0 16px;font-size:20px;">Verifica tu cuenta</h1>
          <p style="margin:0 0 16px;line-height:1.5;">
            Tu código de verificación para LOCIFY es:
          </p>
          <p style="margin:0 0 24px;font-family:monospace;font-size:32px;background:#f3f4f6;padding:24px;border-radius:8px;text-align:center;letter-spacing:8px;font-weight:bold;color:#0f766e;">
            ${codigo}
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#4b5563;">
            Este código expira en ${MINUTOS_VIGENCIA} minutos.
          </p>
          <p style="margin:0;font-size:12px;color:#6b7280;">
            Si no solicitaste este código, ignora este correo.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}