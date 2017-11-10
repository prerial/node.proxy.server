#!/usr/bin/python

import utilities
from platform import system
import os
import logging
from version import version as __version__
from datetime import datetime

"""
 * @author n662293
 """

"""
 * Function to generate logs
 """
def start_logging(data_source,erwin_xmlfile):
    current_os = system()

    if current_os != "Windows":
        dir_sep = "/"
    else:
        dir_sep = "\\"

    log_dir = utilities.Config.LOG_DIR + dir_sep

    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    if str(erwin_xmlfile) != "None":
        source_name = "erwin"
    else:
        if str(data_source) != "None":
            source_name = data_source

    log_filename = log_dir + source_name + "_" + datetime.now().strftime("%Y%m%d%H%M%S") + ".log"
    logger = logging.getLogger()
    handler = logging.FileHandler(log_filename)
    handler.setLevel(logging.INFO)

    # add the handlers to the logger
    logger.addHandler(handler)

    utilities.print_info("Logging started")

    utilities.print_info("DataModel Converter Framework version: " + format(__version__))

    utilities.print_info("Log file for the current run: " + log_filename)
    utilities.print_info("Base Directory is " + log_dir)
    utilities.print_info("Denormalization process started...")