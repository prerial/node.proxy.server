import utilities
import json

"""
 * @author n662293
 """

"""
 * Function to validate anchor, import and exclude tables selection
 """
def validate_tables_selection(anchor_tables,exclude_tables,include_tables):

    json_tbl_file = utilities.Config.JSON_TBL_FILE
    jsontblfile = open(json_tbl_file, "r")

    table_list_all = []
    ex_table_list = []
    in_table_list = []
    message = ""
    exception_flag = 0
    an_flag, ex_flag, in_flag = 0, 0, 0

    with open(json_tbl_file) as jsontblfile:
        table_dict = json.load(jsontblfile)

    if table_dict.has_key("tables"):
        for tbl in table_dict.get("tables"):
            table_list_all.append(str(tbl))

    if str(anchor_tables) != "None" and str(anchor_tables) != "":
        anchor_table_list = str(anchor_tables).lower().split(",")
        an_flag = 1

    if str(include_tables) != "None" and str(include_tables) != "":
        include_table_list = str(include_tables).lower().split(",")
        in_flag = 1

    if str(exclude_tables) != "None" and str(exclude_tables) != "":
        exclude_table_list = str(exclude_tables).lower().split(",")
        ex_flag = 1

    if an_flag == 1 and in_flag == 1 and ex_flag == 1:
        message = "selection of anchor, exclude and include tables are wrong, select either anchor tables or include tables or anchor tables with exclude tables"
        exception_flag = 1
    elif an_flag == 1 and in_flag == 1:
        message = "selection of both anchor, include tables are wrong, select either anchor tables or include tables or anchor tables with exclude tables"
        exception_flag = 1
    elif in_flag == 1 and ex_flag == 1:
        message = "selection of both include, exclude tables are wrong, select either anchor tables or include tables or anchor tables with exclude tables"
        exception_flag = 1
    elif an_flag == 0 and ex_flag == 1:
        message = "selection of exclude tables without anchor tables are wrong, select either anchor tables or include tables or anchor tables with exclude tables"
        exception_flag = 1

    if exception_flag == 0:
        if ex_flag == 1:
            if "*" in str(exclude_tables):
                ex_table_list = prepare_in_ex_table_lists(table_list_all, exclude_table_list)
            else:
                ex_table_list = exclude_table_list

        if in_flag == 1:
            if "*" in str(include_tables):
                in_table_list = prepare_in_ex_table_lists(table_list_all, include_table_list)
            else:
                in_table_list = include_table_list

        if ex_flag == 1 and in_flag == 1:
            check_table_list = [item for item in ex_table_list if item in in_table_list]
            if check_table_list != []:
                message = "wrong selection of include and exclude tables"
                exception_flag = 1

        elif an_flag == 1 and ex_flag == 1:
            check_table_list = [item for item in ex_table_list if item in anchor_table_list]
            if check_table_list != []:
                message = "wrong selection between anchor and exclude tables"
                exception_flag = 1

    return exception_flag, message, ex_table_list, in_table_list

"""
 * Function to prepare import/exclude table lists
 """
def prepare_in_ex_table_lists(table_list_all,table_list):

    flag = 0
    res_table_list = []

    for k in table_list_all:
        for tbl in table_list:
            flag = 0
            if str(tbl) == str(k):
                flag = 1
            elif (str(tbl).find("*") != -1):
                if str(tbl).index("*") == 0:
                    if str(k).upper().endswith(str(tbl).upper()[1:len(str(tbl))]):
                        flag = 1
                else:
                    if str(k).upper().startswith(str(tbl).upper()[0:len(str(tbl)) - 1]):
                        flag = 1
            if flag == 1:
                res_table_list.append(k)

    return res_table_list

"""
 * Function to import/exclude tables from node dict for denormalization
 """
def in_ex_tables_from_node_dict(node_list_all,table_list):

    node_list = []

    for (k, v) in node_list_all:
        for tbl in table_list:
            if str(tbl) == str(k) or str(tbl) == str(v):
                node_list.append((k,v))

    return node_list

"""
 * Function to exclude tables from metadata for denormalization
 """
def exclude_tables_from_metadata(c_tbl,exclude_table_list):
    exclude_flag = 0

    for tbl in exclude_table_list:
        if str(c_tbl) == str(tbl):
            exclude_flag = 1

    return exclude_flag

"""
 * Function to include tables from metadata for denormalization
 """
def include_tables_from_metadata(c_tbl,include_table_list):
    include_flag = 1

    for tbl in include_table_list:
        if str(c_tbl) == str(tbl):
            include_flag = 0

    return include_flag
