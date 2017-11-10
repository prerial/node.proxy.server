module.exports = function(grunt) {
    var app_files = [
            'client.webserver/common/*.js',
            'client.webserver/services/*.js',
            'client.webserver/directives/*.js',
            'client.webserver/components/*.js'
        ],
        modules = 'client.webserver/app.js',
        output = 'client.webserver/main.js',
        test_output = 'client.webserver/tests/built.js';

// Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates:    {
            dmcviews:          {
                src:        [
                    'client.webserver/directives/*.html',
                    'client.webserver/views/*.html',
                    'client.webserver/views/*/*.html'
                ],
                dest:       'client.webserver/templates.js',
                options:    {
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true }
                }
            }
        },
        concat_css: {
            options: {},
            all: {
                src: [
                    "client.webserver/css/demo.css",
                    "client.webserver/css/custom.css",
                    "client.webserver/css/directives.css",
                    "client.webserver/css/rainbow.css",
                    "client.webserver/css/erd.css",
                    "client.webserver/css/navbar.css"
                ],
                dest: "client.webserver/main.css"
            }
        },
        run: {
            commands: {
                exec: 'node server'
            }
        },
        shell: {
            pythonServer: {
                options: {
                    stdout: true
                },
                command: 'C:\\FAST\\anaconda\\python27\\win64\\431\\python.exe C:/FAST/PycharmProjects/workspaces/dmc/server.python/core/dmc_server.py -run s -d'
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    protocol: 'http',
                    hostname: '*',
                    base: './client.webserver',
                    keepalive: true,
//                    debug: true,
                    open: true
                }
            }
        },
        watch: {
            html: {
                files: 'target/html/*.html',
                tasks: ['ngtemplates', 'concat:dist']
            },
            js: {
                files: app_files,
                tasks: ['concat:dist']
            },
            sass: {
                files: ['sass/*.scss'],
                tasks: ['sass:dist']
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [modules, '<%= ngtemplates.dmcviews.dest %>', app_files/*, components */ ],
                dest: output
            },
            test: {
                src: app_files,
                dest: test_output
            }
        },

        karma: {
            options: {
                configFile: 'test/karma-conf.js'
            },
            single: {
                browsers: ['PhantomJS'],
                singleRun: true,
                autoWatch: true
            },
            chrome: {
                browsers: ['Chrome'],
                singleRun: false,
                autoWatch: true
//				},
//				unit: {
//					singleRun: true
//				},
//				continuous: {
//					background: true
            }
        }
        /*
         ,

         sass: {
         dev: {
         options: {
         style: 'expanded'
         },
         files: {
         'target/css/main.css': 'sass/main.scss'
         }
         },
         dist: {
         options: {
         style: 'compressed'
         },
         files: {
         'target/css/main.min.css': 'sass/main.scss'
         }
         }
         }

         ,
         compass: {                  // Task
         dist: {                   // Target
         options: {              // Target options
         sassDir: 'sass',
         cssDir: 'target/css',
         environment: 'production'
         }
         },
         dev: {                    // Another target
         options: {
         sassDir: 'sass',
         cssDir: 'target/css'
         }
         },
         compileWithConfigFile: {
         options: {
         config: 'config.rb'
         }

         }
         }
         */
    });

    // Before generating any new files, remove any previously-created files.


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
//	grunt.loadNpmTasks('grunt-contrib-compass');
//	grunt.loadNpmTasks('grunt-protractor-runner');
//	grunt.loadNpmTasks('grunt-run');

    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('python_server', ['shell:pythonServer']);

    grunt.loadNpmTasks('grunt-run');
    grunt.registerTask('node_server', [ 'ngtemplates', 'concat', 'concat_css','run:commands']);
//    grunt.registerTask('localhost', ['connect:server', 'watch']);

//	grunt.registerTask('serve', ['karma:continuous:start', 'run:mock_server', 'connect:livereload', 'watch:karma']);

//	grunt.registerTask('unit-test', ['karma:continuous:start', 'watch:karma']);

//	grunt.registerTask('local-e2e-test', ['connect:test',  'protractor:continuous', 'watch:protractor']);

//	grunt.registerTask('test', ['karma:unit:start', 'connect:test', 'run:mock_server', 'protractor:e2e']);

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-karma');
//	grunt.loadNpmTasks('grunt-contrib-sass');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-concat-css');
    // Default task(s).
    grunt.registerTask('build', ['ngtemplates', 'concat', 'concat_css'/*, 'compass'*/]);
    grunt.registerTask('default', ['ngtemplates', 'concat', 'concat_css'/*, 'compass'*/]);
};