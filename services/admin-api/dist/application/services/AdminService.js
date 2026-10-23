"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const RegistrarOperador_1 = require("../../domain/use-cases/RegistrarOperador");
class AdminService {
    registrarOperadorUseCase;
    constructor(usuarioRepository, emailService) {
        this.registrarOperadorUseCase = new RegistrarOperador_1.RegistrarOperadorUseCase(usuarioRepository, emailService);
    }
    async registrarOperador(email, passwordHash) {
        return this.registrarOperadorUseCase.ejecutar({ email, passwordHash });
    }
}
exports.AdminService = AdminService;
