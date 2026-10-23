"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = exports.EstadoUsuario = exports.RolUsuario = void 0;
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["CONDUCTOR"] = "CONDUCTOR";
    RolUsuario["OPERADOR"] = "OPERADOR";
    RolUsuario["ADMIN"] = "ADMIN";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
var EstadoUsuario;
(function (EstadoUsuario) {
    EstadoUsuario["PENDIENTE"] = "PENDIENTE";
    EstadoUsuario["ACTIVO"] = "ACTIVO";
    EstadoUsuario["SUSPENDIDO"] = "SUSPENDIDO";
})(EstadoUsuario || (exports.EstadoUsuario = EstadoUsuario = {}));
class Usuario {
    props;
    constructor(props) {
        this.props = props;
    }
    // Getters
    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get rol() { return this.props.rol; }
    get estado() { return this.props.estado; }
    get tokenInvitacion() { return this.props.tokenInvitacion; }
    get tokenExpiracion() { return this.props.tokenExpiracion; }
    // Reglas de negocio (Métodos)
    estaActivo() {
        return this.props.estado === EstadoUsuario.ACTIVO;
    }
    puedeAccederAlDashboard() {
        return this.estaActivo() && !this.tokenHaExpirado();
    }
    tokenHaExpirado() {
        if (!this.props.tokenExpiracion)
            return false;
        return new Date() > this.props.tokenExpiracion;
    }
    // Fábrica estática para crear usuarios de forma controlada
    static crear(props) {
        if (!props.email.includes('@')) {
            throw new Error('El email no es válido');
        }
        return new Usuario(props);
    }
}
exports.Usuario = Usuario;
