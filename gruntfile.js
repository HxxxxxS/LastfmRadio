module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      vendorjs: {
        files: ["public/js/\*\*/\*.ts"],
        tasks: ['ts', 'uglify']
      }
    },
    ts: {
      app: {
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
          dest: "./public/js"
        }],
        options: {
          module: "commonjs",
          //target: "es6",
          sourceMap: false,
          rootDir: "public/js"
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", [
    "ts"
  ]);

};
