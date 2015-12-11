var express = require('express');
var router = express.Router();
var requestify = require("requestify");
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs'),
    request = require("request");
//var exec = require('child_process').exec; // ”ñ“¯Šú‚Å•s•Ö‚È‚Ì‚Å
var exec = require('sync-exec'); // ‘ã‚í‚è‚É‚±‚Á‚¿‚ðŽg‚¤

var API_URL_PHOTO = "http://api.eyeem.com/photos/:id";
var API_URL_COMMENT = "http://api.eyeem.com/photos/:id/comments";

//    var photoId = 76664428;
var photoId = 58331258;
var CLIENT_ID = "egaTWyXw1czK9XU49gIIMQdZrSySZ4US";

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get("/loadImage", function (req, res) {
    console.log(req.query.photoUrl);
    var imgPath = "public/img/" + req.query.photoId + ".jpg";

    var r = request(req.query.photoUrl).pipe(fs.createWriteStream(imgPath));
    r.on('close', function () {

        var curlCommand = "curl";
        var isWindows = /^win/.test(process.platform);
        if(isWindows){
            curlCommand = "C:/Users/jgpua_000/AppData/Local/Apps/cURL/bin/curl.exe";
        }
        var commandLine = curlCommand + " -i -XPOST https://vision.eyeem.com/photohackday/photos -H \"Authorization: PHOTOHACKDAY123\" -T \"" + imgPath + "\"";

        console.log("VISION API command:" + commandLine);

        var apiRes = exec(commandLine);
        if(apiRes.stderr){
            console.log('error: ' + apiRes.stderr);
            return res.error(apiRes.stderr);
        }
        var stdout = apiRes.stdout;

        var sIdx = stdout.indexOf("{");
        var eIdx = stdout.indexOf("}");

        console.log("stdout:" + stdout);
        console.log("sIdx:" + sIdx + ", eIdx:" + eIdx);
        var jsonStr = (stdout.substring(sIdx, eIdx + 1));
        console.log(jsonStr);
        var json = JSON.parse(jsonStr);
        console.log(json.location);
        var uuid = json.location.split("/")[5];
        console.log(uuid);

        res.json({uuid: uuid});

        //var child = exec(commandLine, function (error, stdout, stderr) {
        //
        //    if (error) {
        //        res.json({error: error});
        //    }
        //
        //    var sIdx = stdout.indexOf("{");
        //    var eIdx = stdout.indexOf("}");
        //    console.log("stdout:" + stdout);
        //    console.log("stderr:" + stderr);
        //    console.log("sIdx:" + sIdx + ", eIdx:" + eIdx);
        //    var jsonStr = (stdout.substring(sIdx, eIdx + 1));
        //    console.log(jsonStr);
        //    var json = JSON.parse(jsonStr);
        //    console.log(json.location);
        //    var uuid = json.location.split("/")[5];
        //    console.log(uuid);
        //
        //    res.json({uuid: uuid});
        //
        //    console.log(stderr);
        //    //sys.print('stdout: ' + stdout);
        //    //sys.print('stderr: ' + stderr);
        //    if (error !== null) {
        //        console.log('exec error: ' + error);
        //    }
        //});

        //res.json({koas: "hisd"});
    });
    r.on('error', function (message) {
        console.log(message);
    });
});

module.exports = router;
