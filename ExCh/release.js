const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// 1. Taghire version
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const versionParts = manifest.version.split('.').map(Number);
versionParts[versionParts.length - 1] += 1;
manifest.version = versionParts.join('.');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const tagName = `v${manifest.version}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// 2. Sakhte file ZIP baraye download karbaran ba PowerShell
console.log(`Fasle sakhte file ZIP: ${zipName}...`);
const zipCmd = `powershell Compress-Archive -Path manifest.json, newtab.html, style.css, script.js -DestinationPath ${zipName} -Force`;
execSync(zipCmd, { stdio: 'inherit' });

// 3. Git commit va Tag
const customMessage = process.argv.slice(2).join(' ') || `Release ${tagName}`;
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${customMessage}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${customMessage}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });
  console.log(`\nVersion ${tagName} ba movafaghiat sabt shod!`);
} catch (err) {
  console.error('Khata dar git:', err.message);
}