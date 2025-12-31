const express = require('express');
const path = require('path');
const translations = require('./translations');

const app = express();
const port = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route - redirect to default language (uz)
app.get('/', (req, res) => {
    res.redirect('/uz');
});

// Language route
app.get('/:lang', (req, res) => {
    const lang = req.params.lang;
    const validLangs = ['uz', 'en', 'ru'];

    if (!validLangs.includes(lang)) {
        return res.redirect('/uz');
    }

    const context = translations[lang] || translations['uz'];
    const currentLangLabel = lang.toUpperCase();

    // Ensure all context values are strings (similar to the Python safer logic)
    // In JS this is less critical but good for consistency if EJS expects strings
    // We pass the context directly as locals
    res.render('index', {
        lang: lang,
        current_lang_label: currentLangLabel,
        ...context
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
