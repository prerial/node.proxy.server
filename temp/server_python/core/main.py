#!/usr/bin/python

# -run s -d mysql -s northwind -a Employees,Customers,Orders -erwinf H:\DataModeler\dmc\data\input\NorthwindXmlMinFile.xml
# -run S -d mysql -s daf -a Daf
import pickle
import argparse
import csv
import json
import logging
import utilities
import os
import sys
import urllib
import requests
import urlparse

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from anchor_tables import select_anchor_tables
from db_metadata import generate_metadata_qry
from db_session import db_session
from relationships import generate_relationships
from patterns import validate_tables_selection
from generate_erd import generate_erdjson
from denormalization import generate_denorm_ddl
from generate_dictionary import generate_dict
from erwin_xmlparser import erwin_xml_parser
from helpers import check_args
from log import start_logging
from version import version as __version__
import re

"""
 * @author n662293
 """

"""
 * Entry point for the DataModelConvertor application
 """
def main(url):

    parser = argparse.ArgumentParser(prog='dmc')

    parser.add_argument('-run', nargs='?', help='Name of the run type.')
    parser.add_argument('-d', nargs='?', help='Name of the database.')
    parser.add_argument('-s', nargs='?', help='Name of the schema.')
    parser.add_argument('-host', nargs='?', help='Name of the host.')
    parser.add_argument('-usr', nargs='?', help='Name of the user.')
    parser.add_argument('-pwd', nargs='?', help='Password.')
    parser.add_argument('-a', nargs='?', help='Name of the anchor tables list.')
    parser.add_argument('-x', nargs='?', help='Name of the exclude tables list.')
    parser.add_argument('-i', nargs='?', help='Name of the include tables list.')
    parser.add_argument('-r', nargs='?', help='Name of the relationships csv file.')
    parser.add_argument('-nof', nargs='?', help='Name of the native output file.')
    parser.add_argument('-hof', nargs='?', help='Name of the hive output file.')
    parser.add_argument('-dmlf', nargs='?', help='Name of the dml output file.')
    parser.add_argument('-erwinf', nargs='?', help='Name of the erwin xml file.')
    parser.add_argument('-target', nargs='?', help='Name of the target.')
    parser.add_argument('-v', help='Prints version number.',action='store_true')

    args = parser.parse_args()

    denorm_type = "None"

    if str(url) != 'None' and str(url) != "":

        args.run = url
        run_type = url

        url_dict = urlparse.parse_qs(urlparse.urlparse(url).query)

        for k, v in url_dict.items():
            if k == 'schema_include':
                for i in v:
                    datasource = str(i).split("_")
                    args.d = datasource[0]
                    args.s = datasource[1]
            elif k == 'schema_target':
                for i in v:
                    target_schema = i
            elif k == 'database':
                for i in v:
                    database = i
            elif k == 'single':
                for i in v:
                    denorm_type = i
            elif k == 'anchors':
                for i in v:
                    args.a = i
            elif k == 'tables_include':
                for i in v:
                    args.i = i
            elif k == 'tables_exclude':
                for i in v:
                    args.x = i

    check_args(args)

    if args.v:
        print('Data Modeler Converter version {}.'.format(__version__))
        exit(0)

    logger = logging.getLogger()

    try:
        """
         * run paramter is
         * S indicates Standalone run
         * denorm_type indicates GUI run
         """
        if str(args.run).upper() == 'S':
            result_json = denormalize(args.run, args.d, args.s, args.host, args.usr, args.pwd, args.a, args.erwinf,
                                      args.x, args.i, args.r, args.nof, args.hof, args.dmlf, args.target, denorm_type)
        elif denorm_type.upper() == 'TRUE' :
            result_json = denormalize(args.run, args.d, args.s, args.host, args.usr, args.pwd, args.a, args.erwinf,
                                      args.x, args.i, args.r, args.nof, args.hof, args.dmlf, args.target, denorm_type)

        elif denorm_type.upper() == "FALSE" or denorm_type.upper() == "NONE":
            result_json = denormalize(args.run, args.d, args.s, args.host, args.usr, args.pwd, args.a, args.erwinf,
                                      args.x, args.i, args.r, args.nof, args.hof, args.dmlf, args.target, denorm_type)
    except Exception as e:
        utilities.abort_with_traceback_msg("Fatal Error: " + str(e))
        if str(args.run).upper() != 'S':
            result_json = generate_error_json_response(str(e))

    return result_json
"""
 * Function to denormalizes the tables from relational databases or erwin xml file
 @data_source: dattabase name
 @db_schema: schema name
 @anchor_tables: list of anchor tables
 @erwin_xmlfile: erwin xml file
 @exclude_tables: list of tables excluded from denormalizattion process
 @include_tables: list of tables included for denormalization process
 @relationships_file: if relationships are not existing between tables, then provide through this file
 @native_outputfile: native denormalized ddl output file
 @hive_outputfile: hive denormalized ddl output file
 @dml_outputfile: denormalized dml file which contains insert statements to insert data from base tables to denormalized tables
 """
def denormalize(run_type, data_source, db_schema, host_name, user_name, password, anchor_tables, erwin_xmlfile,
                exclude_tables, include_tables, relationships_file, native_outputfile, hive_outputfile,
                dml_outputfile, target_schema, denorm_type):
    result_json = []

    # To run standalone mode
    if str(run_type).upper() == 'S':
        start_logging(data_source, erwin_xmlfile)

        if str(erwin_xmlfile) == "None":
            conn, message = db_session(data_source, db_schema, host_name, user_name, password)
            metadata = get_metadata(conn, data_source, db_schema)
            relationships_data = generate_relationships(relationships_file, metadata, exclude_tables, include_tables)
            generate_csv(metadata, relationships_data)
            entity_json = generate_json(data_source, metadata, relationships_data)
            erd_json = generate_erdjson(entity_json, db_schema)
            exception_flag, message, ex_table_list, in_table_list = validate_tables_selection(anchor_tables, exclude_tables, include_tables)
            if exception_flag == 1:
                utilities.abort_with_traceback_msg(message)
            else:
                node_dict, node_columns_dict, ddl_dict, node_weights = generate_dict(ex_table_list, in_table_list)
                anchors_dcit = select_anchor_tables(node_dict, anchor_tables, in_table_list)
                denorm_json = generate_denorm_ddl(ddl_dict, anchors_dcit, db_schema, native_outputfile, hive_outputfile, dml_outputfile)
                result_json = denorm_json
        else:
            entity_json = erwin_xml_parser(erwin_xmlfile)
            erd_json = generate_erdjson(entity_json, db_schema)
            data_source = "ERWIN"
            db_schema = None
            exception_flag, message, ex_table_list, in_table_list = validate_tables_selection(anchor_tables, exclude_tables, include_tables)
            if exception_flag == 1:
                utilities.abort_with_traceback_msg(message)
            else:
                node_dict, node_columns_dict, ddl_dict, node_weights = generate_dict(ex_table_list, in_table_list)
                anchors_dcit = select_anchor_tables(node_dict, anchor_tables, in_table_list)
                denorm_json = generate_denorm_ddl(ddl_dict, anchors_dcit, db_schema, native_outputfile, hive_outputfile, dml_outputfile)
                result_json = denorm_json

    # UI Single step process
    elif denorm_type.upper() == 'TRUE':
        start_logging(data_source, erwin_xmlfile)
        conn, message = db_session(data_source, db_schema, host_name, user_name, password)
        if conn == '':
            result_json = generate_error_json_response(message)
        else:
            metadata = get_metadata(conn, data_source, db_schema)
            relationships_data = generate_relationships(relationships_file, metadata, exclude_tables, include_tables)
            generate_csv(metadata, relationships_data)
            entity_json = generate_json(data_source, metadata, relationships_data)
            erd_json = generate_erdjson(entity_json, db_schema)
            exception_flag, message, ex_table_list, in_table_list = validate_tables_selection(anchor_tables, exclude_tables, include_tables)
            if exception_flag == 1:
                result_json = generate_error_json_response(message)
            else:
                node_dict, node_columns_dict, ddl_dict, node_weights = generate_dict(ex_table_list, in_table_list)
                anchors_dcit = select_anchor_tables(node_dict, anchor_tables, in_table_list)
                denorm_json = generate_denorm_ddl(ddl_dict, anchors_dcit, db_schema, native_outputfile, hive_outputfile, dml_outputfile)
                result_json = denorm_json

    # UI Two step process:
    # Request No2 : to render erd json schema for visulization.
    elif denorm_type.upper() == "FALSE":
        start_logging(data_source, erwin_xmlfile)
        conn,message = db_session(data_source, db_schema, host_name, user_name, password)
        if conn == '':
            result_json = generate_error_json_response(message)
        else:
            metadata = get_metadata(conn, data_source, db_schema)
            relationships_data = generate_relationships(relationships_file, metadata, exclude_tables, include_tables)
            generate_csv(metadata, relationships_data)
            entity_json = generate_json(data_source, metadata, relationships_data)
            erd_json = generate_erdjson(entity_json, db_schema)
            result_json = erd_json

    # Request No3 : To render denormalize json schema, ddl, dml.
    elif denorm_type.upper() == "NONE":
        data_source = 'denorm'
        start_logging(data_source, erwin_xmlfile)
        exception_flag, message, ex_table_list, in_table_list = validate_tables_selection(anchor_tables, exclude_tables, include_tables)
        if exception_flag == 1:
            result_json = generate_error_json_response(message)
        else:
            node_dict, node_columns_dict, ddl_dict, node_weights = generate_dict(ex_table_list, in_table_list)
            anchors_dcit = select_anchor_tables(node_dict, anchor_tables, in_table_list)
            denorm_json = generate_denorm_ddl(ddl_dict, anchors_dcit, db_schema, native_outputfile, hive_outputfile, dml_outputfile)
            result_json = denorm_json

    utilities.print_info("Denormalization process completed...")

    return result_json

"""
 * Function to get metadata from the database and schema
 """
def get_metadata(conn,data_source,db_schema):
    utilities.print_info("Getting metadata started...")

    metadata_query = generate_metadata_qry(data_source,db_schema)

    metadata = []

    try:
        cur = conn.cursor()
        cur.execute(metadata_query)
        f_names = tuple([i[0] for i in cur.description])
        field_names = [str(x).lower() for x in f_names]
        metadata.append(field_names)
        metadata.append(cur.fetchall())

    except Exception as err:
        conn.rollback()
        cur.close()
        conn.close()
        utilities.abort_with_msg("An exception of type " + type(err).__name__ + "occured. Arguments:\n" + str(err.args))
    finally:
        cur.close()
        conn.close()

    utilities.print_info("Gettting metadata completed...")

    return metadata

"""
 * Function to save metadata into csv file for reference purpose
 """
def generate_csv(metadata,relationships_data):
    utilities.print_info("Generating csv file started...")

    csv_file = utilities.Config.METADATA_CSV_FILE
    csvfile = csv.writer(open(csv_file, 'wb'))

    # Writting metadata in csv file
    field_names = metadata[0]
    header = '|'.join(map(str, field_names))
    csvfile.writerow(header.split(("|")))

    for c in metadata[1]:
        c_tbl = c[1]
        row = "|".join(map(str, c))
        csvfile.writerow(row.split("|"))

    utilities.print_info("Generating csv file completed...")

"""
 * Function to generate json file from metadata which is base for further processing
 """
def generate_json(data_source,metadata,relationships_data):
    utilities.print_info("Generating json file started...")

    json_file = utilities.Config.JSON_FILE
    jsonfile = open(json_file, "wb")

    json_tbl_file = utilities.Config.JSON_TBL_FILE
    jsontblfile = open(json_tbl_file, "wb")

    # Generating json from metadata
    table_schema = metadata[1][0][0]
    table_name_tmp = metadata[1][0][1]

    entity_json = []

    entity_data = {
        "name": table_name_tmp,
        "namespace": table_schema + "." + table_name_tmp,
        "columns" : []
    }

    table_json = {
        "tables": []
    }

    for c in metadata[1]:
        c_tbl = c[1]

        table_schema = c[0]
        table_name = c[1]
        column_name = c[2]
        column_type = c[4]
        data_length = c[5]
        numeric_precision = c[9]
        numeric_scale = c[10]
        referenced_table_name = "No"
        if str(c[14]) != "None":
            referenced_table_name = c[14]
        referenced_column_name = "No"
        if str(c[15]) != "None":
            referenced_column_name = c[15]
        constraint_type = "No"
        if str(c[17]) != "None":
            constraint_type = c[17]

        if str(data_source).upper() == "MYSQL":
            expr = re.compile("(\w+(?: \([^\)]*\))?)")
            field_dtype_list = expr.findall(column_type)
            field_datatype = field_dtype_list[0]

            data_length = 0

            if len(field_dtype_list) == 2:
                data_length = field_dtype_list[1]
            if len(field_dtype_list) == 3:
                data_length = field_dtype_list[1] + "," + field_dtype_list[2]

        elif str(data_source).upper() == "ORACLE":
            field_datatype = column_type
            if column_type == "number" or column_type == "number_int" or \
               column_type == "decimal" or column_type == "double":
                if str(numeric_precision) != "None":
                    data_length = str(numeric_precision) + "," + str(numeric_scale)

        p_key = "false"
        if str(constraint_type).upper() == "PRIMARY KEY":
            p_key = "true"

        if table_name_tmp == table_name :
            entity_data["columns"].append(
                {"name": column_name, "type": field_datatype, "size": data_length, "primaryKey": p_key, \
                 "constraintType": constraint_type, "referencedTableName": referenced_table_name,
                 "referencedColumnName": referenced_column_name})
        else:
            if not entity_data["columns"] == []:
                entity_json.append(entity_data)
                table_json["tables"].append(entity_data.get("name"))

            entity_data = ""
            entity_data = {
                "name": table_name,
                "namespace": table_schema + "." + table_name,
                "columns": []
            }

            entity_data["columns"].append(
                {"name": column_name, "type": field_datatype, "size": data_length,
                 "primaryKey": p_key, \
                 "constraintType": constraint_type, "referencedTableName": referenced_table_name,
                 "referencedColumnName": referenced_column_name})

        table_name_tmp = table_name

    # Handling last entity
    if not entity_data["columns"] == []:
        entity_json.append(entity_data)
        table_json["tables"].append(entity_data.get("name"))

    json.dump(entity_json, jsonfile, indent=1)

    json.dump(table_json, jsontblfile, indent=1)

    utilities.print_info("Generating json file completed...")

    return entity_json

"""
 * Function to generate error json response
 """
def generate_error_json_response(message):
    result_json_data = {
        "status": "error",
        "message": message,
        "payload": []
    }
    result_json = json.dumps(result_json_data, indent=1)
    return result_json

if __name__ == '__main__':
    main(url = '')