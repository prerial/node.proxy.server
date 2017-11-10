from datetime import datetime
import logging
import sys
import os
import ConfigParser

"""
 * @author n662293
"""

"""
 * Global variables
 """
class GlobalValues:
    project_root = os.path.abspath(os.path.dirname(__file__))

class MsgColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

logger = logging.getLogger()

"""
 * Global configuration parameters extracting from config file
 """
class Config:
    try:
        project_root = os.path.dirname(__file__)
        parent_dir = os.path.dirname(project_root)
        conf_file = os.path.join(parent_dir, 'config', 'dmc.cfg')
        config = ConfigParser.RawConfigParser()
        config.read(conf_file)

        INTERFACE = str(config.get('interfaces', 'interface'))

        ERD_INFILE = str(config.get('xml_converter', 'erd.input.location'))
        ERD_OUTFILE = str(config.get('xml_converter', 'erd.output.location'))

        mysqlConnectionString = str(config.get('jdbc_driver', 'db.mysql.url'))
        MYSQL_HOST = mysqlConnectionString.split("//")[1]
        MYSQL_USR = config.get('jdbc_driver', 'db.mysql.user')
        MYSQL_PWD = config.get('jdbc_driver', 'db.mysql.password')

        oracleConnectionString = str(config.get('jdbc_driver', 'db.oracle.url'))
        ORACLE_HOST = oracleConnectionString.split("//")[1]
        ORACLE_USR = config.get('jdbc_driver', 'db.oracle.user')
        ORACLE_PWD = config.get('jdbc_driver', 'db.oracle.password')

        INCLUDE_TABLE_LIST = str(config.get('table_include', 'byTableList'))
        INCLUDE_SCHEMA_OWNER = str(config.get('table_include', 'bySchemaOwner'))

        EXCLUDE_TABLE_LIST = str(config.get('table_exclude', 'byTableList'))
        EXCLUDE_SCHEMA_OWNER = str(config.get('table_exclude', 'bySchemaOwner'))

        TARGET_DB = str(config.get('target_database', 'targetDb'))
        TARGET_TABLE_TYPE = str(config.get('target_database', 'targetTableType'))
        TARGET_TABLE_FILE_FORMAT = str(config.get('target_database', 'targetTableFileFormat'))

        TARGET_SCHEMA = str(config.get('target_schema', 'targetSchemaType'))

        RULES = str(config.get('rules', 'flattenRules'))

        REF_CSV_FILE = str(config.get('input_files', 'ref.csv.file.location'))
        NORTHWIND_CSV_FILE = str(config.get('input_files', 'ref.northwind.file.location'))
        DAF_CSV_FILE = str(config.get('input_files', 'ref.daf.file.location'))

        METADATA_CSV_FILE = config.get('output_files', 'metadata.csv.file.location')
        JSON_FILE = config.get('output_files', 'json.file.location')
        JSON_TBL_FILE = config.get('output_files', 'json.tbl.file.location')
        ERD_JSON_FILE = config.get('output_files', 'erd.json.file.location')
        DENORM_NATIVE_DDL_FILE = config.get('output_files', 'denorm.native.ddl.file.location')
        DENORM_CSV_FILE = config.get('output_files', 'denorm.csv.file.location')
        DENORM_HIVE_DDL_FILE = config.get('output_files', 'denorm.hive.ddl.file.location')
        DENORM_DML_FILE = config.get('output_files', 'denorm.dml.file.location')
        LOG_DIR = config.get('output_files', 'log.dir.location')

    except Exception as e:
        msg = "config file Error: " + str(e)
        ts = datetime.now().strftime("%m/%d/%Y %H:%M:%S.%f")[:-3]
        print(MsgColors.FAIL + ts + ": ERROR: " + msg + "\t" + MsgColors.ENDC)
        sys.exit(-1)

"""
 * Functions to generate and format infomation, warning, exception messages
 """
def abort_with_traceback_msg(msg):
    ts = datetime.now().strftime("%m/%d/%Y %H:%M:%S.%f")[:-3]
    print(MsgColors.FAIL + "\t" + ts + ": ERROR: " + msg + "\t" + MsgColors.ENDC)
    logger.exception(ts + ": ERROR: " + msg)
    return "tracevvvvvvvvvvvvvvvvvvv:" + msg
    sys.exit(-1)

def abort_with_msg(msg):
    ts = datetime.now().strftime("%m/%d/%Y %H:%M:%S.%f")[:-3]
    print(MsgColors.FAIL + "\t" + ts + ": ERROR: " + msg + "\t" + MsgColors.ENDC)
    logger.debug(ts + ": ERROR: " + msg)
    sys.exit(-1)

def print_warn(msg):
    ts = datetime.now().strftime("%m/%d/%Y %H:%M:%S.%f")[:-3]
    print(ts + ": WARNING: " + msg)
    logger.warning(MsgColors.WARNING + "\t" + ts + ": WARNING: " + msg + "\t" + MsgColors.ENDC)

def print_info(msg):
    ts = datetime.now().strftime("%m/%d/%Y %H:%M:%S.%f")[:-3]
    logger.info(ts + ": INFO: " + msg)