# -*- coding: utf-8 -*-
from flask import Flask, render_template, redirect, url_for
import sys

app = Flask(__name__)

# Import translations
try:
    from translations import translations
except Exception:
    translations = {}

@app.route('/')
def index():
    return redirect(url_for('home', lang='uz'))

@app.route('/<lang>')
def home(lang):
    if lang not in ['uz', 'en', 'ru']:
        return redirect(url_for('home', lang='uz'))
    
    context = translations.get(lang, translations.get('uz', {}))
    current_lang_label = lang.upper()

    # Force string encoding safety for all context values
    safe_context = {}
    for k, v in context.items():
        try:
            # Ensure it's a string and safe for Jinja
            safe_context[k] = str(v)
        except:
            safe_context[k] = ""

    return render_template('index.html', lang=lang, current_lang_label=current_lang_label, **safe_context)

if __name__ == '__main__':
    app.run(debug=True)
