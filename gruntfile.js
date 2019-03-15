module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["newer:ts:src"]
      },
      public: {
        files: ["public/js/\*\*/\*.ts"],
        tasks: ["newer:ts:public", "newer:uglify"]
      },
      sass: {
        files: ["public/scss/\*\*/\*.scss"],
        tasks: ["newer:sass:public", "newer:postcss", "newer:cssmin"]
      }
    },
    ts: {
      src: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          rootDir: "src"
        }
      },
      public: {
        files: [{
          src: ["public/js/\*\*/\*.ts"],
          dest: "public/js"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          rootDir: "public/js"
        }
      }
    },
    sass: {
       public: {
        options: {
          sourcemap: "none",
          style: "expanded"
        },
        files: [{
          expand: true,
          cwd: "public/scss/",
          src: ["\*\*/\*.scss"],
          dest: "public/css/",
          ext: ".css"
        }]
       }
    },
    postcss: { // Begin Post CSS Plugin
      options: {
        map: false,
        processors: [
          require("autoprefixer")({
                browsers: ["last 2 versions"]
              })
        ]
      },
      public: {
        src: "public/css/style.css"
      }
    },
    cssmin: { // Begin CSS Minify Plugin
      public: {
        files: [{
          expand: true,
          cwd: "public/css",
          src: ["\*.css", "!\*.min.css"],
          dest: "public/css",
          ext: ".min.css"
        }]
      }
    },
    uglify: { // Begin JS Uglify Plugin
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
      },
      public: {
        files: [{
          expand: true,
          cwd: "public/js",
          src: ["*.js", "!*.min.js"],
          dest: "public/js",
          rename: function (dst, src) {
            return dst + "/" + src.replace(".js", ".min.js");
          }
        }]
      }
    },
  });
  grunt.loadNpmTasks("grunt-newer");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", [
    "newer:ts:src", "newer:sass", "newer:postcss", "newer:cssmin", "newer:ts:public", "newer:uglify"
  ]);

};
