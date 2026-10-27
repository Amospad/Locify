export var RolUsuario;
(function (RolUsuario) {
    RolUsuario["CONDUCTOR"] = "CONDUCTOR";
    RolUsuario["OPERADOR"] = "OPERADOR";
    RolUsuario["ADMIN"] = "ADMIN";
})(RolUsuario || (RolUsuario = {}));
export var EstadoUsuario;
(function (EstadoUsuario) {
    EstadoUsuario["PENDIENTE"] = "PENDIENTE";
    EstadoUsuario["ACTIVO"] = "ACTIVO";
    EstadoUsuario["SUSPENDIDO"] = "SUSPENDIDO";
})(EstadoUsuario || (EstadoUsuario = {}));
export class Usuario {
    props;
    constructor(props) {
        this.props = props;
    }
    // Getters
    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
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
    // Rehidrata un usuario que ya existe en persistencia. No revalida los datos:
    // son un hecho consumado, validarlos aquí impediría leer registros históricos.
    static reconstituir(props) {
        return new Usuario(props);
    }
}
