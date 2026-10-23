import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  formativoSidebar: [
    {
      type: 'doc',
      id: 'formativo/acta-constitucion',
      label: '01. Acta de Constitución',
    },
    {
      type: 'doc',
      id: 'formativo/stakeholders', // <-- Quitamos el "02-" de aquí
      label: '02. Stakeholders',       
    },
  ],
};

export default sidebars;