const fs = require('fs');
const path = require('path');

const structure = [
  'src/components/App.js',
  'src/components/Dashboard.js',
  'src/components/Editor.js',
  'src/components/Login.js',
  'src/components/Sidebar.js',
  'src/components/HudBorder.js',
  'src/components/AnimatedButton.js',
  'src/components/DownloadButton.js',
  'src/components/ChipLoader.js',
  'src/components/DigitalBackground.js',
  'src/components/SectiLogo.js',
  'src/components/RenderInput.js',
  'src/components/RenderSelect.js',
  'src/components/DeckNavigation.js',
  'src/components/Icons.js',
  'src/firebase/config.js',
  'src/styles/global.css',
  'src/utils/constants.js',
  'src/utils/helpText.js',
  'src/utils/decks.js',
  'src/index.js'
];

structure.forEach(file => {
  const filePath = path.join(__dirname, file);
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '// ' + file);
    console.log(`Created: ${file}`);
  } else {
    console.log(`Already exists: ${file}`);
  }
});

console.log('Estrutura de pastas criada!');
