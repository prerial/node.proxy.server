#!/usr/bin/python

import utilities
import json

"""
 * @author n662293
 """

"""
 * Function to generate ERD Json dictionary
 """
def generate_erdjson(entity_json, db_schema):
    utilities.print_info("Generating ERD json process started...")

    erd_json_file = utilities.Config.ERD_JSON_FILE
    erdfile = open(erd_json_file, 'wb')

    if str(db_schema).lower() == "northwind":
        tree_file = utilities.Config.NORTHWIND_CSV_FILE
        treefile = open(tree_file, 'r')
        tree_list = []
        for line in treefile:
            tree_list.append(line)
    elif str(db_schema).lower() == "daf":
        tree_file = utilities.Config.DAF_CSV_FILE
        treefile = open(tree_file, 'r')
        tree_list = []
        for line in treefile:
            tree_list.append(line)

    erd_dict = []
    erd_dict.append("{")
    status = "success"
    message = ''
    erd_dict.append('"status"' + ': "' + status + '",')
    erd_dict.append('"message"' + ': "' + message + '",')
    erd_dict.append('"payload"' + ": [")
    erd_dict.append("{")
    root_flag = 1
    prev_level = ''
    prev_parent_level = ''
    root_start_level = 'l1'
    bracket_count = 0
    children_count = 0
    tree_count = 0

    for row in tree_list:
        row_split = str(row.rstrip("\n")).lower().split(":")
        parent_level = row_split[0]
        current_level = row_split[1]
        key = row_split[2]

        if parent_level == "" and current_level == root_start_level:
            tree_count += 1

        if tree_count == 2:
            if bracket_count > 0:
                erd_dict.append('}')
                for i in range(bracket_count-1):
                    erd_dict.append(']')
                    erd_dict.append('}')
                erd_dict.append(']')
                bracket_count = 1
            else:
                bracket_count = 0
            tree_count = 1
            children_count = 0

        for dict in entity_json:
            entity_flag = 0
            for k, v in dict.iteritems():
                if dict.has_key(k):
                    if str(k).lower() == "name":
                        entity_name = dict.get(k)
                        if entity_name == key:
                            entity_flag = 1

                    if entity_flag == 1:
                        if str(k).lower() == "columns":
                            columns = dict.get(k)

                            if prev_level in parent_level:
                                if root_flag == 1:
                                    erd_dict.append('"name":' + '"' + str(key) + '",')
                                    erd_dict.append('"columns":' + str(columns).replace("'",'"'))
                                    root_flag = 0
                                else:
                                    children_count += 1
                                    erd_dict.append(',"children":[')
                                    erd_dict.append('{')
                                    erd_dict.append('"name":' + '"' + str(key) + '",')
                                    erd_dict.append('"columns":' + str(columns).replace("'",'"'))
                                    bracket_count += 1

                            elif prev_parent_level in parent_level:
                                root_flag = 1
                                if root_flag == 1:
                                    erd_dict.append('}')
                                    erd_dict.append(',{')
                                    erd_dict.append('"name":' + '"' + str(key) + '",')
                                    erd_dict.append('"columns":' + str(columns).replace("'",'"'))
                                    root_flag = 0

                            elif parent_level in root_start_level:
                                if children_count > 1:
                                    children_count -= 1

                                i = 0
                                for i in range(children_count):
                                    erd_dict.append('}')
                                    erd_dict.append(']')

                                children_count = 0
                                bracket_count = bracket_count - i - 1
                                erd_dict.append('}')
                                erd_dict.append(',{')
                                erd_dict.append('"name":' + '"' + str(key) + '",')
                                erd_dict.append('"columns":' + str(columns).replace("'", '"'))
                                root_flag = 0


                            else:
                                root_flag = 1
                                if root_flag == 1:

                                    if children_count > 1:
                                        children_count -= 1

                                    i = 0
                                    for i in range(children_count):
                                        erd_dict.append('}')
                                        erd_dict.append(']')
                                    children_count = children_count - i
                                    bracket_count = bracket_count - i - 1
                                    erd_dict.append('}')
                                    erd_dict.append(',{')
                                    erd_dict.append('"name":' + '"' + str(key) + '",')
                                    erd_dict.append('"columns":' + str(columns).replace("'",'"'))
                                    root_flag = 0

        prev_level = current_level
        prev_parent_level = parent_level

    erd_dict.append('}')
    for i in range(bracket_count):
        erd_dict.append(']')
        erd_dict.append('}')
    erd_dict.append(']')
    erd_dict.append('}')

    erd_json = "\n".join(erd_dict)

    erdfile.write(erd_json)

    utilities.print_info("Generating ERD json process completed...")

    return erd_json