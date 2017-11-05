from flask import Flask
from flask import Request
from flask import Response, make_response


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/dmc/v1.0/schemas/schema_id1',  methods=['GET', 'POST'])
def json_post():
    if Request.method == 'POST':
        dummy = Request.form
    resp = Response('{"test": "ok"}')
    resp.headers['Content-Type'] = "application/json"
    return resp

@app.route('/app1/*/app1/*')
def appl1():
    resp = Response('Hello World!')
    #    resp = make_response()
#    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/app2/*/app2/*')
def appl2():
    resp = Response('{"status": "AAAA","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]]}')
    #    resp = make_response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/app3/*')
def appl3():
    resp = Response('{"status": "success","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]]}')
    #    resp = make_response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/app3/schemas')
def schemas():
    resp = Response('{"status": "success","message": "",  "payload": []}')
    #    resp = make_response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/dmc/v1.0/schemas/schema_id')
def schema_id():
#    req = Request
#    req.headers['Access-Control-Allow-Origin'] = '*'
    resp = Response('{"status": "success","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]}]}')
#    resp = make_response()
#    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

#    return '{"status": "success","message": "",  "payload": [' \
#           '{ "name": "Employees", "columns": [' \
#           '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]' \
#           ']}'

# dmc/v1.0/schemas/denorm

if __name__ == '__main__':
    app.run()
