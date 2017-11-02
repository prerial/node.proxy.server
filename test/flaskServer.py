from flask import Flask, Response
#import requests


app = Flask(__name__)

@app.route('/dmc/v1.0/schemas')
def schemas():
    resp = Response('{"status": "success","message": "",  "payload": []}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
'''
req = requests.Request('POST','http://stackoverflow.com',headers={'X-Custom':'Test'},data='a=1&b=2')
prepared = req.prepare()


def pretty_print_POST(req):
    """
    At this point it is completely built and ready
    to be fired; it is "prepared".

    However pay attention at the formatting used in
    this function because it is programmed to be pretty
    printed and may differ from the actual request.
    """
    print('{}\n{}\n{}\n\n{}'.format(
        '-----------START-----------',
        req.method + ' ' + req.url,
        '\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
        req.body,
    ))

pretty_print_POST(prepared)
'''


#@app.route('/dmc/v1.0/schemas/schema_id', methods=['POST'])
@app.route('/dmc/v1.0/schemas/schema_id', methods=['POST'])
def schema_id():
    print('CCCCC')

    resp = Response('{"status": "success","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]}]}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/dmc/v1.0/schemas/connections', methods=['GET'])
def connections():
    print('DDDDDD')

    resp = Response('{"status": "success","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]}]}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/dmc/v1.0/schemas/denorm')
def denorm():
    resp = Response('{"status": "success","message": "",  "payload": ['
                    '{ "name": "Employees", "columns": ['
                    '{"name": "EmployeeID","type": "int","size": 11,"primaryKey": "true","required": "true"}]}]}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == '__main__':
    app.run()
