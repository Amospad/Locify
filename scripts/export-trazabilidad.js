#!/usr/bin/env node
/**
 * Script para exportar la matriz de trazabilidad de Markdown a CSV
 * Uso: node scripts/export-trazabilidad.js
 * Entrada: docs/docs/formativo/07-matriz-trazabilidad.md
 * Salida: docs/08_Repositorio_Proyecto/matriz-trazabilidad.csv
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../docs/docs/formativo/07-matriz-trazabilidad.md');
const OUTPUT_FILE = path.join(__dirname, '../docs/08_Repositorio_Proyecto/matriz-trazabilidad.csv');

function parseMarkdownTable(markdown) {
  const lines = markdown.split('\n');
  const tables = [];
  let currentTable = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detectar inicio/fin de tabla markdown
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      currentTable.push(line);
    } else if (inTable) {
      // Fin de tabla
      if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
      }
      inTable = false;
    }
  }
  
  // Capturar última tabla si existe
  if (currentTable.length > 0) {
    tables.push(currentTable);
  }

  // Procesar la tabla más grande (asumimos que es la matriz de trazabilidad)
  if (tables.length === 0) return null;
  
  const largestTable = tables.reduce((a, b) => a.length > b.length ? a : b);
  return parseTableRows(largestTable);
}

function parseTableRows(tableLines) {
  const rows = [];
  
  for (const line of tableLines) {
    const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  // Filtrar fila de separadores (--- | ---)
  return rows.filter(row => !row.every(cell => /^:?-+:?$/.test(cell)));
}

function escapeCSV(cell) {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}

function main() {
  console.log('📊 Exportando matriz de trazabilidad...');
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Archivo no encontrado: ${INPUT_FILE}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(INPUT_FILE, 'utf-8');
  const data = parseMarkdownTable(markdown);

  if (!data || data.length === 0) {
    console.error('❌ No se pudo extraer tabla del archivo markdown');
    process.exit(1);
  }

  // Escribir CSV
  const csvLines = data.map(row => row.map(escapeCSV).join(','));
  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'));
  
  console.log(`✅ Exportado a: ${OUTPUT_FILE}`);
  console.log(`   Filas: ${data.length}, Columnas: ${data[0]?.length || 0}`);
}

main();