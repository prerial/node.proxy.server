from unittest import TestCase
import unittest
from server_python.core.anchor_tables import select_anchor_tables

# graph = {'Customers': set(['CustomerCustomerDemo', 'Orders']),
#      'Suppliers': set(['Products']),
#      'CustomerCustomerDemo': set(['Customers', 'CustomerDemographics']),
#      'Employees': set(['EmployeeTerritories', 'Employees', 'Orders']),
#      'Territories': set(['EmployeeTerritories', 'Region']), 'Shippers': set(['Orders']),
#      'Products': set(['Suppliers', 'Categories', 'OrderDetails']),
#      'OrderDetails': set(['Products', 'Orders']),
#      'EmployeeTerritories': set(['Territories', 'Employees']),
#      'CustomerDemographics': set(['CustomerCustomerDemo']),
#      'Region': set(['Territories']),
#      'Orders': set(['Customers', 'Shippers', 'Employees', 'OrderDetails']),
#      'Categories': set(['Products'])}
# anchor_tables_three = str("Employees,Customers,Orders")
# anchor_tables_two = str("Employees,Orders")
# anchor_tables_one = str("Employees")

graph = {u'ddm_fct_dep_fnce_0621': set([u'ddm_fct_dep_fnce']),
 u'ddm_fct_txn_msr_temp_hist': set([u'ddm_fct_txn_msr']),
 u'ddm_clar_acct_txn_type_cd': set([u'ddm_clar_acct_cs_txn_cd']),
 u'ddm_fct_acct': set([u'ddm_fct_acct_0621', u'ddm_fct_acct_aa', u'ddm_fct_acct_bkp', u'ddm_fct_acct_ytd_0621', u'ddm_fct_acct_ytd']),
 u'ddm_fct_dep_prft_0621': set([u'ddm_fct_dep_fnce']),
 u'ddm_fct_txn_rjct_msr': set([u'ddm_fct_txn_msr']),
 u'ddm_sum_acct_txn_cat_msr_0621': set([u'ddm_sum_acct_txn_cat_msr']),
 u'ddm_sum_anl_txn_cat': set([u'ddm_sum_acct_txn_cat_msr']),
 u'ddm_clar_acct_cs_txn_cd': set([u'ddm_clar_acct_txn_type_cd']),
 u'ddm_fct_txn_msr_new': set([u'ddm_fct_txn_msr']),
 u'ddm_sum_anl_txn_cat_0621': set([u'ddm_sum_acct_txn_cat_msr']),
 u'ddm_fct_acct_ytd_0621': set([u'ddm_fct_acct']),
 u'ddm_fct_acct_ytd': set([u'ddm_fct_acct']),
 u'ddm_fct_acct_bkp': set([u'ddm_fct_acct']),
 u'ddm_fct_swp_acct': set([u'ddm_fct_swp_acct']),
 u'ddm_fct_rcvr': set([u'ddm_fct_dep_fnce', u'ddm_fct_rcvr_0621']),
 u'ddm_sum_cap_ddb_txn_cat': set([u'ddm_sum_acct_txn_cat_msr']),
 u'ddm_fct_dep_fnce': set([u'ddm_fct_dep_prft', u'ddm_fct_dep_fnce_0621', u'ddm_fct_rcvr', u'ddm_fct_rcvr_0621', u'ddm_fct_dep_prft_0621']),
 u'ddm_fct_acct_0621': set([u'ddm_fct_acct']),
 u'ddm_fct_rcvr_0621': set([u'ddm_fct_dep_fnce', u'ddm_fct_rcvr']),
 u'ddm_fct_txn_msr': set([u'ddm_fct_txn_msr_temp_hist', u'ddm_fct_txn_msr_new', u'ddm_fct_txn_rjct_msr', u'ddm_fct_txn_msr_rnr']),
 u'ddm_fct_acct_aa': set([u'ddm_fct_acct']),
 u'ddm_fct_dep_prft': set([u'ddm_fct_dep_fnce']),
 u'ddm_sum_acct_txn_cat_msr': set([u'ddm_sum_anl_txn_cat', u'ddm_sum_cap_ddb_txn_cat', u'ddm_sum_anl_txn_cat_0621', u'ddm_sum_acct_txn_cat_msr_0621']),
 u'ddm_fct_txn_msr_rnr': set([u'ddm_fct_txn_msr'])}

anchor_tables_three = str("ddm_fct_txn_msr,ddm_sum_acct_txn_cat_msr,ddm_fct_acct")
anchor_tables_two = str("ddm_fct_txn_msr,ddm_sum_acct_txn_cat_msr")
anchor_tables_one = str("ddm_fct_txn_msr")

class TestSelect_anchor_tables(TestCase):

    def test_three_anchors(self):
        result = select_anchor_tables(graph, anchor_tables_three)
        self.assertEquals(select_anchor_tables(graph, anchor_tables_three), result)

    def test_two_anchors(self):
        result = select_anchor_tables(graph, anchor_tables_two)
        self.assertEquals(select_anchor_tables(graph, anchor_tables_two), result)

    def test_one_anchors(self):
        result = select_anchor_tables(graph, anchor_tables_one)
        self.assertEquals(select_anchor_tables(graph, anchor_tables_one), result)

if __name__ == '__main__':
    unittest.main()
