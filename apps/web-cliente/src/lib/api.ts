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

export async function registrar(
  email: string,
  password: string,
  nombre: string,
  celular: string,
): Promise<{ id: string; email: string }> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${URL_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre, celular }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  if (respuesta.ok) {
    return (await respuesta.json()) as { id: string; email: string };
  }

  const cuerpo = (await respuesta.json().catch(() => null)) as {
    error?: string;
  } | null;

  if (respuesta.status === 409) {
    throw new Error(cuerpo?.error ?? 'El email ya está registrado.');
  }

  throw new Error(cuerpo?.error ?? 'Error al registrar usuario.');
}

export async function verificarOtp(
  email: string,
  codigo: string,
): Promise<{ id: string; email: string; rol: string }> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${URL_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, codigo }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  if (respuesta.ok) {
    return (await respuesta.json()) as { id: string; email: string; rol: string };
  }

  const cuerpo = (await respuesta.json().catch(() => null)) as {
    error?: string;
  } | null;

  if (respuesta.status === 422) {
    throw new Error(cuerpo?.error ?? 'Código incorrecto o expirado.');
  }

  throw new Error(cuerpo?.error ?? 'Error al verificar el código.');
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

export interface EstadoKYB {
  estado: 'PENDIENTE' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
  mensaje?: string;
  fecha?: string;
}

export async function obtenerEstadoKYB(operatorId: string): Promise<EstadoKYB> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/kyb/status/${encodeURIComponent(operatorId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al obtener estado KYB');
  }

  return (await respuesta.json()) as EstadoKYB;
}

export async function subirDocumentosKYB(operatorId: string, urlRut: string, urlCamaraComercio: string): Promise<void> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/kyb/subir-documentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify({ operatorId, urlRut, urlCamaraComercio }),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al subir documentos');
  }
}

export interface TicketKYB {
  id: string;
  operatorId: string;
  nombreSede: string;
  estado: 'PENDIENTE' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
  motivo?: string;
}

export async function listarTicketsKYBPendientes(): Promise<TicketKYB[]> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/admin/kyb/pendientes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al listar tickets KYB');
  }

  return (await respuesta.json()) as TicketKYB[];
}

export async function cambiarEstadoTicketKYB(id: string, estado: 'APROBADO' | 'RECHAZADO', motivo?: string): Promise<void> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/admin/kyb/${encodeURIComponent(id)}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify({ estado, motivo }),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error al cambiar estado');
  }
}

export interface SedeOperador {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
  estado: string;
}

export interface CrearSedePayload {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  capacidadTotal: number;
  precioHora: number;
}

export async function listarSedesOperador(): Promise<SedeOperador[]> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/operador/sedes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error al listar sedes' }));
    throw new Error(error.error || 'Error al listar sedes');
  }

  return (await respuesta.json()) as SedeOperador[];
}

export async function crearSedeOperador(datos: CrearSedePayload): Promise<{ sedeId: string; nombre: string }> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/operador/sedes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error al crear sede' }));
    throw new Error(error.error || 'Error al crear sede');
  }

  return (await respuesta.json()) as { sedeId: string; nombre: string };
}

export async function actualizarSedeOperador(
  id: string,
  datos: Partial<CrearSedePayload>,
): Promise<{ sedeId: string; nombre: string }> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/operador/sedes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error al actualizar sede' }));
    throw new Error(error.error || 'Error al actualizar sede');
  }

  return (await respuesta.json()) as { sedeId: string; nombre: string };
}

export async function eliminarSedeOperador(id: string): Promise<{ sedeId: string }> {
  const sesion = obtenerSesion();
  if (!sesion) throw new Error('No hay sesión activa');

  const respuesta = await fetch(`${URL_BASE}/api/operador/sedes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sesion.token}`,
    },
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: 'Error al eliminar sede' }));
    throw new Error(error.error || 'Error al eliminar sede');
  }

  return (await respuesta.json()) as { sedeId: string };
}
