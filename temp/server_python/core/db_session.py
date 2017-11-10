#!/usr/bin/python

import MySQLdb
import cx_Oracle
import utilities
import logging

"""
 * @author n662293
 """

logging.basicConfig(level=logging.INFO)

"""
 * Function to establish database connection
 """
def db_session(data_source,db_schema,host_name,user_name,password):

    utilities.print_info("Connecting to " + data_source.upper() + " datasource...")

    conn = ''
    db = db_schema
    message = ''
    # ------------------------ Make Connection ------------------------
    if str(data_source).upper() == "MYSQL":
        if str(host_name) == "None":
            host = utilities.Config.MYSQL_HOST
        else:
            host = host_name

        if str(user_name) == "None":
            usr = utilities.Config.MYSQL_USR
        else:
            usr = user_name

        if str(password) == "None":
            pwd = utilities.Config.MYSQL_PWD
        else:
            pwd = password

        try:
            conn = MySQLdb.connect(host, usr, pwd, db)
            utilities.print_info("Connection sucessfull...")
        except Exception as e:
            message = str(e)
            utilities.abort_with_traceback_msg("db_session.py: The Exception during db.connect: " + str(e))

    elif str(data_source).upper() == "ORACLE":
        if str(host_name) == "None":
            host = utilities.Config.ORACLE_HOST
        else:
            host = host_name

        if str(user_name) == "None":
            usr = utilities.Config.ORACLE_USR
        else:
            usr = user_name

        if str(password) == "None":
            pwd = utilities.Config.ORACLE_PWD
        else:
            pwd = password

        try:
            conn = cx_Oracle.connect(usr, pwd, host)
            utilities.print_info("Connection sucessfull...")
        except Exception as e:
            message = str(e)
            utilities.abort_with_traceback_msg("db_session.py: The Exception during db.connect: " + str(e))

    return conn, message