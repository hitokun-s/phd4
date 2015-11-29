module.exports = function(grunt) {
    grunt.initConfig({

        md2html: {
            multiple_files: {
                options: {
                    //layout: 'path/to/layout.html',
                    //basePath: 'path/to',
                    markedOptions: {
                        gfm: true,
                        langPrefix: 'code-'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'md',
                    src: ['**/*.md'],
                    dest: 'md/out',
                    ext: '.html'
                }]
            }
        },
        ejs: {
            all: {
                src: ['**/*.ejs', '!header.ejs', '!footer.ejs'],
                dest: 'public',
                expand: true,
                ext: '.html',
                cwd:'ejs',
                options: {
                    title:"Commentie",
                    path : "",// 相対パス
                    require:require
                }
            },
        },
        copy: {
            build: {
                cwd: 'app',
                src: [ 'js/*','style/*', '!**/*.jade' ],
                dest: 'build',
                expand: true
            }
        },

        watch: {
            grunt: { files: ['Gruntfile.js'] },
            jade: {
                files: ['ejs/*.ejs'],
                tasks: ['ejs']
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: 'build',
                    hostname: '*'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css', // 相対パス
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-md2html');
    //grunt.loadNpmTasks("grunt-contrib-copy");
    //grunt.loadNpmTasks('grunt-contrib-connect');

    // とりあえず、変更があったらejs再実行、だけできればいい。
    // jsをminifyしてコピー、とかしたいならcopyタスク追加してください。
    grunt.registerTask('default',"Convert ejs templates into html templates", ['md2html', 'ejs', 'watch']);
};