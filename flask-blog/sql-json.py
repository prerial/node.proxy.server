from flask import Flask
import sqlite3
import json
import pypyodbc

DATABASE = 'C:\\BitBucket\\node.proxy.server\\flask-blog\\aaa.db'

app = Flask(__name__)
app.config.from_object(__name__)


def get_all_users(str, json_str=False):
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    rows = db.execute(str).fetchall()
    conn.commit()
    conn.close()
    return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON

if __name__ == '__main__':
    print get_all_users("""SELECT * from posts""")
    app.run(debug=True)

