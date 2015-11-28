var express = require('express');
var router = express.Router();
var requestify = require("requestify");
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs'),
    request = require("request");


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

    var r = request(req.query.photoUrl).pipe(fs.createWriteStream("public/img/" + req.query.photoId + ".jpg"));
    r.on('close', function () {
        res.json({koas: "hisd"});
    });
    r.on('error', function (message) {
        console.log(message);
    });
});

module.exports = router;
