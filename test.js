console.log("hitokun!");

//var fs = require("fs");
//var request = require("request");
//var option = {
//    url: "https://vision.eyeem.com/photohackday/photos",
//    headers: {
//        "Authorization": "PHOTOHACKDAY123"
//    }
//}
//var path = "public/img/58331258.jpg";
//fs.createReadStream(path).pipe(request.put(option, function (error, res) {
//    console.log(res);
//    console.log(error);
//}));

var sys = require('sys')
var exec = require('child_process').exec;
var child;
var path = "public/img/58331258.jpg";
var commandLine = "curl -i -XPOST https://vision.eyeem.com/photohackday/photos -H \"Authorization: PHOTOHACKDAY123\" -T \"" + path + "\"";
child = exec(commandLine, function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //sys.print('stdout: ' + stdout);
    //sys.print('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});