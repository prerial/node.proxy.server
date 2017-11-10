import utilities
import csv
from patterns import exclude_tables_from_metadata
from patterns import include_tables_from_metadata

"""
 * @author n662293
 """

"""
 * Function to generate relationships between tables from relationships file
 """
def generate_relationships(relationships_file,metadata,exclude_tables,include_tables):

    utilities.print_info("Generating relationships data started...")

    relationships_data = []
    ex_flag, in_flag = 0, 0

    if str(exclude_tables) != "None":
        exclude_table_list = str(exclude_tables).lower().split(",")
        ex_flag = 1

    if str(include_tables) != "None":
        include_table_list = str(include_tables).lower().split(",")
        in_flag = 1

    if str(relationships_file) != "None":
        relationships_csv_file = relationships_file
        relationships_csvfile = csv.reader(open(relationships_csv_file, 'r'))

        for line in relationships_csvfile:
            c_tbl = str(line[0]).lower()
            ex_in_flag = 1

            line_lower = str(line[0] + "," + line[1] + "," + line[2]).lower()
            row = tuple(line_lower.strip(',').split(','))

            if str(c_tbl).lower() == 'entity1':
                relationships_data.append(row)
            else:
                if ex_flag == 1:
                    ex_in_flag = exclude_tables_from_metadata(c_tbl, exclude_table_list)
                else:
                    if in_flag == 1:
                        ex_in_flag = include_tables_from_metadata(c_tbl, include_table_list)
                    else:
                        ex_in_flag = 0

            if ex_in_flag == 0:
                relationships_data.append(row)

    utilities.print_info("Generating relationships data completed...")

    return relationships_data