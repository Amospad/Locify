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

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
}

export async function obtenerSedes(): Promise<Sede[]> {
  try {
    const respuesta = await fetch(`${URL_BASE}/api/sedes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    return (await respuesta.json()) as Sede[];
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
  }
}

export interface ReservaCreada {
  id: string;
  codigoQr: string;
  sedeId: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  sede?: {
    id: string;
    nombre: string;
    direccion: string;
    precioHora: number;
  };
}

export class ErrorDeReserva extends Error {
  constructor(
    mensaje: string,
    readonly codigo: number,
  ) {
    super(mensaje);
    this.name = 'ErrorDeReserva';
  }
}

export async function crearReserva(
  sedeId: string,
  modalidad: 'GARANTIZADA' | 'EXPRES',
  tokenTarjeta?: string,
): Promise<ReservaCreada> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new ErrorDeReserva('No hay sesión activa. Inicia sesión primero.', 401);
  }

  let respuesta: Response;

  try {
    respuesta = await fetch(`${URL_BASE}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sesion.token}`,
      },
      body: JSON.stringify({ sedeId, modalidad, ...(tokenTarjeta && { tokenTarjeta }) }),
    });
  } catch {
    throw new ErrorDeReserva(
      'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
      0,
    );
  }

  if (respuesta.ok) {
    return (await respuesta.json()) as ReservaCreada;
  }

  const cuerpo = (await respuesta.json().catch(() => null)) as {
    error?: unknown;
  } | null;
  const mensajeServidor =
    typeof cuerpo?.error === 'string' ? cuerpo.error : undefined;

  const mensajes: Record<number, string> = {
    400: mensajeServidor ?? 'Datos inválidos o ya tienes una reserva activa.',
    401: 'Tu sesión expiró. Inicia sesión de nuevo.',
    404: 'La sede seleccionada no existe.',
    409: 'No se pudo generar el código QR. Inténtalo de nuevo.',
    429: 'Demasiadas peticiones. Espera un momento.',
  };

  throw new ErrorDeReserva(
    mensajes[respuesta.status] ??
      mensajeServidor ??
      'Error inesperado del servidor. Inténtalo de nuevo.',
    respuesta.status,
  );
}

export interface ReservaActiva {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  nombreSede: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  fechaEntrada: string;
  duracionMinutos: number;
}

export interface CheckInResultado {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  fechaEntrada: string;
}

export interface CheckOutResultado {
  id: string;
  codigoQr: string;
  usuarioId: string;
  sedeId: string;
  fechaEntrada: string;
  fechaSalida: string;
  duracionMinutos: number;
}

export async function listarReservasActivas(sedeId: string): Promise<ReservaActiva[]> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay sesión activa');
  }

  const respuesta = await fetch(`${URL_BASE}/api/operador/reservas-activas?sedeId=${encodeURIComponent(sedeId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error('Error al obtener reservas activas');
  }

  return (await respuesta.json()) as ReservaActiva[];
}

export async function checkInReserva(codigoQr: string): Promise<CheckInResultado> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay sesión activa');
  }

  const respuesta = await fetch(`${URL_BASE}/api/operador/check-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify({ codigoQr }),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error en check-in');
  }

  return (await respuesta.json()) as CheckInResultado;
}

export async function checkOutReserva(reservaId: string): Promise<CheckOutResultado> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay sesión activa');
  }

  const respuesta = await fetch(`${URL_BASE}/api/operador/check-out`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify({ reservaId }),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error en check-out');
  }

  return (await respuesta.json()) as CheckOutResultado;
}

export interface ReservaUsuario {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  estado: 'ACTIVA' | 'FINALIZADA' | 'CANCELADA' | 'EXPIRADA';
  fechaEntrada: string;
  fechaSalida: string | null;
}

export interface ReservaActivaUsuario {
  id: string;
  codigoQr: string;
  sedeId: string;
  nombreSede: string;
  direccionSede: string;
  modalidad: 'GARANTIZADA' | 'EXPRES';
  estado: 'ACTIVA';
  fechaEntrada: string;
}

export async function listarMisReservas(): Promise<ReservaUsuario[]> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay sesión activa');
  }

  const respuesta = await fetch(`${URL_BASE}/api/reservas/mis-reservas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al obtener mis reservas');
  }

  return (await respuesta.json()) as ReservaUsuario[];
}

export async function obtenerReservaActiva(): Promise<ReservaActivaUsuario | null> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay sesión activa');
  }

  const respuesta = await fetch(`${URL_BASE}/api/reservas/activa`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al obtener reserva activa');
  }

  return (await respuesta.json()) as ReservaActivaUsuario | null;
}
