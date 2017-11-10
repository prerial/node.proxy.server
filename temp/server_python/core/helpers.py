#!/usr/bin/python

import sys

"""
 * @author n662293
 """

"""
 * Functions to check the arguments
 """
def fail(message, *args):
    print >> sys.stderr, 'Error:' , message % args
    sys.exit(1)

def pass1(message, *args):
    print >> sys.stderr, 'Note:' , message % args

def check_args(args):

    if (str(args.run).upper() == 'S'):
        if (args.erwinf is not None and args.d is not None and args.s is not None and (args.a is not None or args.i is not None)):
            fail('Cannot perform denormalization if both database details and erwin file are provided, specify either -d, -s, (-a or -i) options or -erwinf, (-a or -i) options..............')

        if args.erwinf is not None :
            if (args.a is None and args.i is None) or (args.a is not None and args.i is not None):
                fail('Cannot perform denormalization if anchor tables and include tables are not provided, specify either -a or -i or (-a, -x) options..............')
        else:
            if (args.d is None and args.s is None and (args.a is None or args.i is None)):
                fail('Cannot perform denormalization if both database details and erwin file are not provided, specify either -d, -s, (-a or -i or (-a, -x)) options or -erwinf, (-a or -i or (-a, -x)) options..............')
            else:
                if (args.d is None or args.s is None or (args.a is None and args.i is None)):
                    fail('Cannot perform denormalization if database details are not provided, specify -d, -s with either -a or -i or (-a, -x) options..............')

            if (args.d is not None and args.s is not None):
                if (args.a is None and args.i is None) or (args.a is not None and args.i is not None):
                    fail('Cannot perform denormalization if anchor tables and include tables are not provided, specify either -a or -i or (-a, -x) options..............')

                if (args.a is None and args.x is not None):
                    fail('Cannot perform denormalization if exclude tables provided without anchor tables, specify either -a or -i or (-a, -x) options..............')

                if (args.host is None and args.usr is None and args.pwd is None) or (args.host is not None and args.usr is not None and args.pwd is not None):
                    pass
                else:
                    fail('Cannot perform denormalization if database details are not provided, make sure that -host -usr -pwd options are provided or None of them provided..............')

        if args.a is not None and args.i is not None and args.x is not None:
            fail('Cannot perform denormalization if anchors, include and exclude tables are provided, specify either -a or -i or (-a, -x) options..............')