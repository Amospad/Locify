#!/usr/bin/env node
/**
 * Script de sincronización entre docs/docs/ (Docusaurus) y docs/sena/ (Entrega Oficial SENA)
 * Uso: node scripts/sync-docs.js
 * Copia los archivos markdown de docs/docs/ a docs/sena/ manteniendo la estructura de 8 carpetas SENA + transversales
 */

const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.join(__dirname, '../docs/docs');
const TARGET_ROOT = path.join(__dirname, '../docs/sena');

// Mapeo de carpetas Docusaurus -> Estructura SENA
const FOLDER_MAP = {
  'formativo': '01_Formulacion',
  'tecnico/referencia': '02_Diseno_Arquitectura',
  'tecnico/flujos': '03_Desarrollo',  // Los flujos técnicos van aquí
  'tecnico/arquitectura-hexagonal.md': '02_Diseno_Arquitectura/arquitectura-hexagonal.md',
  'tecnico/arquitectura-agentes.md': '02_Diseno_Arquitectura/arquitectura-agentes.md',
  'tecnico/guia-diseno-ui.md': '02_Diseno_Arquitectura/guia-diseno-ui.md',
  'adr': '02_Diseno_Arquitectura/ADR',
  'gestion': '04_Gestion_Proyecto',
  // Transversales (se crean/copian aparte)
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`  ✅ ${path.relative(SOURCE_ROOT, src)} → ${path.relative(TARGET_ROOT, dest)}`);
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      copyFile(srcPath, destPath);
    }
  }
}

function main() {
  console.log('🔄 Iniciando sincronización Docusaurus → SENA...\n');
  
  // 1. Formativo → 01_Formulacion
  console.log('📁 Formativo → 01_Formulacion');
  copyDir(
    path.join(SOURCE_ROOT, 'formativo'),
    path.join(TARGET_ROOT, '01_Formulacion')
  );

  // 2. Técnico/Referencia → 02_Diseno_Arquitectura
  console.log('\n📁 Técnico/Referencia → 02_Diseno_Arquitectura');
  copyDir(
    path.join(SOURCE_ROOT, 'tecnico/referencia'),
    path.join(TARGET_ROOT, '02_Diseno_Arquitectura')
  );

  // 3. Archivos técnicos sueltos → 02_Diseno_Arquitectura
  console.log('\n📁 Técnico (archivos sueltos) → 02_Diseno_Arquitectura');
  const techFiles = ['arquitectura-hexagonal.md', 'arquitectura-agentes.md', 'guia-diseno-ui.md'];
  for (const file of techFiles) {
    copyFile(
      path.join(SOURCE_ROOT, 'tecnico', file),
      path.join(TARGET_ROOT, '02_Diseno_Arquitectura', file)
    );
  }

  // 4. ADR → 02_Diseno_Arquitectura/ADR
  console.log('\n📁 ADR → 02_Diseno_Arquitectura/ADR');
  copyDir(
    path.join(SOURCE_ROOT, 'adr'),
    path.join(TARGET_ROOT, '02_Diseno_Arquitectura', 'ADR')
  );

  // 5. Flujos Técnicos → 03_Desarrollo/Flujos_Tecnicos
  console.log('\n📁 Flujos Técnicos → 03_Desarrollo/Flujos_Tecnicos');
  copyDir(
    path.join(SOURCE_ROOT, 'tecnico/flujos'),
    path.join(TARGET_ROOT, '03_Desarrollo', 'Flujos_Tecnicos')
  );

  // 6. Gestión → 04_Gestion_Proyecto
  console.log('\n📁 Gestión → 04_Gestion_Proyecto');
  copyDir(
    path.join(SOURCE_ROOT, 'gestion'),
    path.join(TARGET_ROOT, '04_Gestion_Proyecto')
  );

  // 7. Crear carpetas vacías para documentos SENA faltantes
  console.log('\n📁 Creando carpetas SENA faltantes...');
  const missingFolders = [
    '05_Plan_Pruebas',
    '06_Manuales_Usuario',
    '07_Evaluacion_Cierre',
    '08_Repositorio_Proyecto',
    '00_Gobierno_Documental',
    '09_Transversales',
    '09_Transversales/adrs',
    '09_Transversales/specs',
    '09_Transversales/flujos-tecnicos',
    '09_Transversales/constitution',
    '09_Transversales/project-state',
  ];
  for (const folder of missingFolders) {
    ensureDir(path.join(TARGET_ROOT, folder));
    console.log(`  📂 Created: ${folder}`);
  }

  // 8. Copiar Manuales de Usuario (06_Manuales_Usuario) desde Formativo
  console.log('\n📁 Manuales de Usuario → 06_Manuales_Usuario');
  const manualFiles = [
    '08-manual-usuario.md',
    '09-manual-operador.md',
    '10-manual-instalacion.md',
  ];
  for (const file of manualFiles) {
    copyFile(
      path.join(SOURCE_ROOT, 'formativo', file),
      path.join(TARGET_ROOT, '06_Manuales_Usuario', file)
    );
  }

  // 9. Copiar documentos transversales existentes
  console.log('\n📁 Copiando documentos transversales...');
  const transversalFiles = [
    { src: '00_Gobierno_Documental/declaracion-uso-ia.md', dest: '00_Gobierno_Documental/declaracion-uso-ia.md' },
    { src: '05_Plan_Pruebas/plan-calidad.md', dest: '05_Plan_Pruebas/plan-calidad.md' },
    { src: '07_Evaluacion_Cierre/informe-cierre.md', dest: '07_Evaluacion_Cierre/informe-cierre.md' },
    { src: 'constitution.md', dest: '09_Transversales/constitution/constitution.md' },
  ];
  
  for (const tf of transversalFiles) {
    const srcPath = path.join(__dirname, '..', 'docs', tf.src);
    const destPath = path.join(TARGET_ROOT, tf.dest);
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    } else {
      console.log(`  ⚠️  No encontrado: ${tf.src}`);
    }
  }

  // 10. Copiar specs (carpeta specs/ en raíz del proyecto)
  console.log('\n📁 Copiando specs...');
  const specsSource = path.join(__dirname, '..', 'specs');
  const specsDest = path.join(TARGET_ROOT, '09_Transversales', 'specs');
  if (fs.existsSync(specsSource)) {
    copyDir(specsSource, specsDest);
  }

  console.log('\n✅ Sincronización completada.');
  console.log(`   Origen: ${SOURCE_ROOT}`);
  console.log(`   Destino: ${TARGET_ROOT}`);
}

main();