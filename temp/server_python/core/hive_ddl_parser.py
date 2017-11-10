#!/usr/bin/python

import utilities
import re
import json

"""
 * @author n662293
 """

"""
 * Function to generate hive or impala ddl
 """
def generate_hive_ddl(hive_outputfile,dml_dict):
    utilities.print_info("Generating denormalization Hive/Impala DDL process started...")

    ref_table = utilities.Config.REF_CSV_FILE
    meta_table = utilities.Config.DENORM_CSV_FILE

    load_ref = load_ref_table(ref_table)
    load_meta = load_meta_table(meta_table)
    load_merge = merge_both(load_meta, load_ref)
    denorm_json = create_ddl(load_merge, hive_outputfile, dml_dict)

    utilities.print_info("Generating denormalization Hive/Impala DDL process completed...")

    return denorm_json

"""
 * Function to load the reference table for selected database and replace one to one mapping keywords
 """
def load_ref_table(ref_table):

    target_db = utilities.Config.TARGET_DB

    ls_ref = []
    fileHandle = open(ref_table, 'r')
    for line in fileHandle:
        fields = line.split(',')
        if fields[2] in ('HIVE-IMPALA', str(target_db).upper()) :
            joining = fields[1].rstrip().lower() + '^' + fields[3].rstrip().lower() + '^' + \
                      fields[4].rstrip().lower() + '^' + fields[5].rstrip().lower() + '^' + fields[6].rstrip().lower()
            ls_ref.append(joining)

    fileHandle.close()
    return ls_ref

"""
 * Function to load metadata table(denormalized csv file) file and load into memory with selected values
 """
def load_meta_table(meta_table):

    ls_meta = []
    fileHandle = open(meta_table, 'r')
    for line in fileHandle:
        fields = line.split('^')
        joining = fields[0].rstrip().lower() + '^' + fields[1].rstrip().lower() + '^' + fields[2].rstrip().lower() + '^' + fields[3].rstrip().lower() \
                  + '^' + fields[4].rstrip().lower() + '^' + fields[6].rstrip().lower()
        ls_meta.append(joining)

    fileHandle.close()
    return ls_meta

"""
 * Function to read metadata table, reference table and merge both
 """
def merge_both(ls_meta, ls_ref):

    ls_merge = []
    for line in ls_meta:
        fields = line.split('^')
        for line_ref in ls_ref:
            fields_ref = line_ref.split('^')
            if fields[2] == fields_ref[0]:
                joining = fields[0].rstrip().lower() + '^' + fields[1].rstrip().lower() + '^' + fields[2].rstrip().lower() \
                          + '^' + fields_ref[1].rstrip().lower() + '^' + fields[3].rstrip().lower() \
                          + '^' + fields_ref[2].rstrip().lower() + '^' + fields[4].rstrip().lower() \
                          + '^' + fields_ref[3].rstrip().lower() + '^' + fields_ref[4].rstrip().lower()
                ls_merge.append(joining)
                break
            else:
                continue
    return ls_merge

"""
 * Function to create denormalized hive or impala ddls
 """
def create_ddl(ls_meta, hive_outputfile, dml_dict):
    table_type = utilities.Config.TARGET_TABLE_TYPE
    table_format = utilities.Config.TARGET_TABLE_FILE_FORMAT

    if str(hive_outputfile) == "None":
        hive_ddl_file = utilities.Config.DENORM_HIVE_DDL_FILE
    else:
        hive_ddl_file = hive_outputfile

    fileHandle = open(hive_ddl_file, 'wb')

    anchors_json_data = []
    anchors_json = {
        "status": "success",
        "message": "",
        "payload": anchors_json_data
    }

    ls_ddl_table = []
    for line_ddl in ls_meta:
        fields_ddl = line_ddl.split('^')
        table_name = fields_ddl[0]
        ls_ddl_table.append(table_name)
    table_name = set(ls_ddl_table)
    ls_ddl_table = table_name # distinct table name

    for line_ddl in ls_ddl_table: # creating final DDL for hive/impala
        count=0
        str1=''
        ddl_create_statement = []
        final_statement = ''
        create_rec = "create " + table_type + " table " + str(line_ddl).upper() + "("
        ddl_create_statement.append(create_rec)

        for line_ddl_all in ls_meta:
            if count >0:
                str1=','
            fields_ddl_all = line_ddl_all.split('^')
            if line_ddl == fields_ddl_all[0] and fields_ddl_all[8] == 'n':
                field_joining = "     " + str1 + fields_ddl_all[1].rstrip().lower() + ' ' + fields_ddl_all[3].rstrip().lower()
                ddl_create_statement.append(field_joining)
                count = count+1
            elif line_ddl == fields_ddl_all[0] and fields_ddl_all[8] == 'y':
                if fields_ddl_all[6] == '':  # checking for null value in scale
                    fields_ddl_all[6]=0
                else:
                    fields_ddl_all[6]
                if fields_ddl_all[7] == '':
                    fields_ddl_all[7]=0
                else:
                    fields_ddl_all[7]

                if int(fields_ddl_all[4]) > int(fields_ddl_all[5]) or int(fields_ddl_all[6]) > int(fields_ddl_all[7]):
                    if (fields_ddl_all[3].rstrip().lower()) in ('varchar', 'varchar2','char','character'):
                        field_joining = "     " + str1 +fields_ddl_all[1].rstrip().lower() + ' ' + fields_ddl_all[3].rstrip().lower() + '(' + fields_ddl_all[4].rstrip().lower() \
                          +  ')' + '  WARNNING : This data type is exceding the limit of targeted database data type' \
                                                                             ' Max alloction is ' + fields_ddl_all[3].rstrip().lower() + '(' + \
                                                                                                fields_ddl_all[5] + ',' + str(fields_ddl_all[7]) + ')'
                    else:
                        field_joining = "     " + str1 +fields_ddl_all[1].rstrip().lower() + ' ' + fields_ddl_all[3].rstrip().lower() + '(' + fields_ddl_all[4].rstrip().lower() \
                          + ',' + fields_ddl_all[6].rstrip().lower() + ')' + '  WARNNING : This data type is exceding the limit of targeted database data type' \
                                                                             ' Max alloction is ' + fields_ddl_all[3].rstrip().lower() + '(' + \
                                                                                                fields_ddl_all[5] + ',' + str(fields_ddl_all[7]) + ')'
                else:
                    if (fields_ddl_all[3].rstrip().lower()) in ('varchar', 'varchar2','char','character'):
                        field_joining = "     " + str1 +fields_ddl_all[1].rstrip().lower() + ' ' + fields_ddl_all[3].rstrip().lower() + '(' + fields_ddl_all[4].rstrip().lower() \
                              + ')'
                    else:
                        field_joining = "     " + str1 +fields_ddl_all[1].rstrip().lower() + ' ' + fields_ddl_all[3].rstrip().lower() + '(' + fields_ddl_all[4].rstrip().lower() \
                              + ',' + str(fields_ddl_all[6]).rstrip().lower() + ')'

                ddl_create_statement.append(field_joining)
                count=count+1

        end_line = ")row format delimited fields terminated by ',' stored as " + table_format +";" + '\n'
        ddl_create_statement.append(end_line)

        final_statement = '\n'.join(ddl_create_statement)
        fileHandle.write(final_statement)

        # generating denorm json

        ddl_statement = final_statement
        dml_statement = ""

        anchors_data = {
            "name": line_ddl,
            "columns": [],
            "ddl": ddl_statement,
            "dml": dml_statement
        }
        table = line_ddl
        if dml_dict.has_key(table):
            dml_statement = dml_dict.get(table)
            anchors_data["dml"] = dml_statement

        expr = re.compile("(\w+(?: \([^\)]*\))?)")

        for line in ddl_statement.split("\n"):
            column = str(line).replace('     ,', '').replace('     ', '').split(" ")
            column_name = column[0]

            if column_name not in ("create", ");", ")row", ""):
                column_type = column[1]

                field_dtype_list = expr.findall(column_type)
                field_datatype = field_dtype_list[0]

                data_length = ""

                if len(field_dtype_list) == 2:
                    data_length = field_dtype_list[1]
                if len(field_dtype_list) == 3:
                    data_length = field_dtype_list[1] + "," + field_dtype_list[2]

                anchors_data["columns"].append(
                    {"name": column_name, "type": field_datatype, "size": data_length})

        anchors_json_data.append(anchors_data)

    denorm_json = json.dumps(anchors_json, indent=1)

    fileHandle.close()

    return denorm_json