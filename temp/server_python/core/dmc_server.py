import json

from flask import Flask, request, Response
from server_python.utilities.DmcDB import DmcDB
from main import main

dmcdb = DmcDB()

USERNAME = 'admin'
PASSWORD = 'pass'

app = Flask(__name__)
app.config.from_object(__name__)

#  Request No1 : dmc index html
#@app.route('/')
#def dmc_webserver():
#    return render_template('index.html')


#  Request No2 : to render json schema for visulization.
@app.route('/dmc/v1.0/schemas/schema_id', methods=['GET'])
def schemas():
    print "Request No2 : to render json schema visulization"
    erd_json = main(request.url)
    resp = Response(erd_json)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


#  Request No3 : to render denormalize json schema, ddl, dml.
@app.route('/dmc/v1.0/schemas/denorm', methods=['GET'])
def denorm():
    print "Request No3 : to render denormalize json schema, ddl, dml."
    denorm_json = main(request.url)
    resp = Response(denorm_json)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


#  Request: to retrive Data Source
@app.route('/dmc/v1.0/schemas/getdatasource', methods=['GET'])
def get_datasource():
    print "Request: to retrive getdatasource."
    data_labels = [{'name': 'dataSource', 'str': '''SELECT conn_name FROM connections;'''}, {'name': 'dataModelType', 'str': '''SELECT * FROM DataModelTypes;'''}, {'name': 'databaseSource', 'str': '''SELECT * FROM SourceDatabase;'''}, {'name': 'databaseTarget', 'str': '''SELECT * FROM TargetDatabase;'''}]
    resp = Response('{"status": "success", "message": "", "payload": {' + dmcdb.wrap_response(dmcdb, data_labels) + '}}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/dmc/v1.0/schemas/saveconnection', methods=['GET', 'POST'])
def saveconnection():
    print "Request: save connections."
    data = json.loads(request.data)['data']
    print str(data["type"])
    if str(data["type"]) == 'save':
        dmcdb.save_connections(data)
        resp = Response('{"status": "success","message": "Record was successfully saved!",  "payload": []}')
    else:
        print data['conn_name']
        dmcdb.update_connection(data)
        resp = Response('{"status": "success","message": "Record was successfully updated!",  "payload": []}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/dmc/v1.0/schemas/deleteconnection', methods=['GET', 'POST'])
def deleteconnection():
    print "Request: delete connections."
    data = json.loads(request.data)
    dmcdb.delete_connection(str(data['data']), 'connections')
    resp = Response('{"status": "success","message": "Record was successfully deleted!",  "payload": []}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


#  Request: to retrive connections
@app.route('/dmc/v1.0/schemas/getconnections', methods=['GET'])
def getconnections():
    print "Request: to retrive connections."
    resp = Response('{"status": "success", "message": "", "payload": ' + dmcdb.get_data_json_single('''SELECT * FROM connections;''') + '}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


#  Request: to retrive databases
@app.route('/dmc/v1.0/schemas/getdatabases', methods=['GET'])
def getdatabases():
    print "Request: to retrive databases."
    resp = Response('{"status": "success", "message": "", "payload": ' + dmcdb.get_data_json_single('''SELECT * FROM SourceDatabase;''') + '}')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == '__main__':
    app.run(debug=True)
