from flask import Flask
import sqlite3
import json

DATABASE = 'C:\\BitBucket\\node.proxy.server\\flask-blog\\aaa.db'

app = Flask(__name__)
app.config.from_object(__name__)


def get_all_users(json_str=False):
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    rows = db.execute("""SELECT * from posts""").fetchall()
    conn.commit()
    conn.close()
    print json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON

if __name__ == '__main__':
    get_all_users()
    app.run(debug=True)

