/**
 * Cliente del admin-api que corre en el navegador.
 *
 * La URL del backend llega por `NEXT_PUBLIC_API_URL` (se inliedea en el build);
 * sin la variable, apunta al puerto por defecto del `admin-api` (3000). En
 * desarrollo local ambos servidores no pueden compartir puerto: el front va
 * en 3000 y el admin-api en 3001 (ver `.env.example`).
 */
const URL_BASE =
  process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000';

export interface SesionIniciada {
  token: string;
  usuario: {
    id: string;
    email: string;
    rol: 'CONDUCTOR' | 'OPERADOR' | 'ADMIN';
  };
}

/** Error de login con código HTTP para que la UI decida qué mostrar. */
export class ErrorDeLogin extends Error {
  constructor(
    mensaje: string,
    readonly codigo: number,
  ) {
    super(mensaje);
    this.name = 'ErrorDeLogin';
  }
}

/**
 * `POST /api/auth/login` (RF-07 del admin-api).
 *
 * Traduce la respuesta del backend a mensajes accionables:
 * - 401 → credenciales incorrectas (el mensaje genérico del backend no
 *   revela si el email existe o no, y aquí se respeta).
 * - 403 → credenciales válidas pero cuenta PENDIENTE o SUSPENDIDA.
 * - 429 → límite de 5 intentos por minuto del rate limit.
 * - 0   → el backend no responde (servidor apagado o CORS bloqueado).
 */
export async function login(
  email: string,
  password: string,
): Promise<SesionIniciada> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${URL_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ErrorDeLogin(
      'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
      0,
    );
  }

  if (respuesta.ok) {
    const cuerpo = (await respuesta.json()) as {
      token: string;
      user: SesionIniciada['usuario'];
    };
    return { token: cuerpo.token, usuario: cuerpo.user };
  }

  const cuerpo = (await respuesta.json().catch(() => null)) as {
    error?: unknown;
  } | null;
  const mensajeServidor =
    typeof cuerpo?.error === 'string' ? cuerpo.error : undefined;

  const mensajes: Record<number, string> = {
    400: 'Revisa los datos: email y contraseña son obligatorios.',
    401: 'Email o contraseña incorrectos.',
    403: 'Tu cuenta no está activa. Actívala desde la invitación o contacta a un administrador.',
    429: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
  };

  throw new ErrorDeLogin(
    mensajes[respuesta.status] ??
      mensajeServidor ??
      'Error inesperado del servidor. Inténtalo de nuevo.',
    respuesta.status,
  );
}

/*
 * Sesión en el navegador. Por ahora viaja en localStorage (plan del MVP);
 * la migración a cookie httpOnly es la misma que pide docs/formativo
 * §2.2 y queda registrada como pendiente de seguridad.
 */
const LLAVE_SESION = 'locify.sesion';

export function guardarSesion(sesion: SesionIniciada): void {
  window.localStorage.setItem(LLAVE_SESION, JSON.stringify(sesion));
}

export function obtenerSesion(): SesionIniciada | null {
  const crudo = window.localStorage.getItem(LLAVE_SESION);
  if (!crudo) return null;

  try {
    const sesion = JSON.parse(crudo) as SesionIniciada;
    return sesion.token && sesion.usuario ? sesion : null;
  } catch {
    return null;
  }
}

export function cerrarSesion(): void {
  window.localStorage.removeItem(LLAVE_SESION);
}
