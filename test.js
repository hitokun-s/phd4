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


var exec = require('child_process').exec;
var path = "public/img/58331258.jpg";
var commandLine = "curl -i -XPOST https://vision.eyeem.com/photohackday/photos -H \"Authorization: PHOTOHACKDAY123\" -T \"" + path + "\"";
var child = exec(commandLine, function (error, stdout, stderr) {
    console.log(stdout);
    var jsonStr = (stdout.substring(sIdx, eIdx + 1));
    console.log(jsonStr);
    var json = JSON.parse(jsonStr);
    console.log(json.location);
    console.log(json.location.split("/")[5]);

    console.log(stderr);
    //sys.print('stdout: ' + stdout);
    //sys.print('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});