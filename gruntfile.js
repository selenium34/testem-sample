module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 9000,
          base: '.',
          debug: false
        }
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/tests/index.html?phantom=true'
          ]
        }
     }
    },

    /**
     * Lint the JS
     */
    jshint: {
      files: 'src/js/*.js',
      options: {
        jshintrc: '.jshintrc',
        ignores: ['.jshintrc', 'src/js/version.js', 'src/js/etc/**/*']
      }
    },

    concat: {
      options: {
        stripBanners: false
      },
      js: {
        src: ['src/js/hello.js'],
        dest: 'build/js/hello.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        preserveComments: 'some',
      },
      js: {
        files: {
          'build/js/hello.min.js' : ['build/js/hello.js'],
        }
      }
    },

    shell: {
      instrument: {
        command: "istanbul instrument --output tests/instrumented.js build/js/hello.js"
      },
      report: {
        command: "istanbul report --root tmp/coverage/from_browsers --dir tmp/coverage lcov"
      },
      options: {
        stdout: true,
        failOnError: true
      }
    },

    testem: {
      options: {
        output: {
          coverage: "tmp/coverage/from_browsers/"
        }
      },
      main: {
        src: [ "testem.json" ],
        dest: 'tmp/results.tap'
      }
    },

    clean: {
      instrumented: ['tests/instrumented.js']
    }
  });

  // Load everything up
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-testem');

  grunt.registerTask('test', ['clean', 'jshint', 'concat:js', 'uglify', 'shell:instrument', 'testem', 'shell:report', 'clean:instrumented']);

};
