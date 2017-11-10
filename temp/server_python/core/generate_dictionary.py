#!/usr/bin/python

import json
import utilities
from patterns import in_ex_tables_from_node_dict

"""
 * @author n662293
 """

"""
 * Function to generate node, node columns, ddl dictionaries
 """
def generate_dict(ex_table_list,in_table_list):
    utilities.print_info("Generating dictionary started...")

    json_file = utilities.Config.JSON_FILE

    with open(json_file) as json_data:
        jdata = json.load(json_data)

    node_list_all = []
    node_dict = {}
    node_weights = {}
    node_columns_list = []
    node_columns_dict = {}
    ddl_list = []
    ddl_dict = {}

    for i in range(len(jdata)):
        table_name_tmp = jdata[i]["name"]
        table_name = str(table_name_tmp)

        for doc in jdata[i]["columns"]:
            column_name = str(doc["name"])
            column_type = str(doc["type"])
            data_length = str(doc["size"])
            constraint_type = str(doc["constraintType"])
            primaryKey = str(doc["primaryKey"])
            referenced_table_name = str(doc["referencedTableName"])
            referenced_column_name = str(doc["referencedColumnName"])

            if column_type.lower() == "varchar2" or column_type.lower() == "varchar" or \
               column_type.lower() == "char" or column_type.lower() == "number" or \
               column_type.lower() == "decimal" or column_type.lower() == "double":
                column_type = column_type + "(" + data_length + ")"

            if constraint_type == "FOREIGN KEY":
                node_list_all.append((table_name,referenced_table_name))
                node_list_all.append((referenced_table_name,table_name))
                ddl_list.append((table_name, column_name, column_type, constraint_type, referenced_table_name, referenced_column_name))

            node_columns_list.append((table_name, column_name))
            ddl_list.append((table_name,column_name,column_type,constraint_type,referenced_table_name,referenced_column_name))

    node_list = []

    if ex_table_list != []:
        ex_node_list = in_ex_tables_from_node_dict(node_list_all, ex_table_list)
        if ex_node_list != []:
            node_list = [item for item in node_list_all if item not in ex_node_list]
        else:
            node_list = node_list_all
    elif in_table_list != []:
        in_node_list = in_ex_tables_from_node_dict(node_list_all, in_table_list)
        if in_node_list != []:
            node_list = [item for item in node_list_all if item in in_node_list]
        else:
            node_list = node_list_all
    else:
        node_list = node_list_all

    for x in node_list:
        node_dict.setdefault(x[0], set()).add(x[1])

    for k,v in node_dict.iteritems():
        count = 0
        for x in node_dict.get(k):
            count += 1
        node_weights[k] = count

    uni_cols=[]
    for x in node_columns_list:
        if x not in uni_cols :
            uni_cols.append(x)

    for x in uni_cols:
        node_columns_dict.setdefault(x[0], []).append(x[1])

    for x in ddl_list:
        ddl_dict.setdefault(x[0], []).append(x[1] + " " + x[2] + "#" + x[3] + "," + x[4] + "," + x[5])

    utilities.print_info("Generating dictionary completed...")

    return node_dict, node_columns_dict, ddl_dict, node_weights