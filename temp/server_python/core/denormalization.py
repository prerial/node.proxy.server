#!/usr/bin/python

import utilities
import re
from hive_ddl_parser import generate_hive_ddl
import json
"""
 * @author n662293
 """

"""
 * Function to generate denormalized ddls
 """
def generate_denorm_ddl(ddl_dict, anchor_tables, db_schema, native_outputfile, hive_outputfile, dml_outputfile):
    utilities.print_info("Generating denormalization DDL process started...")

    denorm_json_native, dml_dict = generate_native_ddl(ddl_dict, anchor_tables, db_schema, native_outputfile, dml_outputfile)
    denorm_json = generate_hive_ddl(hive_outputfile, dml_dict)

    utilities.print_info("Generating denormalization DDL process completed...")

    return denorm_json
"""
 * Function to generate denormalized native ddls
 """
def generate_native_ddl(ddl_dict, anchor_tables, db_schema, native_outputfile, dml_outputfile):
    utilities.print_info("Generating denormalization native DDL process started...")

    if str(native_outputfile) == "None":
        denorm_ddl_file = utilities.Config.DENORM_NATIVE_DDL_FILE
    else:
        denorm_ddl_file = native_outputfile

    ddlfile = open(denorm_ddl_file, 'wb')

    denorm_csv_file = utilities.Config.DENORM_CSV_FILE
    csvfile = open(denorm_csv_file, 'wb')

    if str(dml_outputfile) == "None":
        denorm_dml_file = utilities.Config.DENORM_DML_FILE
    else:
        denorm_dml_file = dml_outputfile

    dmlfile = open(denorm_dml_file, 'wb')

    anchors_json_data = []
    anchors_json = {
        "status": "success",
        "message": "",
        "payload": anchors_json_data
    }
    dml_dict = {}

    for anchor_k, anchor_v in anchor_tables.iteritems():
        rows = []
        create_line = ''
        insert_line = ''
        ins_from_line = "from  "
        if str(db_schema) == "None":
            ins_from_line = ins_from_line + str(anchor_k)
        else:
            ins_from_line = ins_from_line + str(db_schema) + "." + str(anchor_k)

        where_condtions = []
        anchor_list = []
        anchor_list.append(anchor_k)
        for rel in anchor_v:
            anchor_list.append(rel)

        for ddl_k, ddl_v in ddl_dict.iteritems():
            if ddl_k == anchor_k:
                create_line = "create table "+ str(ddl_k).upper() + "("
                insert_line = "insert into table " + str(ddl_k).upper()
                create_ddl(ddl_k,ddl_v,rows,anchor_list,where_condtions)

        for anchor_v1 in anchor_v :
            if str(db_schema) == "None":
                ins_from_line = ins_from_line + ", " + str(anchor_v1)
            else:
                ins_from_line = ins_from_line + ", " + str(db_schema) + "." + str(anchor_v1)

            for ddl_k, ddl_v in ddl_dict.iteritems():
                if ddl_k == anchor_v1:
                    create_ddl(ddl_k,ddl_v,rows,anchor_list,where_condtions)

        record, csv_record, insert_record = remove_duplicates_form_ddl(rows,create_line,insert_line,ins_from_line,where_condtions,db_schema)

        ddlfile.write(record)
        csvfile.write(csv_record)
        dmlfile.write(insert_record)

        # generating denorm json

        dml_dict.setdefault(anchor_k, insert_record)

        anchors_data = {
            "name": anchor_k,
            "columns": [],
            "ddl": record,
            "dml": insert_record
        }

        expr = re.compile("(\w+(?: \([^\)]*\))?)")

        for line in record.split("\n"):
            column = str(line).replace('    ,', '').replace('     ', '').split(" ")
            column_name = column[0]

            if column_name not in ("create",");",""):
                column_type = column[1]

                field_dtype_list = expr.findall(column_type)
                field_datatype = field_dtype_list[0]

                data_length = 0

                if len(field_dtype_list) == 2:
                    data_length = field_dtype_list[1]
                if len(field_dtype_list) == 3:
                    data_length = field_dtype_list[1] + "," + field_dtype_list[2]

                anchors_data["columns"].append(
                {"name": column_name, "type": field_datatype, "size": data_length})

        anchors_json_data.append(anchors_data)

    denorm_json = json.dumps(anchors_json,indent=1)

    utilities.print_info("Generating denormalization native DDL process completed...")

    return denorm_json, dml_dict

"""
 * Function to generate rows for create and insert statements
 """
def create_ddl(ddl_k,ddl_v,rows,anchor_list,where_condtions):

    for column in ddl_v :
        rows.append(ddl_k + "#" + column)

        row_list = str(column).split("#")
        table_name = str(ddl_k)
        col_name = str(row_list[0]).split(" ")[0]
        reference_list = str(row_list[1]).split(",")
        ins_reference_table_name = str(reference_list[1])
        ins_reference_col_name = str(reference_list[2])

        if table_name !=  ins_reference_table_name:
            if ins_reference_table_name != "No":
                if ins_reference_table_name in anchor_list:
                    if ins_reference_col_name == "No":
                        conditon = table_name + "." + col_name + " = " + ins_reference_table_name + "." + col_name
                    else:
                        conditon = table_name + "." + col_name + " = " + ins_reference_table_name + "." + ins_reference_col_name
                    if conditon not in where_condtions:
                        where_condtions.append(conditon)

"""
 * Function to remove duplicate rows from ddl and insert statements
 """
def remove_duplicates_form_ddl(rows,create_line,insert_line,ins_from_line,where_condtions,db_schema):

    uni_columns = []
    uni_rows = []
    ins_uni_rows = []
    column_id = 0
    csv_create_statement = []
    column_name = ""

    tbl_name = create_line.split(" ")[2].split("(")[0]

    for row in rows:
        row_list = str(row).split("#")
        table_name = str(row_list[0])
        cur_col_name_list = str(row_list[1]).split(" ")
        cur_col_name = cur_col_name_list[0]
        cur_col_datatype = cur_col_name_list[1]
        key_type = str(row_list[2]).split(",")[0]

        if cur_col_name not in uni_columns :
            uni_columns.append(cur_col_name)
            column_name = row_list[1]
            uni_rows.append(column_name)
            ins_uni_rows.append(row_list[0] + "." + cur_col_name)
            column_id += 1
            csv_rec = generate_csvrec_hive(tbl_name,column_name,column_id)
            csv_create_statement.append(csv_rec)
        else:
            ind = uni_columns.index(cur_col_name)
            uni_col_datatype = str(uni_rows[ind]).split(" ")
            uni_colname = uni_col_datatype[0]
            uni_col_datatype = uni_col_datatype[1]
            ext_column_name = row_list[1]
            if cur_col_datatype == "varchar(108)":
                ext_column_name = uni_colname + " " + uni_col_datatype
            else:
                if uni_col_datatype == "varchar(108)":
                    ext_column_name = row_list[1]
            uni_rows[ind] = ext_column_name
            if key_type == "No" :
                uni_columns.append(cur_col_name)
                uni_rows.append(row_list[0] + "_" + row_list[1])
                ins_uni_rows.append(row_list[0] + "." + cur_col_name)
                column_name = row_list[0] + "_" + row_list[1]
                column_id += 1
                csv_rec = generate_csvrec_hive(tbl_name,column_name,column_id)
                csv_create_statement.append(csv_rec)

    first_rec = 1
    ins_first_rec = 1
    final_statement = ''
    end_line = "); \n"
    create_statement = []

    create_statement.append(create_line)

    for l in uni_rows:
        l = l.replace('number_int', 'number')
        if first_rec == 1:
            create_statement.append("     " + str(l))
            first_rec = 0
        else:
            create_statement.append("    ," + str(l))

    create_statement.append(end_line)
    final_statement = '\n'.join(create_statement)

    # generating insert statement
    insert_statement = []
    insert_statement.append(insert_line)

    for l in ins_uni_rows:
        if ins_first_rec  == 1:
            insert_statement.append("select " + str(l))
            ins_first_rec = 0
        else:
            insert_statement.append("      ," + str(l))

    insert_statement.append(ins_from_line)
    where_cond_flag = 1
    ins_where_line = ""
    for cond in where_condtions:
        if where_cond_flag == 1:
            ins_where_line = "where " + ins_where_line + str(cond)
            where_cond_flag = 0
        else:
            ins_where_line = ins_where_line + "\nand   " + str(cond)

    ins_where_line = ins_where_line + "; \n \n"
    insert_statement.append(ins_where_line)

    final_insert_statement = '\n'.join(insert_statement)

    csv_final_statement = ''
    csv_final_statement = '\n'.join(csv_create_statement)
    csv_final_statement = csv_final_statement + "\n"

    return final_statement, csv_final_statement, final_insert_statement

"""
 * Function to generate denormalized csv file which is using for generation of denormalized hive ddl
 """
def generate_csvrec_hive(tbl_name,column_name,column_id):
    field_list = column_name.split(" ")
    field_name = field_list[0]
    expr = re.compile("(\w+(?: \([^\)]*\))?)")
    field_dtype_list = expr.findall(field_list[1])
    field_datatype = field_dtype_list[0]
    if field_dtype_list[0] == 'integer-int':
        field_datatype = 'number'

    data_length = 0
    data_scale = 0
    csv_rec = ""
    if len(field_dtype_list) == 2:
        data_length = field_dtype_list[1]
    if len(field_dtype_list) == 3:
        data_length = field_dtype_list[1]
        data_scale = field_dtype_list[2]

    csv_rec = tbl_name + "^" + field_name + "^" + field_datatype + "^" + str(data_length) + "^" + str(data_scale) + "^0^" + str(column_id)

    return csv_rec