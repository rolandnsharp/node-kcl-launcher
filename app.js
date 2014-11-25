var fs = require('fs');
var dotenv = require('dotenv');
var path = require('path');
dotenv.load();

var propertiesFilePath = process.env.PROPERTIES;
var propertiesFileName = propertiesFilePath.substring(propertiesFilePath.lastIndexOf('/') + 1, propertiesFilePath.length);
var propertiesPath = propertiesFilePath.substring(0, propertiesFilePath.lastIndexOf('/'));
var multiLangDaemonClass = 'com.amazonaws.services.kinesis.multilang.MultiLangDaemon';
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
    javaClassPaths += propertiesPath;

    console.log(process.env.JAVA, '-cp', javaClassPaths, multiLangDaemonClass, propertiesFileName);;
});