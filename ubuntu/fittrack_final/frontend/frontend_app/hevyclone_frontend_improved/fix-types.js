#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para encontrar todos os arquivos TypeScript
function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Função para aplicar correções automáticas
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Correção 1: Remover imports não utilizados do React
  if (content.includes('import React,') && !content.includes('React.')) {
    content = content.replace(/import React, \{ ([^}]+) \} from 'react';/, 'import { $1 } from \'react\';');
    changed = true;
  }

  // Correção 2: Adicionar tipos para any
  content = content.replace(/: any\[\]/g, ': unknown[]');
  content = content.replace(/: any\)/g, ': unknown)');
  content = content.replace(/as any/g, 'as unknown');

  // Correção 3: Corrigir parâmetros não utilizados
  content = content.replace(/\(([^,)]+), index\) =>/g, '($1) =>');
  content = content.replace(/\(([^,)]+), _index\) =>/g, '($1) =>');

  // Correção 4: Adicionar tipos para event handlers
  content = content.replace(/\(e\) =>/g, '(e: React.FormEvent) =>');
  content = content.replace(/\(event\) =>/g, '(event: React.FormEvent) =>');

  // Correção 5: Corrigir catch sem parâmetro
  content = content.replace(/} catch \(err\) \{[^}]*console\.error/g, '} catch (error) {\n    console.error');
  content = content.replace(/} catch \([^)]+\) \{\s*\}/g, '} catch {\n  }');

  // Correção 6: Adicionar tipos para useState
  content = content.replace(/useState\(\[\]\)/g, 'useState<unknown[]>([])');
  content = content.replace(/useState\(null\)/g, 'useState<unknown | null>(null)');

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigido: ${filePath}`);
    return true;
  }
  
  return false;
}

// Função principal
function main() {
  console.log('🔧 Iniciando correção automática de tipos TypeScript...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const files = findTsFiles(srcDir);
  
  let fixedCount = 0;
  
  for (const file of files) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`   Arquivos verificados: ${files.length}`);
  console.log(`   Arquivos corrigidos: ${fixedCount}`);
  
  // Executar verificação TypeScript
  console.log('\n🔍 Verificando erros restantes...');
  try {
    const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' });
    console.log('✅ Nenhum erro TypeScript encontrado!');
  } catch (error) {
    const lines = error.stdout.split('\n').filter(line => line.trim());
    console.log(`❌ ${lines.length} erros TypeScript restantes`);
    
    // Mostrar primeiros 10 erros
    console.log('\n📋 Primeiros erros:');
    lines.slice(0, 10).forEach((line, i) => {
      console.log(`   ${i + 1}. ${line}`);
    });
  }
}

if (require.main === module) {
  main();
} 