#!/usr/bin/python

import utilities
import operator

"""
 * @author n662293
 """

"""
 * Function to select anchor tables from nodes based on anchor tables list
 """

def main():
    node_dict = {'customers': set(['customercustomerdemo', 'orders']), 'suppliers': set(['products']), 'customercustomerdemo': set(['customers', 'customerdemographics']), 'employees': set(['employeeterritories', 'employees', 'orders']), 'territories': set(['employeeterritories', 'region']), 'shippers': set(['orders']), 'products': set(['suppliers', 'categories', 'orderdetails']), 'orderdetails': set(['products', 'orders']), 'employeeterritories': set(['territories', 'employees']), 'customerdemographics': set(['customercustomerdemo']), 'region': set(['territories']), 'orders': set(['customers', 'shippers', 'employees', 'orderdetails']), 'categories': set(['products'])}
    node_weights = {'customers': 2, 'customercustomerdemo': 2, 'suppliers': 1, 'orders': 4, 'territories': 2, 'shippers': 1, 'products': 3, 'orderdetails': 2, 'employeeterritories': 2, 'customerdemographics': 1, 'region': 1, 'employees': 3, 'categories': 1}

    if not node_weights == {}:
        node_weights_sorted = sorted(node_weights.iteritems(), key=operator.itemgetter(1), reverse=True)
        key = 'orders'
        root = node_weights_sorted[0]
        L1 = root[0]
        print L1
        key = L1
        print key

    root = []

    # for k,v in node_dict.iteritems():
    if node_dict.has_key(key):
        print node_dict.get(key)
        anchors = list(node_dict.get(key))
        # for child in childs:
        #     if node_dict.has_key(child):
        root.append(key)
    generate_tree(root,node_dict,node_weights,anchors)

def generate_tree(root,node_dict,node_weights,anchors):

    utilities.print_info("Selecting anchor tables started...")
    print "node_dict:"
    print node_dict
    ex_flag, in_flag = 0, 0


# loop through the anchors to perform dfs function for each present in anchor list
    anchors_dcit = {}
    for keys in anchors:
        level = 2
        child = 1
        # print "keys:" + str(keys)
        init = 0
        visited_tbls_final = []
        root.append(keys)
        visited_tbls = dfs(root,node_dict,node_weights,level,child,node_dict[keys],init,anchors)
        print "visited_tbls:" + str(visited_tbls)
        for c_tbl in visited_tbls:
            # ex_in_flag = 1
            #
            # if ex_flag == 1:
            #     ex_in_flag = exclude_tables_from_metadata(c_tbl, exclude_table_list)
            # else:
            #     if in_flag == 1:
            #         ex_in_flag = include_tables_from_metadata(c_tbl, include_table_list)
            #     else:
            #         ex_in_flag = 0
            #
            # if ex_in_flag == 0:
            print c_tbl
            visited_tbls_final.append(c_tbl)
        print visited_tbls_final
        anchors_dcit.setdefault(keys, sorted(set(visited_tbls_final),key=visited_tbls.index))

    utilities.print_info("Selecting anchor tables completed...")

    return anchors_dcit

"""
 * Function to implement the Depth-first search algorithm by avoiding the anchors
 """
def dfs(root,graph,node_weights,level,child,node, init, anchors,visited =[]):
    # Initializing the visited list for every new anchor
    if init == 0:
        visited[:] =[]
    for n in node:
        print "n in node:" + str(n)
        if n in graph.keys():
            print "n in graph.keys():" + str(n)
            if n not in visited and n not in anchors and n not in root:
                print "n:" + str(n) + " node_weight:" + str(node_weights.get(n)) + " level:" + str(level)
                if n in node_weights:
                    weight = node_weights.get(n)

                    if weight > 1:
                        level += 1

                    print "root:" + str(root) + " level:" + str(level) + " child:" + str(child)
                    visited.append(n)
                    print "1st append:" + str(visited)
                    init = 1
                    # Recursive call on the dfs function
                    root.append(n)
                    dfs(root,graph,node_weights,level,child, graph[n], init, anchors,visited)
        elif n not in anchors and n not in root:
            visited.append(n)
            # print "2nd append:" + str(visited)
    return visited

if __name__ == '__main__':
    main()