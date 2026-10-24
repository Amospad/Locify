import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  formativoSidebar: [
    { type: 'doc', id: 'formativo/acta-constitucion', label: '01. Acta de Constitución' },
    { type: 'doc', id: 'formativo/stakeholders', label: '02. Stakeholders' },
    { type: 'doc', id: 'formativo/alcance-requerimientos', label: '03. Alcance y Requerimientos' },
    { type: 'doc', id: 'formativo/casos-uso', label: '04. Casos de Uso' },
    { type: 'doc', id: 'formativo/historias-usuario', label: '05. Historias de Usuario' },
    { type: 'doc', id: 'formativo/antecedentes-justificacion', label: '06. Antecedentes y Justificación' },
  ],
  
  tecnicoSidebar: [
    'tecnico/arquitectura-hexagonal', // <-- AQUÍ: sin "explicacion"
    { type: 'doc', id: 'tecnico/referencia/modelo-datos', label: 'Modelo de Datos' },
    { type: 'doc', id: 'adr/ADR-001-arquitectura-hexagonal', label: 'ADR-001: Arquitectura Hexagonal' },
    { type: 'doc', id: 'adr/ADR-002-modelo-hibrido-reservas', label: 'ADR-002: Modelo Híbrido' },
  ],
};

export default sidebars;