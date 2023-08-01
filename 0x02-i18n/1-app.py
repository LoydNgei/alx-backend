#!/usr/bin/env python3
""" Basic Flask app """
from flask import Flask, render_template
from flask_babel import Babel


class Config(object):
    """ Babel config class"""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
babel = Babel(app)
app.config.from_object(Config)


@app.route('/')
def index():
    """Render index.html"""
    return render_template('1-index.html')


if __name__ == '__main__':
    """ Main Function """
    app.run(debug=True)
