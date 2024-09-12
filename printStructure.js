const fs = require('fs');
const path = require('path');

const ignoreDirs = ['node_modules'];

function printDirectoryStructure(dir, depth = 0) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory() && !ignoreDirs.includes(file)) {
      console.log('  '.repeat(depth) + '|-- ' + file);
      printDirectoryStructure(filePath, depth + 1);
    } else if (!stats.isDirectory()) {
      console.log('  '.repeat(depth) + '|-- ' + file);
    }
  });
}

const projectRoot = path.resolve(__dirname);
console.log('Project structure:');
printDirectoryStructure(projectRoot);