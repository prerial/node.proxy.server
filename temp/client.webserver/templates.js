angular.module('dmcviews').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('client.webserver/directives/tooltip.html',
    "<div class=\"tooltip-container\"><span class=\"tooltip-arrow\"></span><div class=\"tooltip-inner\"></div></div>"
  );


  $templateCache.put('client.webserver/views/anchorModelView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\"><div style=\"float:right;margin-top:8px\"><button type=\"button\" ng-click=\"$ctrl.cancel()\" class=\"btn btn-xs btn-primary btn-linked\">&lt; Back</button> <button type=\"submit\" class=\"btn btn-xs btn-primary btn-linked\"><a href=\"javascript:void(0)\" id=\"dlbtn\">Save DDL</a></button> <button type=\"submit\" class=\"btn btn-xs btn-primary btn-linked\"><a href=\"javascript:void(0)\" id=\"dmbtn\">Save DML</a></button></div></div><div id=\"erDiagram\" class=\"top\" style=\"position:absolute;top:60px;z-index:100\"></div>"
  );


  $templateCache.put('client.webserver/views/connectionsView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\" style=\"margin-top:0;top:50px\"><div style=\"float:right;margin-top:8px\"><button class=\"btn btn-xs btn-primary btn-linked\"><a href=\"\" data-toggle=\"modal\" ng-click=\"$ctrl.gotoDetail(null)\" data-target=\"#connectionModal\">Add Connection</a></button></div></div><div class=\"container-view\" style=\"margin:110px 40px\"><div><h3>Manage Connections</h3><table class=\"table table-striped table-bordered\"><thead><tr><th></th><th>Data Source Name</th><th>Connection String</th><th>Database Name</th><th>Schema</th><th></th></tr></thead><tr ng-repeat=\"conn in $ctrl.connections\" ng-click=\"$ctrl.gotoDetail(conn, $index)\" ng-class=\"{selected: conn === $ctrl.selectedConn}\"><td style=\"text-align: center\">{{$index+1}}</td><td><a href=\"\" data-toggle=\"modal\" data-target=\"#connectionModal\">{{conn.conn_name}}</a></td><td>{{conn.conn_string }}</td><td>{{conn.conn_db}}</td><td>{{conn.conn_schema}}</td><td style=\"text-align: center\"><button class=\"delete\" ng-click=\"$ctrl.delete(conn); $event.stopPropagation()\">x</button></td></tr></table></div></div><!-- Modal - Manage Connections--><div class=\"modal fade\" id=\"connectionModal\" role=\"dialog\"><div class=\"modal-dialog\"><!-- Modal content--><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\">Connection Parameters</h4></div><form name=\"connectionForm\" novalidate ng-submit=\"$ctrl.formSubmit($ctrl.connection)\" class=\"form-horizontal\"><div class=\"modal-body\"><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_name\">Data Source Name:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_name\" name=\"conn_name\" id=\"conn_name\" placeholder=\"Please enter connection name\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"username\">User Name:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_username\" name=\"username\" id=\"username\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_password\">Password:</label><div class=\"col-sm-7\"><input type=\"password\" class=\"form-control\" ng-model=\"$ctrl.connection.conn_password\" name=\"conn_password\" id=\"conn_password\" placeholder=\"Please enter Password\" ng-required=\"true\" required></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_string\">Connection String:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_string\" name=\"conn_string\" id=\"conn_string\" placeholder=\"Please enter connection string\" ng-required=\"true\" required></div></div><!-- TODO - Replace with below  --><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_db\">Database:</label><div class=\"col-sm-7\"><select class=\"form-control\" ng-model=\"$ctrl.connection.conn_db\" name=\"conn_db\" id=\"conn_db\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Database</option><option ng-repeat=\"option in $ctrl.databases\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"conn_schema\">Schema:</label><div class=\"col-sm-7\"><input class=\"form-control\" ng-model=\"$ctrl.connection.conn_schema\" id=\"conn_schema\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div></div></div><!--/body--><div class=\"modal-footer\"><div style=\"margin-right:50px\"><button type=\"button\" ng-click=\"\" class=\"btn btn-primary\" data-dismiss=\"modal\">Test Connection</button> <button type=\"submit\" ng-disabled=\"!connectionForm.$valid\" class=\"btn btn-primary\">Save</button> <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button></div></div></form></div></div></div><!--- End Modal -->"
  );


  $templateCache.put('client.webserver/views/dataModelView.html',
    "<div class=\"container-fluid breadcrumb-wrapper\"><form name=\"anchorsForm\" novalidate class=\"form-horizontal\" ng-submit=\"$ctrl.submitForm(source)\"><div style=\"float:right;margin-top:8px\"><label style=\"margin-right:12px\">Select Tables:</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"anchor\"> Anchor</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"include\"> Include</label><label style=\"margin-right:8px;font-weight:500\"><input type=\"radio\" ng-model=\"$ctrl.anchoroot.type\" value=\"exclude\"> Exclude</label><button ng-disabled=\"!anchorsForm.$valid\" type=\"submit\" class=\"btn btn-xs btn-primary\">Submit</button> <button type=\"button\" ng-click=\"$ctrl.resetAnchorsForm()\" class=\"btn btn-xs btn-primary\">Reset</button></div></form></div><div id=\"erDiagram\" class=\"top\" style=\"position:absolute;top:60px;z-index:100\"></div>"
  );


  $templateCache.put('client.webserver/views/loginAdminView.html',
    "<div class=\"container-view\"><div class=\"row\"><div class=\"col-md-12\"><form name=\"loginForm\" novalidate ng-submit=\"formSubmit()\" class=\"form\"><div class=\"col-md-4\"><h3>Please Login</h3><div class=\"form-group\"><label for=\"username\">User Name</label><div id=\"username-error\" class=\"popover\" ng-messages=\"loginForm.username.$error\"><span ng-message=\"required\">User name is required.</span></div><input type=\"text\" id=\"username\" name=\"username\" pre-tooltip class=\"form-control\" ng-model=\"username\" placeholder=\"Please enter Username\" ng-required=\"true\" required></div><div class=\"form-group\"><label for=\"password\">Password</label><div id=\"password-error\" class=\"popover\" ng-messages=\"loginForm.password.$error\"><span ng-message=\"required\">Password is required.</span></div><input type=\"password\" id=\"password\" name=\"password\" pre-tooltip class=\"form-control\" ng-model=\"password\" placeholder=\"Please enter Password\" ng-required=\"true\" required></div><div class=\"form-group\"><button ng-disabled=\"!loginForm.$valid\" type=\"submit\" class=\"btn btn-primary\">Login</button> <span class=\"text-danger\">{{ error }}</span></div></div></form></div></div></div>"
  );


  $templateCache.put('client.webserver/views/sourceSchemaView.html',
    "<div class=\"container container-view\"><div class=\"row\"><div class=\"col-md-14\"><div class=\"row\"><div class=\"col-md-6\"><h3 class=\"col-sm-offset-4\">Reverse Engineering</h3><form name=\"sourceSchemaForm\" novalidate class=\"form-horizontal\" ng-submit=\"$ctrl.submitForm(source)\"><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"source_include\" style=\"white-space:nowrap\">Data Source:</label><div class=\"col-sm-8\"><select ng-model=\"source.schema_include\" class=\"form-control\" id=\"source_include\" name=\"source_include\" placeholder=\"Please select source\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Data Source</option><option ng-repeat=\"option in $ctrl.datasource.dataSource\" value=\"{{option.conn_name}}\">{{option.conn_name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"target\" style=\"white-space:nowrap\">Data Model Type:</label><div class=\"col-sm-8\"><select ng-model=\"source.schema_target\" class=\"form-control\" id=\"target\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Database</option><option ng-repeat=\"option in $ctrl.datasource.dataModelType\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"sdatabase\">Source Database:</label><div class=\"col-sm-8\"><select ng-model=\"source.sdatabase\" class=\"form-control\" id=\"sdatabase\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Source Database</option><option ng-repeat=\"option in $ctrl.datasource.databaseSource\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tdatabase\">Target Database:</label><div class=\"col-sm-8\"><select ng-model=\"source.tdatabase\" class=\"form-control\" id=\"tdatabase\" ng-required=\"true\" required><option value=\"\" disabled selected>Please select Target Database</option><option ng-repeat=\"option in $ctrl.datasource.databaseTarget\" value=\"{{option.name}}\">{{option.name}}</option></select></div></div><div class=\"form-group\"><div class=\"col-sm-offset-4 col-sm-8\"><div class=\"checkbox\"><label><input ng-model=\"source.single\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\" value=\"false\" name=\"single\">Single Step Denormalization</label></div></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"anchor\">Anchors:</label><div class=\"col-sm-8\"><input ng-model=\"source.anchors\" class=\"form-control\" id=\"anchor\" placeholder=\"Enter list of Anchor tables\" name=\"anchor\"></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tbl_incl\" style=\"white-space:nowrap\">Include Tables:</label><div class=\"col-sm-8\"><input ng-model=\"source.tables_include\" class=\"form-control\" id=\"tbl_incl\" placeholder=\"Enter list of tables to include\" name=\"tbl_incl\"></div></div><div class=\"form-group\"><label class=\"control-label col-sm-4\" for=\"tbl_excl\" style=\"white-space:nowrap\">Exclude Tables:</label><div class=\"col-sm-8\"><input ng-model=\"source.tables_exclude\" class=\"form-control\" id=\"tbl_excl\" placeholder=\"Enter list of tables to exclude\" name=\"tbl_excl\"></div></div><div class=\"form-group\"><div class=\"col-sm-offset-4 col-sm-8\"><button ng-disabled=\"!sourceSchemaForm.$valid\" type=\"submit\" class=\"btn btn-primary\">Submit</button> <button type=\"button\" class=\"btn btn-primary btn-linked\"><a href=\"#/connections\">Close</a></button></div></div><!--                <pre>source = {{source | json}}</pre> --></form></div></div></div></div></div>"
  );

}]);