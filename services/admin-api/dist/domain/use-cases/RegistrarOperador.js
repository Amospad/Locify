"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarOperadorUseCase = void 0;
const Usuario_1 = require("../entities/Usuario");
const crypto_1 = require("crypto");
class RegistrarOperadorUseCase {
    usuarioRepository;
    emailService;
    constructor(usuarioRepository, emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }
    async ejecutar(dto) {
        // 1. Validar que el correo no exista
        const usuarioExistente = await this.usuarioRepository.buscarPorEmail(dto.email);
        if (usuarioExistente) {
            throw new Error('El correo ya está registrado en el sistema.');
        }
        // 2. Generar token de invitación (24 horas)
        const tokenInvitacion = (0, crypto_1.randomUUID)();
        const tokenExpiracion = new Date();
        tokenExpiracion.setHours(tokenExpiracion.getHours() + 24);
        // 3. Crear la entidad (aquí se aplican las reglas de negocio)
        const nuevoOperador = Usuario_1.Usuario.crear({
            id: (0, crypto_1.randomUUID)(),
            email: dto.email,
            passwordHash: dto.passwordHash,
            rol: Usuario_1.RolUsuario.OPERADOR,
            estado: Usuario_1.EstadoUsuario.PENDIENTE,
            tokenInvitacion,
            tokenExpiracion,
        });
        // 4. Persistir en base de datos (a través del puerto)
        await this.usuarioRepository.guardar(nuevoOperador);
        // 5. Enviar correo de invitación (a través del puerto)
        await this.emailService.enviarInvitacion(nuevoOperador.email, tokenInvitacion);
    }
}
exports.RegistrarOperadorUseCase = RegistrarOperadorUseCase;
