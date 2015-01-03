'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble'); // Doesn't follow the grunt-* naming scheme and therefore isn't loaded automatically

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'app',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,yml,json}'],
        tasks: ['assemble']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      images: {
        files: ['<%= config.src %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg,ico}', '<%= config.src %>/images/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
        options: {
          spawn: false,
        }
      },
      scripts: {
        files: ['<%= config.src %>/assets/scripts/**/*'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: {
          spawn: false,
        }
      },
      styles: {
        files: ['<%= config.src %>/assets/scss/{,*/}*.scss'],
        tasks: ['sass', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg,ico}'
        ]
      }
    },

    //Grunt server settings
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      options: {
        flatten: true,
        assets: '<%= config.dist %>/assets',
        data: '<%= config.src %>/data/*.{json,yml}',
        layout: '<%= config.src %>/templates/layouts/default.hbs',
        partials: '<%= config.src %>/templates/partials/*.hbs'
      },
      site: {
        options: {
          layout: '<%= config.src %>/templates/layouts/default.hbs'
        },
        src: ['<%= config.src %>/templates/site/*.hbs'],
        dest: '<%= config.dist %>'
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: [
      '<%= config.dist %>/**/*.{html,xml}'
    ],


    //Compile SCSS
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          '<%= config.dist %>/assets/style.min.css': '<%= config.src %>/assets/scss/style.scss'
        }
      }
    },
    //Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9'],
        map: true
      },
      no_dest: {
        src: '<%= config.dist %>/assets/style.min.css'
      },
    },


    //JAVASCRIPT
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= config.src %>/assets/scripts/custom/{,*/}*.js',
        '!<%= config.src %>/assets/scripts/vendor/*'
      ]
    },
    //Stick everything together, you'll need to specify JS files in the correct order here.
    concat: {
      dist: {
        src: [
          '<%= config.src %>/assets/scripts/vendor/jquery/dist/jquery.js',
          '<%= config.src %>/assets/scripts/vendor/handlebars/handlebars.js',
          '<%= config.src %>/assets/scripts/custom/**/*.js'
        ],
        dest: '<%= config.dist %>/assets/scripts.js',
      },
    },
    //Uglify
    uglify: {
      build: {
        src: '<%= config.dist %>/assets/scripts.js',
        dest: '<%= config.dist %>/assets/scripts.min.js'
      },
      modernizer: {
        src: '<%= config.src %>/assets/scripts/vendor/modernizer/modernizr.js',
        dest: '<%= config.dist %>/assets/modernizr.min.js'
      }
    },

    //IMAGES
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/assets/images',
          src: ['**/*.{png,jpg,jpeg,gif,webp,svg,ico}'],
          dest: '<%= config.dist %>/images'
        }]
      }
    }

  });


  grunt.registerTask('server', [
    'clean',
    'assemble',
    'sass',
    'autoprefixer',
    'jshint',
    'concat',
    'uglify',
    'imagemin',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'assemble',
    'sass',
    'autoprefixer',
    'jshint',
    'concat',
    'uglify',
    'imagemin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
