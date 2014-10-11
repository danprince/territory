var project = require('./package'),
    colors = require('colors');

module.exports = function(grunt) {

  var config = {

    // expose for templating
    project: project,

    // Browserify
    // ----------
    // Concatenates all of our JS files
    // and allows to use node style
    // CommonJS modules, using `require()`.
    browserify: {

      dev: {
        options: {
          // this option creates
          // source maps for your
          // code.
          debug: true
        },

        src: 'client/scripts/app.js',
        dest: 'static/assets/js/<%= project.name %>.js'
      },

      prod: {
        src: 'client/scripts/app.js',
        dest: 'static/assets/js/<%= project.name %>.min.js',
        options: {
          transform: ['uglifyify']
        }
      }
    },

    // SASS
    // ----
    // Allows us to write SCSS rather
    // than regular CSS. Concatenates
    // our files using `import`.
    sass: {
      dev: {
        files: [{
          // Destination                               Source
          'static/assets/css/<%= project.name %>.css': 'client/styles/index.scss'
        }],
        options: {
          debug: true
        }
      },
      prod: {
        files: [{
          // Destination                               Source
          'static/assets/css/<%= project.name %>.css': 'client/styles/index.scss'
        }]
      }
    },


    // Watch
    // -----
    // Constantly observes files for
    // changes and executes other tasks
    // when they change.
    watch: {
      server: {
        files: 'server/modules/**/*.js',
        tasks: ['mochaTest'],
        options: {
          livereload: true
        }
      },
      js: {
        files: 'client/scripts/**/*.js',
        tasks: ['browserify:dev'],
        options: {
          livereload: true
        }
      },
      scss: {
        files: 'client/styles/**/*.scss',
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['static/**/*.html'],
        options: {
          livereload: true
        }
      }
    },

    // HTTP Server
    // -----------
    // Lightweight HTTP server that
    // acts as a dev-ready
    // way to serve your static files.
    'http-server': {
      dev: {
        root: './static',
        port: 4242,
        host: 'localhost',
        // This enables `watch` to work
        runInBackground: true
      }
    },

    // Unit Tests
    // ----------
    // Run the Mocha tests every time
    // that grunt runs
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: 'server/test/test.js'
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('dev', ['browserify:dev', 'sass:dev']);
  grunt.registerTask('prod', ['browserify:prod', 'sass:prod']);
  grunt.registerTask('default', ['http-server', 'dev', 'watch']);

  // Output a display message to remind
  // the developer of which mode they
  // are in
  var status = {
    dev: [project.name, ':development'.green].join(''),
    prod: [project.name, ':production'.red].join(''),
  };

  var task = grunt.cli.tasks[0];
  console.log('\n' + (status[task] || status.dev) + '\n');
};

