from flask import (Flask, render_template)

app = Flask("__main__")

@app.route("/<path:path>")
def my_index(path):
    return render_template("index.html")

app.run(debug=True)