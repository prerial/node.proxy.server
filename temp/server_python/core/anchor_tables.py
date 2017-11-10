#!/usr/bin/python

import utilities

"""
 * @author n662293
 """

"""
 * Function to select anchor tables from nodes based on anchor tables list
 """

def select_anchor_tables(node_dict, anchor_tables, in_table_list):
    utilities.print_info("Selecting anchor tables started...")
    an_flag, in_flag = 0, 0

    if str(anchor_tables) != "None" and str(anchor_tables) != "":
        anchors = str(anchor_tables).lower().split(",")
        an_flag = 1
    elif in_table_list != []:
        in_flag = 1

# loop through the anchors to perform dfs function for each present in anchor list
    anchors_dcit = {}
    if an_flag == 1:
        for keys in anchors:
            init = 0
            visited_tbls = dfs(node_dict, node_dict[keys], init, anchors)
            anchors_dcit.setdefault(keys, sorted(set(visited_tbls),key=visited_tbls.index))

    if in_flag == 1:
        for keys in in_table_list:
            anchors_dcit.setdefault(keys, [])
    # print anchors_dcit

    utilities.print_info("Selecting anchor tables completed...")

    return anchors_dcit

"""
 * Function to implement the Depth-first search algorithm by avoiding the anchors
 """
def dfs(graph, node, init, anchors, visited =[]):
    # Initializing the visited list for every new anchor
    if init == 0:
        visited[:] =[]
    for n in node:
        if n in graph.keys():
            if n not in visited and n not in anchors:
                visited.append(n)
                init = 1
                # Recursive call on the dfs function
                dfs(graph, graph[n], init, anchors, visited)
        elif n not in anchors:
            visited.append(n)
    return visited