// Punto de entrada del módulo admin-api: construye el servidor HTTP y lo pone a escuchar.
import 'dotenv/config';

const PUERTO_POR_DEFECTO = 3000;
const puerto = Number(process.env['PORT'] ?? PUERTO_POR_DEFECTO);

if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
  console.error(
    `[admin-api] PORT inválido: "${process.env['PORT']}". Debe ser un entero entre 1 y 65535.`,
  );
  process.exit(1);
}

if (!process.env['DATABASE_URL']) {
  console.error('[admin-api] DATABASE_URL no está definida. Copia .env.example a .env.');
  process.exit(1);
}

// Importación dinámica para que el mensaje anterior salga antes de que
// `prisma/db.ts` intente conectarse con una URL ausente.
const [
  { buildServer },
  { PostgresConsultadorDeBaseDeDatos },
  { PostgresUsuarioRepository },
  { Argon2Hasher },
  { CryptoGeneradorId },
  { RelojSistema },
  { EmailConsola },
  { AdminService },
] = await Promise.all([
  import('./interfaces/http/server.js'),
  import('./infrastructure/persistence/PostgresConsultadorDeBaseDeDatos.js'),
  import('./infrastructure/persistence/PostgresUsuarioRepository.js'),
  import('./infrastructure/security/Argon2Hasher.js'),
  import('./infrastructure/id/CryptoGeneradorId.js'),
  import('./infrastructure/time/RelojSistema.js'),
  import('./infrastructure/email/EmailConsola.js'),
  import('./application/services/AdminService.js'),
]);

const db = new PostgresConsultadorDeBaseDeDatos();

// El adaptador de correo es el único que puede negarse a arrancar en
// producción (imprimir el token de invitación en un log sería una fuga).
const emailService = (() => {
  try {
    return new EmailConsola();
  } catch (error) {
    console.error(
      `[admin-api] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
})();

/**
 * Composition root: único lugar que conoce adaptadores concretos.
 * El dominio y la capa HTTP sólo ven puertos.
 */
const adminService = new AdminService(
  new PostgresUsuarioRepository(),
  emailService,
  new CryptoGeneradorId(),
  new RelojSistema(),
  new Argon2Hasher(),
);

const app = await buildServer({ db, adminService }, { logger: true });

try {
  await app.listen({ port: puerto, host: process.env['HOST'] ?? '0.0.0.0' });
} catch (error) {
  app.log.error({ err: error }, 'No se pudo iniciar el servidor HTTP');
  await db.cerrar();
  process.exit(1);
}

async function apagar(senal: string): Promise<void> {
  app.log.info(`Señal ${senal} recibida: cerrando servidor y base de datos`);
  await app.close();
  await db.cerrar();
}

for (const senal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(senal, () => {
    apagar(senal)
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        console.error('[admin-api] Falló el apagado ordenado', error);
        process.exit(1);
      });
  });
}
