const fs = require('fs');
const path = require('path');

// Funkcja do tworzenia folderów i plików
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Utworzono folder: ${folderPath}`);
  }
};

const createFile = (filePath, content = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Utworzono plik: ${filePath}`);
  }
};

// Główna funkcja tworząca strukturę SCSS
const generateScssStructure = (basePath) => {
  // Tworzenie folderu głównego SCSS
  createFolder(basePath);

  // Struktura folderów
  const folders = [
    'base',          // Globalne style i reset CSS
    'components',    // Style komponentów
    'layout',        // Style layoutów (np. grid, header, footer)
    'pages',         // Style dla specyficznych stron
    'themes',        // Tematy (np. light/dark mode)
    'utils',         // Narzędzia (mixiny, funkcje)
    'vendors',       // CSS bibliotek zewnętrznych
  ];

  // Tworzenie folderów i podstawowych plików
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    createFolder(folderPath);
    createFile(path.join(folderPath, `_${folder}.scss`), `// ${folder} styles`);
  });

  // Tworzenie pliku variables
  createFile(path.join(basePath, '_variables.scss'), '// Variables for colors, typography, etc.');

  // Tworzenie głównego pliku `styles.scss`
  const mainFileContent = `
// Import SCSS files
@import 'variables';

@import 'base/base';
@import 'components/components';
@import 'layout/layout';
@import 'pages/pages';
@import 'themes/themes';
@import 'utils/utils';
@import 'vendors/vendors';
  `;
  createFile(path.join(basePath, 'styles.scss'), mainFileContent);
};

// Wywołanie funkcji z docelową ścieżką (np. 'src/scss')
generateScssStructure('src/scss');