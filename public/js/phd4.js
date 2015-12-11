var drag = d3.behavior.drag().on("drag", function (d, i) {
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    d3.select(this).attr({
        x: d.x,
        y: d.y,
        transform: "translate(" + d.x + "," + d.y + ")"
    });
});

var API_URL_PHOTO = "http://api.eyeem.com/photos/:id";
var API_URL_COMMENT = "http://api.eyeem.com/photos/:id/comments";
var API_URL_VISION = "https://vision.eyeem.com/photohackday/photos/:uuid";

var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var CLIENT_ID = "egaTWyXw1czK9XU49gIIMQdZrSySZ4US";
var svg = d3.select("svg");

var download = function () {
    console.log($("#svg").html());
    ctx2.drawSvg("<svg>" + $("#svg").html() + "</svg>");
    ctx.drawImage(canvas2, 0, 0);
    $("#svg").remove();
    canvas.toBlob(function (blob) {
        saveAs(blob, "123.png");
    }, "image/png");
}
$("#download").click(download);

var height, width;

// VISION APIの解析が完了するまでチェックし続ける
var cnt = 0;
var prepareVisionApi = function (uuid) {
    queryVisionApi(uuid,
        function (data) { // successHandler
            console.log("succeed to get Vision API result!");
            alert("Vision API finished to analyze this photo.");
            alert("Now you can click 'secret button'");
            console.log(data);
            visionApiPrepared = true;
        }, function (xmlHttp, status, error) { // errorHandler
            cnt++;
            console.log("Vision API has not analyzed this photo yet. Let's retry...");
            if (cnt < 20) {
                setTimeout(function () {
                    prepareVisionApi(uuid);
                }, 1000);
            }
        });
}

var loadImage = function (photoId) {

    if (!canvas || !canvas.getContext) {
        return false;
    }

    ctx.strokeStyle = "#000";
    var img = new Image();
    img.onload = function () {
        console.log("on load!");
        height = img.height;
        width = img.width;
        svg.attr({
            width: width,
            height: height
        });
        $("#stage").attr("width", width);
        $("#stage").attr("height", height);
        $("#stage").css("width", width);
        $("#stage").css("height", height);
        $("#canvas").attr("width", width);
        $("#canvas").attr("height", height);
        $("#canvas2").attr("width", width);
        $("#canvas2").attr("height", height);
        ctx = canvas.getContext('2d');
        ctx2 = canvas2.getContext('2d');

        ctx.drawImage(img, 0, 0);
    };
    img.src = "img/" + photoId + ".jpg";

    svg.attr("width", 600);
    svg.attr("height", 600);

    loadComments();
}
var photoId; // sample 76664428, 58331258, 76667292
var uuid;
var visionApiPrepared = false;

var clearStage = function(){
    svg.selectAll("*").remove();
    visionApiPrepared = false;
}

var loadPhoto = function () {

    clearStage();

    // https://www.eyeem.com/p/76667292
    photoId = parseInt($("#input-photo-url").val().split("/")[4]);

    $.get(API_URL_PHOTO.replace(":id", photoId), {client_id: CLIENT_ID}, function (data) {
        console.log(data);
        console.log(data.photo.photoUrl);
        $.get("loadImage", {
            photoUrl: data.photo.photoUrl,
            photoId: photoId
        }, function (data) {
            console.log(data);
            uuid = data.uuid; // {uuid:123456789} のように、VISION APIが発行したuuidが返る
            prepareVisionApi(uuid);
            loadImage(photoId); // この時点で、サーバに画像が、/img/[photoId].jpg として保存されているはず！
        });
    });
}

var queryVisionApi = function (uuid, successHandler, errorHandler) {
    //var uuid = "a54c1f6e-3481-4163-86f5-772099eecfd5";
    // https://vision.eyeem.com/photohackday/photos/UUID-from-POST-request -H "Authorization: PHOTOHACKDAY123"
    $.ajax({
        url: API_URL_VISION.replace(":uuid", uuid),
        type: 'GET',
        headers: {
            "Authorization": "PHOTOHACKDAY123"
        },
        dataType: 'json',
        success: successHandler, // function(data, status, xmlHttp)
        error: errorHandler // function(xmlHttp, status, error)
    });
}

$(function () {
    $("#btn-photo-load").click(loadPhoto);
    $("#chk-baloon").change(function (v) {
        console.log(this.checked);
        if (this.checked) {
            addBaloon();
        }
    });
    $("#btn-secret").click(function () {
        if (!visionApiPrepared) {
            alert("EyeEm Vision API is still analyzing this photo.Please wait for a while.");
            return;
        }
        queryVisionApi(uuid, function (data) {
            console.log(data);
            var part = [];
            for (var i = 0; i < 15; i++) {
                part.push(data.concepts[i]);
            }
            addComments(part.map(function (v, i) {
                var prefixes = [
                    "Great ",
                    "Amazing ",
                    "Excellent ",
                    "Nice ",
                    "What a "
                ];
                return prefixes[i % 4] + v + "!!";
            }));
        });
    });
});

