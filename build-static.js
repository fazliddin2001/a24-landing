const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const translations = require('./translations');

const distDir = path.join(__dirname, 'dist');
const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

// Ensure dist directory exists
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Copy public assets to dist
console.log('Copying assets...');
fs.cpSync(publicDir, distDir, { recursive: true });

// Function to render and save page
const renderPage = (lang) => {
    const templatePath = path.join(viewsDir, 'index.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');

    const context = translations[lang] || translations['uz'];
    const currentLangLabel = lang.toUpperCase();

    const html = ejs.render(template, {
        lang: lang,
        current_lang_label: currentLangLabel,
        ...context
    });

    const langDir = path.join(distDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }

    fs.writeFileSync(path.join(langDir, 'index.html'), html);
    console.log(`Generated ${lang}/index.html`);
};

// Generate pages for all languages
['uz', 'en', 'ru'].forEach(renderPage);

// Create specific redirects for Cloudflare Pages
// Cloudflare uses _redirects file
// Format: /source /destination code
const redirects = `
/ /uz 302
`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirects.trim());
console.log('Created _redirects file');

// Create a root index.html that does a meta refresh redirect as a fallback
const rootRedirect = `
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/uz" />
    <script>window.location.href = "/uz"</script>
</head>
<body>
    <a href="/uz">Go to Uzbek version</a>
</body>
</html>
`;
fs.writeFileSync(path.join(distDir, 'index.html'), rootRedirect.trim());
console.log('Created root index.html redirect');

console.log('Static build complete!');
