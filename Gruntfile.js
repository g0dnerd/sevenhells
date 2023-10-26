module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: './',
                    keepalive: true, // This keeps the server running until you stop it
                    open: true       // This will automatically open your default browser to the address
                }
            }
        }
    });

    // Load the Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['connect:server']);

};
