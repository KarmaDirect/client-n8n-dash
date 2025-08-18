#!/usr/bin/env node

/**
 * Script de vérification de la configuration Tailwind CSS
 * Exécutez avec : node check-tailwind-setup.js
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification de la configuration Tailwind CSS...\n');

// Vérification des fichiers de configuration
const configFiles = [
  '.vscode/settings.json',
  '.vscode/css_custom_data.json',
  '.vscode/extensions.json',
  '.vscode/csslint.json',
  '.vscode/global-settings.json',
  '.stylelintrc.json',
  'postcss.config.js',
  'tailwind.config.ts'
];

let allFilesExist = true;

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Présent`);
  } else {
    console.log(`❌ ${file} - Manquant`);
    allFilesExist = false;
  }
});

console.log('\n📋 Vérification du contenu des fichiers...\n');

// Vérification du contenu de settings.json
try {
  const settings = JSON.parse(fs.readFileSync('.vscode/settings.json', 'utf8'));
  if (settings['css.validate'] === false) {
    console.log('✅ CSS validation désactivée');
  } else {
    console.log('❌ CSS validation toujours active');
  }
} catch (error) {
  console.log('❌ Erreur dans settings.json');
}

// Vérification du contenu de css_custom_data.json
try {
  const cssData = JSON.parse(fs.readFileSync('.vscode/css_custom_data.json', 'utf8'));
  if (cssData.atDirectives && cssData.atDirectives.length > 0) {
    console.log(`✅ ${cssData.atDirectives.length} directives CSS définies`);
  } else {
    console.log('❌ Aucune directive CSS définie');
  }
} catch (error) {
  console.log('❌ Erreur dans css_custom_data.json');
}

// Vérification de PostCSS
try {
  const postcss = fs.readFileSync('postcss.config.js', 'utf8');
  if (postcss.includes('tailwindcss')) {
    console.log('✅ PostCSS configuré pour Tailwind');
  } else {
    console.log('❌ PostCSS non configuré pour Tailwind');
  }
} catch (error) {
  console.log('❌ Erreur dans postcss.config.js');
}

// Vérification de Tailwind config
try {
  const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
  if (tailwindConfig.includes('tailwindcss')) {
    console.log('✅ Configuration Tailwind présente');
  } else {
    console.log('❌ Configuration Tailwind manquante');
  }
} catch (error) {
  console.log('❌ Erreur dans tailwind.config.ts');
}

console.log('\n🎯 Instructions pour résoudre les erreurs de linter :');
console.log('1. Redémarrez VS Code complètement');
console.log('2. Installez l\'extension "Tailwind CSS IntelliSense"');
console.log('3. Rechargez la fenêtre (Ctrl+Shift+P → "Developer: Reload Window")');
console.log('4. Vérifiez que les erreurs @tailwind et @apply ont disparu');

console.log('\n📚 Documentation complète : VSCODE-TAILWIND-SETUP.md');

if (allFilesExist) {
  console.log('\n🎉 Configuration Tailwind CSS complète !');
} else {
  console.log('\n⚠️  Certains fichiers de configuration sont manquants.');
}
