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

  // Correção 2: Remover imports não utilizados
  if (content.includes('import axios from \'axios\';') && !content.includes('axios.')) {
    content = content.replace(/import axios from 'axios';\n/, '// import axios from \'axios\'; // Removido: não utilizado\n');
    changed = true;
  }

  // Correção 3: Corrigir parâmetros não utilizados em maps
  content = content.replace(/\.map\(([^,)]+), index\) =>/g, '.map($1) =>');
  content = content.replace(/\.map\(([^,)]+), _index\) =>/g, '.map($1) =>');
  if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;

  // Correção 4: Corrigir catch sem uso da variável
  content = content.replace(/} catch \(err\) \{\s*setError/g, '} catch {\n    setError');
  content = content.replace(/} catch \(error\) \{\s*console\.error/g, '} catch (error) {\n    console.error');
  if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;

  // Correção 5: Adicionar tipos para response.data
  content = content.replace(/response\.data/g, 'response.data as unknown');
  content = content.replace(/res\.data/g, 'res.data as unknown');
  if (content !== fs.readFileSync(filePath, 'utf8')) changed = true;

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigido: ${path.relative(process.cwd(), filePath)}`);
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