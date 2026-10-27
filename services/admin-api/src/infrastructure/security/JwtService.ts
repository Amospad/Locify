import { SignJWT, jwtVerify } from 'jose';
import { RolUsuario } from '../../domain/entities/Usuario.js';
import { TokenInvalidoError } from '../../domain/errors/TokenInvalidoError.js';
import type {
  ContenidoToken,
  ServicioDeTokens,
} from '../../domain/ports/ServicioDeTokens.js';

/** Estrategia de firma: HS256 con un secreto compartido de al menos 32 bytes. */
const ALGORITMO = 'HS256';
const MINIMO_CARACTERES_SECRETO = 32;

export interface OpcionesJwt {
  secreto: string;
  emisor: string;
  audiencia: string;
  /** Vigencia: número de segundos o cadena tipo `1h`, `15m`, `7d`. */
  expiraEn: string | number;
}

function opcional(valor: string | undefined, porDefecto: string): string {
  const limpio = valor?.trim();
  return limpio ? limpio : porDefecto;
}

/**
 * Lee y valida la configuración JWT del entorno.
 *
 * `JWT_SECRET` es obligatoria y debe tener al menos 32 caracteres: HS256 con
 * un secreto corto es adivinable por fuerza bruta offline. Un fallo aquí
 * detiene el arranque en lugar de firmar tokens débiles.
 */
export function opcionesJwtDesdeEntorno(
  entorno: NodeJS.ProcessEnv = process.env,
): OpcionesJwt {
  const secreto = entorno['JWT_SECRET']?.trim();

  if (!secreto) {
    throw new Error(
      'JWT_SECRET no está definida. Sin secreto no se pueden firmar tokens de acceso.',
    );
  }

  if (secreto.length < MINIMO_CARACTERES_SECRETO) {
    throw new Error(
      `JWT_SECRET debe tener al menos ${MINIMO_CARACTERES_SECRETO} caracteres; ` +
        `tiene ${secreto.length}. Genérelo con: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`,
    );
  }

  return {
    secreto,
    emisor: opcional(entorno['JWT_ISSUER'], 'locify-admin-api'),
    audiencia: opcional(entorno['JWT_AUDIENCE'], 'locify'),
    expiraEn: opcional(entorno['JWT_EXPIRES_IN'], '1h'),
  };
}

function esRol(valor: unknown): valor is RolUsuario {
  return (
    typeof valor === 'string' &&
    (Object.values(RolUsuario) as string[]).includes(valor)
  );
}

/**
 * Adaptador de `ServicioDeTokens` sobre JWT firmado (HS256, librería `jose`).
 *
 * El token viaja en `Authorization: Bearer …`. No se guarda en la base: la
 * validez la da la firma y la expiración. Un token emitido antes de suspender
 * una cuenta sigue siendo válido hasta expirar; por eso la vigencia es corta
 * (1 h por defecto) y la autorización por rol se comprueba en cada petición.
 */
export class JwtService implements ServicioDeTokens {
  private readonly opciones: OpcionesJwt;
  private readonly clave: Uint8Array;

  constructor(opciones: OpcionesJwt) {
    this.opciones = opciones;
    this.clave = new TextEncoder().encode(opciones.secreto);
  }

  async firmar(contenido: ContenidoToken): Promise<string> {
    return new SignJWT({ email: contenido.email, rol: contenido.rol })
      .setProtectedHeader({ alg: ALGORITMO })
      .setSubject(contenido.sub)
      .setIssuedAt()
      .setIssuer(this.opciones.emisor)
      .setAudience(this.opciones.audiencia)
      .setExpirationTime(this.opciones.expiraEn)
      .sign(this.clave);
  }

  async verificar(token: string): Promise<ContenidoToken> {
    let payload: Record<string, unknown>;

    try {
      ({ payload } = await jwtVerify(token, this.clave, {
        algorithms: [ALGORITMO],
        issuer: this.opciones.emisor,
        audience: this.opciones.audiencia,
      }));
    } catch {
      // Firma inválida, token expirado, emisor/audiencia ajenos o formato roto.
      throw new TokenInvalidoError();
    }

    const { sub, email, rol } = payload;

    if (
      typeof sub !== 'string' ||
      sub.length === 0 ||
      typeof email !== 'string' ||
      !esRol(rol)
    ) {
      throw new TokenInvalidoError('El token no contiene los datos esperados.');
    }

    return { sub, email, rol };
  }
}
