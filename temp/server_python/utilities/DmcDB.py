import json
import pymssql

conn_str = (
    'Driver={SQL Server};'
    'Server=iaasn00008663.svr.us.jpmchase.net,16001;'
    # 'Database=dmc_db_uat;'
    'Database=dmc_db_dev;'
    # 'Trusted_Connection=Yes;'
    'UID=admin;'
    # 'PWD=MU34i3LwS;'
    'PWD=TZ9IjS14a'
)
# dmc_db_dev
# UID: 'USER', PWD: EeUKwBos41
# UID: 'ADMIN', PWD: TZ9IjS14a
# dmc_db_uat
# UID: 'USER', PWD: PCF1ftuR4
# UID: 'ADMIN', PWD: MU34i3LwS

server = 'iaasn00008663.svr.us.jpmchase.net:16001'
user = 'admin'
password = 'TZ9IjS14a'
database = 'dmc_db_dev'

class DmcDB(object):
    @staticmethod
    def save_connections(data):
        with pymssql.connect(server, user, password, database) as connection:

            c = connection.cursor()
            c.execute("""insert into connections (conn_name,conn_username,conn_password,conn_string,conn_db,conn_schema) values (%s, %s, %s, %s, %s, %s)""",
                     (data['conn_name'], data['conn_username'], data['conn_password'], data['conn_string'], data['conn_db'], data['conn_schema']))
            connection.commit()
            c.close()
            #connection.close()

    @staticmethod
    def update_connection(data):
        with pymssql.connect(server, user, password, database) as connection:
            c = connection.cursor()
            c.execute("""
               UPDATE connections
               SET username=(%s),conn_name=(%s),conn_username=(%s),conn_password=(%s),conn_string=(%s),conn_db=(%s),conn_schema=(%s)
               WHERE ID=(%s)
            """, (data["username"], data["conn_name"], data["conn_username"], data["conn_password"], data["conn_string"], data["conn_db"], data["conn_schema"], str(data["ID"])))
            connection.commit()
            c.close()
            #connection.close()

    @staticmethod
    def delete_connection(rec_id, database_name):
        with pymssql.connect(server, user, password, database) as connection:
            print rec_id
            print database_name
            c = connection.cursor()
            c.execute('DELETE FROM "' + database_name + '" WHERE id='+rec_id+';')
            connection.commit()
            c.close()
            #connection.close()

    @staticmethod
    def get_data_json_single(execstr):
        with pymssql.connect(server, user, password, database) as connection:
            c = connection.cursor()
            c.execute(execstr)
            r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
            c.close()
            connection.close()
            return json.dumps(r)

    @staticmethod
    def get_data_json(root, execstr):
        with pymssql.connect(server, user, password, database) as connection:
            c = connection.cursor()
            c.execute(execstr)
            r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
            c.close()
            connection.close()
        return '"' + root + '": ' + json.dumps(r)

    @staticmethod
    def wrap_response(self, list_arr):
        s = ","
        seq = []
        for label in list_arr:
            seq.append(self.get_data_json(label['name'], label['str']))
        return s.join(seq)
