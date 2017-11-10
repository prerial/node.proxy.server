#!/usr/bin/python

"""
 * @author n662293
 """

"""
 * Function to generate exceptions with traceback information
 """

class ParsingException(Exception):
    base_traceback = 'Error on line {line_nb}: {line}\n{error}'
    hint = None

    @property
    def traceback(self):
        rv = self.base_traceback.format(
            line_nb=getattr(self, 'line_nb', '?'),
            line=getattr(self, 'line', ''),
            error=self.args[0],
        )
        if self.hint is not None:
            rv += '\nHINT: {}'.format(self.hint)

        return rv

class DuplicateTableException(ParsingException):
    pass

