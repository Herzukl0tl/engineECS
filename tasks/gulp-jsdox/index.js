'use strict';
var jsdox = require("jsdox"),
    es = require('event-stream'),
    fs = require('fs');;

function findRoute(path, opt){
    var root = opt.root || 'src';
    var destructuredPath = path.split('/');
    var file = destructuredPath.pop();
    var finalPath = '';
    var basePath = opt.output+'/';
    for(var i = destructuredPath.length-1; i >= 0; i--){
        if(destructuredPath[i] === root) break;
        finalPath = destructuredPath[i] + '/' + finalPath;
    }
    finalPath = basePath+finalPath;
    generateDirs(finalPath);
    return finalPath;
}

function generateDirs(path){
    var destructuredPath = path.split('/');
    path = '';
    for(var i = 0; i < destructuredPath.length; i++){
        path += destructuredPath[i] + '/';
        try{
            var stats = fs.lstatSync(path);
            if (!stats.isDirectory()) {
                fs.mkdirSync(path);
            }
        }
        catch (e){
            fs.mkdirSync(path);
        }
    }
}
module.exports = function(opt) {
    opt = opt || {
        output : 'out/'
    };
    opt.fromString = true;

    return es.map(function (file, callback) {
       var path = findRoute(file.path, opt);
       jsdox.generateForDir(file.path, path, function(){});
       callback(null, file);
    });
};
