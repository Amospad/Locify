import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  formativoSidebar: [
    { type: 'doc', id: 'formativo/formulacion-constitucion', label: '01. Formulación y Constitución' },
    { type: 'doc', id: 'formativo/alcance-requerimientos', label: '03. Alcance y Requerimientos' },
    { type: 'doc', id: 'formativo/casos-uso', label: '04. Casos de Uso' },
    { type: 'doc', id: 'formativo/historias-usuario', label: '05. Historias de Usuario' },
    { type: 'doc', id: 'formativo/antecedentes-justificacion', label: '06. Antecedentes y Justificación' },
    { type: 'doc', id: 'formativo/matriz-trazabilidad', label: '07. Matriz de Trazabilidad' }, // <-- NUEVO
    { type: 'doc', id: 'formativo/manual-usuario', label: '08. Manual de Usuario' },
    { type: 'doc', id: 'formativo/modelo-negocio-y-resiliencia', label: '09. Modelo de Negocio y Resiliencia' }
  ],
  
  tecnicoSidebar: [
    'tecnico/arquitectura-hexagonal',
    { type: 'doc', id: 'tecnico/referencia/modelo-datos', label: 'Modelo de Datos' },
    { type: 'doc', id: 'tecnico/referencia/glosario', label: 'Glosario' },
    { type: 'doc', id: 'tecnico/referencia/guia-diseno-ui', label: 'Guía de Diseño UI/UX' },
    { type: 'doc', id: 'adr/ADR-001-arquitectura-hexagonal', label: 'ADR-001: Arquitectura Hexagonal' },
    { type: 'doc', id: 'adr/ADR-002-modelo-hibrido-reservas', label: 'ADR-002: Modelo Híbrido' },
  ],
  
  gestionSidebar: [
    { type: 'doc', id: 'gestion/gestion-interesados-proyecto', label: 'Gestión de Interesados y Proyecto' },
  ],
};

export default sidebars;