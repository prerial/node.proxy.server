#!/usr/bin/python

import utilities

"""
 * @author n662293
 """

"""
 * Function to generate metadata query from data source and schema
 """
def generate_metadata_qry(data_source,db_schema):
    utilities.print_info("Generating metadata query...")

    if str(data_source).upper() == "MYSQL":
        qry = ("""select lower(a.table_schema) as table_schema,lower(a.table_name) as table_name,lower(a.column_name) as column_name,a.ordinal_position,
                     lower(a.column_type) as column_type,character_maximum_length as data_length,a.column_default,
                     a.is_nullable,lower(a.data_type) as data_type,a.numeric_precision,a.numeric_scale,
                     a.extra,b.index_name,
                     lower(b.referenced_table_schema) as referenced_table_schema,lower(b.referenced_table_name) as referenced_table_name,lower(b.referenced_column_name) as referenced_column_name,
                     b.constraint_name,b.constraint_type
                     from information_schema.columns a
                     left outer join
                     (select distinct s.table_schema,s.table_name,
                     case when pfkeys.constraint_name = 'PRIMARY' or s.index_name = 'PRIMARY' then pfkeys.constraint_name else s.index_name end as index_name,
                     s.column_name,
                     case when pfkeys.constraint_name ='PRIMARY' then null else pfkeys.referenced_table_schema end as referenced_table_schema,
                     case when pfkeys.constraint_name ='PRIMARY' then null else pfkeys.referenced_table_name end as referenced_table_name,
                     case when pfkeys.constraint_name ='PRIMARY' then null else pfkeys.referenced_column_name end as referenced_column_name,
                     pfkeys.constraint_name,pfkeys.constraint_type
                     from information_schema.statistics s
                     left outer join
                     (select kcu.table_schema,kcu.table_name,kcu.column_name,kcu.referenced_table_schema,kcu.referenced_table_name,kcu.referenced_column_name,tc.constraint_name,tc.constraint_type
                     from information_schema.key_column_usage kcu,information_schema.table_constraints tc
                     where kcu.constraint_schema = '%s' and kcu.constraint_schema = tc.constraint_schema and kcu.table_name = tc.table_name and
                     kcu.constraint_name = tc.constraint_name) pfkeys
                     on s.table_schema = pfkeys.table_schema and s.table_name = pfkeys.table_name and s.column_name = pfkeys.column_name
                     where s.table_schema = '%s'
                     ) b
                     on a.table_schema = b.table_schema and a.table_name = b.table_name and a.column_name = b.column_name
                     where a.table_schema = '%s'
                     order by a.table_name,a.ordinal_position;
                     """) % (str(db_schema), str(db_schema), str(db_schema))

    elif str(data_source).upper() == "ORACLE":
        qry = ("""select case when b.owner is null then lower('%s') else lower(b.owner) end as table_schema,
                    lower(a.table_name) as table_name,lower(a.column_name) as column_name,a.column_id as ordinal_position,
                    case when a.data_type = 'NUMBER' and a.data_precision is null and a.data_scale is null then 'number_int'
                         when a.data_type = 'NUMBER' and a.data_precision is null and a.data_scale = 0 then 'number_int' else lower(a.data_type) end column_type,
                    a.data_length,a.data_default as column_default,
                    case when a.nullable = 'N' then 'NO' else 'YES' end as is_nullable,
                    lower(a.data_type) as data_type,
                    a.data_precision as numeric_precision,a.data_scale as numeric_scale,
                    null as extra,b.index_name,
                    lower(b.r_owner) as referenced_table_schema,lower(b.r_table_name) as referenced_table_name,lower(b.r_column_name) as referenced_column_name,
                    case when b.constraint_type = 'P' then 'PRIMARY' else (case when b.constraint_type = 'R' then b.r_constraint_name else null end) end as constraint_name,
                    case when b.constraint_type = 'P' then 'PRIMARY KEY' else (case when b.constraint_type = 'R' then 'FOREIGN KEY' else null end) end as constraint_type
                from user_tab_columns a
                left outer join
                (select distinct owner,table_name,constraint_name,column_name,r_owner,r_table_name,r_column_name,r_constraint_name,position,constraint_type,index_name
                 from   (select uc.owner,uc.table_name,uc.constraint_name,cols.column_name,uc.r_owner,
                              (select table_name from user_constraints where constraint_name = uc.r_constraint_name and owner = '%s') r_table_name,
                              (select column_name from user_cons_columns where constraint_name = uc.r_constraint_name and position = cols.position and owner = '%s') r_column_name,
                              uc.r_constraint_name,
                              cols.position,
                              uc.constraint_type,
                              index_name
                        from user_constraints uc
                        inner join user_cons_columns cols
                        on uc.constraint_name = cols.constraint_name and uc.owner = '%s'
                        where constraint_type != 'C')) b
                on a.table_name = b.table_name and a.column_name = b.column_name and b.owner = '%s'
                order by a.table_name,a.column_id
            """) % (str(db_schema), str(db_schema), str(db_schema), str(db_schema), str(db_schema))

    utilities.print_info("Generating metadata query completed...")

    return qry