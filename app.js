var fs = require('fs');
var dotenv = require('dotenv');
var path = require('path');
dotenv.load();


var properties_file_path = process.env.PROPERTIES;
var properties_file_name = properties_file_path.substring(properties_file_path.lastIndexOf('/') + 1, properties_file_path.length);
var properties_path = properties_file_path.substring(0, properties_file_path.lastIndexOf('/'));
var multi_lang_daemon_class = 'com.amazonaws.services.kinesis.multilang.MultiLangDaemon';
var jarsPath = path.join(__dirname, '/lib/jars');
var javaClassPaths = '';

fs.readdir(jarsPath, function(err, dir) {
    if (err) {
        throw err
    }
    dir.forEach(function(file) {
        if (file.substring(file.length - 4) === '.jar') {
            javaClassPaths += jarsPath + '/' + file + ':';
        }
    });
    javaClassPaths += properties_path;

    if (process.argv[2] === '--print') {
        console.log(process.env.JAVA, '-cp', javaClassPaths, multi_lang_daemon_class, properties_file_name);
    } else {
        execute(javaClassPaths);
    }
});

function execute(javaClassPaths) {
    var spawn = require('child_process').spawn;
    var command = spawn(process.env.JAVA, ['-cp', javaClassPaths, multi_lang_daemon_class, properties_file_name]);

    command.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    command.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    command.on('close', function(code) {
        console.log('child process exited with code ' + code);
    });
}