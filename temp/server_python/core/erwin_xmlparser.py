#!/usr/bin/python

from xml.dom.minidom import parse
import xml.dom.minidom
import json
import re
import utilities

"""
 * @author n662293
 """

"""
 * Function to parse erwin xml file
 """
def erwin_xml_parser(erwin_xmlfile):

    utilities.print_info("Erwin xml parser started...")

    json_file = utilities.Config.JSON_FILE
    jsonfile = open(json_file, "wb")

    json_tbl_file = utilities.Config.JSON_TBL_FILE
    jsontblfile = open(json_tbl_file, "wb")

    table_json = {
        "tables": []
    }

    DOMTree = xml.dom.minidom.parse(erwin_xmlfile)
    root = DOMTree.documentElement

    relationshipGroups = root.getElementsByTagName("Relationship_Groups")

    relationship_dict = get_relationships(relationshipGroups)

    entity_json = []

    entityGroups = root.getElementsByTagName("Entity_Groups")

    for etGroup in entityGroups:
        for entity in etGroup.getElementsByTagName("Entity"):

            schema_name,table_name = '',''

            if entity.getElementsByTagName("EntityProps"):
                entityProps = entity.getElementsByTagName("EntityProps")
                for eptags in entityProps:
                    schema = eptags.getElementsByTagName("Schema_Name")[0]
                    schema_name = schema.childNodes[0].data

                    table = eptags.getElementsByTagName("Name")[0]
                    table_name = str(table.childNodes[0].data).lower()

            table_columns = extract_entity_attributes(entity,table_name)
            pkeys_list, fkeys_list = extract_primary_foregin_keys(entity,table_name)
            generate_json(schema_name,table_name,table_columns, pkeys_list, fkeys_list,relationship_dict,entity_json,table_json)

        json.dump(entity_json, jsonfile, indent=2)

        json.dump(table_json, jsontblfile, indent=2)

        return entity_json
        utilities.print_info("Erwin xml parser completed...")

"""
 * Function to extract relationship tags
 """
def get_relationships(relationshipGroups):

    relationship_list = []
    relationship_dict = {}

    for rGroup in relationshipGroups:
        for relationship in rGroup.getElementsByTagName("Relationship"):
            relationship_name, relationship_id = '', ''
            if relationship.hasAttribute("name"):
                relationship_name = relationship.getAttribute("name")
            if relationship.hasAttribute("id"):
                relationship_id = relationship.getAttribute("id")
            relationship_list.append((relationship_id, relationship_name))
            relationship_dict = dict((k, v) for k, v in relationship_list)

    return relationship_dict

"""
 * Function to extract entity column tags
 """
def extract_entity_attributes(entity,table_name):
    table_columns = []
    if entity.getElementsByTagName("Attribute_Groups"):
        attributeGroups = entity.getElementsByTagName("Attribute_Groups")
        for agtags in attributeGroups:
            attributeProps = entity.getElementsByTagName("AttributeProps")
            ordinal_position = 0
            for aptags in attributeProps:
                if aptags.getElementsByTagName("Name"):
                    column = aptags.getElementsByTagName("Name")[0]
                    column_name = str(column.childNodes[0].data).lower()
                    ordinal_position += 1

                if aptags.getElementsByTagName("Physical_Data_Type"):
                    column = aptags.getElementsByTagName("Physical_Data_Type")[0]
                    column_data_type = column.childNodes[0].data
                    if str(column_data_type).__contains__("text"):
                        column_data_type = "text"
                else:
                    column_data_type = 'varchar(108)'

                row = table_name + '^' + column_name + '^' + column_data_type + '^' + str(ordinal_position)
                table_columns.append(row)
    return table_columns

"""
 * Function to extract primary and foreign key tags
 """
def extract_primary_foregin_keys(entity,table_name):
    pkeys_list = []
    fkeys_list = []

    if entity.getElementsByTagName("Key_Group_Groups"):
        for kggtags in entity.getElementsByTagName("Key_Group_Groups"):
            if kggtags.getElementsByTagName("Key_Group"):
                for kgtags in kggtags.getElementsByTagName("Key_Group"):
                    constraint_name, constraint_type = '', ''
                    if kgtags.hasAttribute("name"):
                        constraint_name = kgtags.getAttribute("name")

                    for kgptags in kgtags.getElementsByTagName("Key_GroupProps"):
                        if kgptags.getElementsByTagName("Key_Group_Type"):
                            key = kgptags.getElementsByTagName("Key_Group_Type")[0]
                            key_type = key.childNodes[0].data

                        if kgptags.getElementsByTagName("Relationship_Ref"):
                            rel_ref = kgptags.getElementsByTagName("Relationship_Ref")[0]
                            relationship_ref = rel_ref.childNodes[0].data

                        if str(key_type).upper() == 'PK':
                            constraint_type = "PRIMARY KEY"

                            for kgmgtags in kgtags.getElementsByTagName("Key_Group_Member_Groups"):
                                if kgmgtags.getElementsByTagName("Key_Group_Member"):
                                    constraint_column = ''
                                    for kgmtags in kgmgtags.getElementsByTagName("Key_Group_Member"):
                                        if kgmtags.hasAttribute("name"):
                                            constraint_column = str(kgmtags.getAttribute("name")).lower()
                                            pkeys_list.append(constraint_column)

                        if str(key_type)[0:2].upper() == 'IF':
                            constraint_type = "FOREIGN KEY"

                            for kgmgtags in kgtags.getElementsByTagName("Key_Group_Member_Groups"):
                                if kgmgtags.getElementsByTagName("Key_Group_Member"):
                                    constraint_column = ''
                                    for kgmtags in kgmgtags.getElementsByTagName("Key_Group_Member"):
                                        if kgmtags.hasAttribute("name"):
                                            constraint_column = str(kgmtags.getAttribute("name")).lower()
                                            fkeys_list.append((relationship_ref, constraint_column))
    return  pkeys_list, fkeys_list

"""
 * Function to generate json file
 """
def generate_json(schema_name,table_name,table_columns, pkeys_list, fkeys_list,relationship_dict,entity_json,table_json):
    entity_data = {
        "name": table_name,
        "namespace": schema_name + "." + table_name,
        "columns": []
    }

    for row in table_columns:
        colmns_list = str(row).split("^")
        column_name = str(colmns_list[1])
        column_data_type = str(colmns_list[2])

        expr = re.compile("(\w+(?: \([^\)]*\))?)")
        field_dtype_list = expr.findall(column_data_type)
        field_datatype = field_dtype_list[0]

        data_length = 0

        if len(field_dtype_list) == 2:
            data_length = field_dtype_list[1]
        if len(field_dtype_list) == 3:
            data_length = field_dtype_list[1] + "," + field_dtype_list[2]

        # extracting primary keys
        flag = 0
        p_key = "false"
        constraint_type = "No"
        referenced_table_name = "No"
        referenced_column_name = "No"

        if column_name in pkeys_list:
            p_key = "true"
            constraint_type = "PRIMARY KEY"
            flag = 1
            append_fields(entity_data, column_name, field_datatype, data_length, p_key, constraint_type,
                          referenced_table_name, referenced_column_name)

        # extracting foreign keys
        for x in fkeys_list:
            if column_name in x[1]:
                if x[0] in relationship_dict:
                    constraint_type = "FOREIGN KEY"
                    relationship_name = str(relationship_dict.get(x[0])).lower().split("_")
                    referenced_table_name = relationship_name[2]
                    flag = 1
                    append_fields(entity_data, column_name, field_datatype, data_length, p_key, constraint_type,
                                  referenced_table_name, referenced_column_name)

        if flag == 0:
            append_fields(entity_data, column_name, field_datatype, data_length, p_key, constraint_type,
                          referenced_table_name, referenced_column_name)

    if not entity_data["columns"] == []:
        entity_json.append(entity_data)
        table_json["tables"].append(entity_data.get("name"))

"""
 * Function to append fields to json dictionary
 """
def append_fields(entity_data,column_name,field_datatype,data_length,p_key,constraint_type,referenced_table_name,referenced_column_name):

    if referenced_table_name == "None":
        referenced_table_name = "No"

    if referenced_column_name == "None":
        referenced_column_name = "No"

    if constraint_type == "None":
        constraint_type = "No"

    entity_data["columns"].append(
        {"name": column_name, "type": field_datatype, "size": data_length,
         "primaryKey": p_key, "constraintType": constraint_type, "referencedTableName": referenced_table_name,
         "referencedColumnName": referenced_column_name})