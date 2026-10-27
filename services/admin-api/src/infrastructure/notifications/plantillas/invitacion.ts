export interface DatosInvitacion {
  emailDestino: string;
  enlace: string;
  token: string;
  remitente: string;
}

export interface CorreoInvitacion {
  asunto: string;
  texto: string;
  html: string;
}

const HORAS_VIGENCIA = 24;

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
 * Plantilla de la invitación de operador: HTML + texto plano.
 *
 * El token viaja en el enlace y también como texto, para quien lea el correo
 * en un cliente que no permite abrir enlaces.
 */
export function construirInvitacion(datos: DatosInvitacion): CorreoInvitacion {
  const enlace = escaparHtml(datos.enlace);
  const token = escaparHtml(datos.token);
  const remitente = escaparHtml(datos.remitente);

  return {
    asunto: 'Activa tu cuenta de operador en LOCIFY',
    texto: [
      'Hola,',
      '',
      `Se creó o renovó una invitación para administrar parqueaderos en LOCIFY con el correo ${datos.emailDestino}.`,
      '',
      'Activa tu cuenta en este enlace:',
      datos.enlace,
      '',
      `Código de invitación: ${datos.token}`,
      '',
      `El enlace caduca en ${HORAS_VIGENCIA} horas. Si no esperabas este correo, ignóralo.`,
      '',
      remitente,
    ].join('\n'),
    html: `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <tr>
        <td>
          <h1 style="margin:0 0 16px;font-size:20px;">Activa tu cuenta de operador</h1>
          <p style="margin:0 0 16px;line-height:1.5;">
            Se creó o renovó una invitación para administrar parqueaderos en LOCIFY
            con el correo <strong>${escaparHtml(datos.emailDestino)}</strong>.
          </p>
          <p style="margin:0 0 24px;">
            <a href="${enlace}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;">
              Activar mi cuenta
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#4b5563;">
            Si el botón no funciona, copia este enlace en tu navegador:
          </p>
          <p style="margin:0 0 24px;font-size:14px;word-break:break-all;">
            <a href="${enlace}" style="color:#0f766e;">${enlace}</a>
          </p>
          <p style="margin:0 0 8px;font-size:14px;">Código de invitación:</p>
          <p style="margin:0 0 24px;font-family:monospace;font-size:16px;background:#f3f4f6;padding:12px;border-radius:6px;">
            ${token}
          </p>
          <p style="margin:0;font-size:12px;color:#6b7280;">
            El enlace caduca en ${HORAS_VIGENCIA} horas. Si no esperabas este correo, ignóralo.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}
