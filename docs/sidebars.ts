import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  formativoSidebar: [
    {
      type: 'category',
      label: '01. Formulación y Constitución',
      items: [
        'formativo/formulacion-constitucion',
      ],
    },
    {
      type: 'category',
      label: '02. Stakeholders',
      items: [
        'formativo/stakeholders',
      ],
    },
    {
      type: 'category',
      label: '03. Alcance y Requerimientos',
      items: [
        'formativo/alcance-requerimientos',
      ],
    },
    {
      type: 'category',
      label: '04. Casos de Uso',
      items: [
        'formativo/indice-casos-uso',
        'formativo/casos-uso',
      ],
    },
    {
      type: 'category',
      label: '05. Historias de Usuario',
      items: [
        'formativo/historias-usuario',
      ],
    },
    {
      type: 'category',
      label: '06. Antecedentes y Justificación',
      items: [
        'formativo/antecedentes-justificacion',
      ],
    },
    {
      type: 'category',
      label: '07. Matriz de Trazabilidad',
      items: [
        'formativo/matriz-trazabilidad',
      ],
    },
    {
      type: 'category',
      label: '08. Manual de Usuario',
      items: [
        'formativo/manual-usuario',
      ],
    },
    {
      type: 'category',
      label: '09. Manual del Operador',
      items: [
        'formativo/manual-operador',
      ],
    },
    {
      type: 'category',
      label: '10. Manual de Instalación',
      items: [
        'formativo/manual-instalacion',
      ],
    },
  ],
  tecnicoSidebar: [
    {
      type: 'category',
      label: 'Arquitectura',
      items: [
        'tecnico/arquitectura-hexagonal',
        'tecnico/arquitectura-agentes',
      ],
    },
    {
      type: 'category',
      label: 'Referencia Técnica',
      items: [
        'tecnico/referencia/modelo-datos',
        'tecnico/referencia/guia-diseno-ui',
        'tecnico/referencia/integraciones',
        'tecnico/referencia/diagramas-flujos',
        'tecnico/referencia/glosario',
        'tecnico/referencia/mapa-flujos-usuario',
      ],
    },
    {
      type: 'category',
      label: 'Flujos Técnicos',
      items: [
        'tecnico/flujos/indice-flujos',
        'tecnico/flujos/flujo-01-autenticacion',
        'tecnico/flujos/flujo-02-busqueda-reserva',
        'tecnico/flujos/flujo-03-acceso-uso',
        'tecnico/flujos/flujo-04-cancelacion',
        'tecnico/flujos/flujo-05-historial',
        'tecnico/flujos/flujo-06-onboarding-kyb',
        'tecnico/flujos/flujo-07-gestion-vehiculos-soporte',
        'tecnico/flujos/flujo-08-reportes-penalidades',
        'tecnico/flujos/flujo-09-gestion-operativa-parqueadero',
        'tecnico/flujos/flujo-10-gestion-reservas-parqueadero',
        'tecnico/flujos/flujo-11-control-vehiculos-tiempos',
        'tecnico/flujos/flujo-12-gestion-usuarios-parqueadero',
        'tecnico/flujos/flujo-13-modulo-administrador',
        'tecnico/flujos/flujo-14-dashboard-cliente',
      ],
    },
    {
      type: 'category',
      label: 'Guía de Diseño UI',
      items: [
        'tecnico/guia-diseno-ui',
      ],
    },
  ],
  adrSidebar: [
    'adr/ADR-001-arquitectura-hexagonal',
    'adr/ADR-002-modelo-hibrido-reservas',
    'adr/ADR-003-monolito-modular-vs-microservicios',
    'adr/ADR-004-fastify-como-framework-http',
    'adr/ADR-005-arquitectura-dual-nextjs-fastify',
  ],
  gestionSidebar: [
    {
      type: 'category',
      label: 'Roadmap y Sprints',
      items: [
        'gestion/roadmap-sprints',
      ],
    },
    {
      type: 'category',
      label: 'Despliegue',
      items: [
        'gestion/despliegue',
      ],
    },
    {
      type: 'category',
      label: 'Gestión de Interesados',
      items: [
        'gestion/gestion-interesados-proyecto',
      ],
    },
  ],
};

export default sidebars;