
import pymssql

server = 'iaasn00008663.svr.us.jpmchase.net:16001'
user = 'admin'
password = 'TZ9IjS14a'
database = 'dmc_db_dev'

print server
print user
print password
print database

conn = pymssql.connect(server, user, password, database)
cursor = conn.cursor()
cursor.execute('''SELECT * FROM connections;''')
row = cursor.fetchone()
while row:
    print("ID=%d, Name=%s" % (row[0], row[1]))
    row = cursor.fetchone()
conn.close()


conn = pymssql.connect(server, user, password, database)
cursor = conn.cursor()
cursor.execute('''SELECT * FROM connections;''')
for row in cursor:
    print('row = %s' % (row,))
conn.close()

with pymssql.connect(server, user, password, database) as conn:
    with conn.cursor(as_dict=True) as cursor:
        # cursor.execute('SELECT * FROM connections WHERE salesrep=%s', 'John Doe')
        cursor.execute('''SELECT * FROM connections;''')
        for row in cursor:
            print('row = %s' % (row,))
conn.close()








connStr = (
    'Driver={SQL Server};'
    'Server=iaasn00008663.svr.us.jpmchase.net,16001;'
    #'Database=dmc_db_uat;'
    'Database=dmc_db_dev;'
    #'Trusted_Connection=Yes;'
    'UID=admin;'
    #'PWD=MU34i3LwS;'
    'PWD=TZ9IjS14a'
)
# dmc_db_dev
# UID: 'USER', PWD: EeUKwBos41
# UID: 'ADMIN', PWD: TZ9IjS14a
# dmc_db_uat
# UID: 'USER', PWD: PCF1ftuR4
# UID: 'ADMIN', PWD: MU34i3LwS

# create a new database if the database doesn't already exist
"""
with pymssql.connect(connStr) as connection:

    # get a cursor object used to execute SQL commands
    c = connection.cursor()

        # create connections table

    c.execute('CREATE TABLE "connections" (ID integer PRIMARY KEY IDENTITY, "username" VARCHAR(20),'
              '"conn_name" VARCHAR(50),"conn_username" VARCHAR(20),'
              '"conn_password" VARCHAR(20),"conn_string" VARCHAR(100)'
              ',"conn_db" VARCHAR(25),"conn_schema" VARCHAR(25))')
    c.commit()

    c.execute('''TRUNCATE TABLE connections;''')
    c.commit()

    a_batch_rows = [('A123456', 'mysql_northwind', 'A123456', 'mypassword', 'Mysql northwind connection string', 'MySQL', 'Mysql northwind schema'),
                    ('A123456', 'mysql_daf', 'A123456', 'mypassword', 'Mysql daf connection string', 'MySQL', 'Mysql daf schema'),
                    ('A123456', 'oracle_dmc', 'A123456', 'mypassword', 'Oracle connection string', 'Oracle', 'Oracle schema'),
                    ('A123456', 'teradata_icdw', 'A123456', 'mypassword', 'Teradata connection string', 'Teradata', 'Teradata schema')]

    c.executemany('''INSERT INTO connections(username,conn_name,conn_username,conn_password,conn_string,conn_db,conn_schema) VALUES(?,?,?,?,?,?,?)''',
               a_batch_rows)
    c.commit()

    c.execute('''SELECT * FROM connections;''')
    r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
    print r


    # create DataModelTypes table

    c.execute('CREATE TABLE "DataModelTypes" (ID integer PRIMARY KEY IDENTITY, "name" VARCHAR(50), "value" VARCHAR(50))')
    c.commit()

    c.execute('''TRUNCATE TABLE DataModelTypes;''')
    c.commit()

    a_batch_rows = [('Flatten', 'fl'), ('Star Schema', 'stsc')]

    c.executemany('''INSERT INTO DataModelTypes (name, value) VALUES(?,?)''',
                  a_batch_rows)
    c.commit()

    c.execute('''SELECT * FROM DataModelTypes;''')
    r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
    print r

    # create SourceDatabase table

    c.execute('CREATE TABLE "SourceDatabase" (ID integer PRIMARY KEY IDENTITY, "name" VARCHAR(50), "value" VARCHAR(50))')
    c.commit()

    c.execute('''TRUNCATE TABLE SourceDatabase;''')
    c.commit()

    a_batch_rows = [("Oracle", "oracle"), ("MySQL", "mysql"), ("Teradata", "teradata"), ("Sybase", "sybase"),
                    ("Microsoft SQL Server", "msqlserver"), ("Microsoft SQL Server 2005", "msqlserver2005"), ("DB2", "db2")]

    c.executemany('''INSERT INTO SourceDatabase (name, value) VALUES(?,?)''',
                  a_batch_rows)
    c.commit()

    c.execute('''SELECT * FROM SourceDatabase;''')
    r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
    print r
"""
"""
    c.execute('CREATE TABLE "TargetDatabase" (ID integer PRIMARY KEY IDENTITY, "name" VARCHAR(50), "value" VARCHAR(50))')

    c.commit()

    c.execute('''TRUNCATE TABLE TargetDatabase;''')
    c.commit()

    a_batch_rows = [("Cassandra", "cassandra"), ("Hive", "hive"), ("MongoDB", "mongodb")]

    c.executemany('''INSERT INTO TargetDatabase (name, value) VALUES(?,?)''',
                  a_batch_rows)
    c.commit()

    c.execute('''SELECT * FROM TargetDatabase;''')
    r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
    print r


    #c.close()
    #connection.close()
    """






