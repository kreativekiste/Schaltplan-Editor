import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Read all files in the current directory
const files = fs.readdirSync('.');

// Filter files to copy (HTML, JS, CSS)
const filesToCopy = files.filter(f => {
    return f.endsWith('.html') || 
           (f.endsWith('.js') && f !== 'build.mjs') || 
           f.endsWith('.css');
});

// Copy each file
filesToCopy.forEach(file => {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} to dist/`);
});

console.log('Build complete.');
