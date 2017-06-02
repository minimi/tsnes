module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      source: {
        src: ["build/*.js", "build/mappers/*.js"],
        dest: "dist/jsnes.js"
      }
    },
    // uglify: {
    //   source: {
    //     src: "dist/jsnes.js",
    //     dest: "dist/jsnes.min.js"
    //   }
    // },
    // jshint: {
    //   source: {
    //     src: "src/*.js"
    //   }
    // }
  });

  //grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat'/*, 'uglify'*/]);

};
