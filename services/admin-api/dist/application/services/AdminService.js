import { RegistrarOperadorUseCase } from '../../domain/use-cases/RegistrarOperador.js';
export class AdminService {
    registrarOperadorUseCase;
    constructor(usuarioRepository, emailService) {
        this.registrarOperadorUseCase = new RegistrarOperadorUseCase(usuarioRepository, emailService);
    }
    async registrarOperador(email, passwordHash) {
        return this.registrarOperadorUseCase.ejecutar({ email, passwordHash });
    }
}
