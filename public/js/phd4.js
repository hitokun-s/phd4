var drag = d3.behavior.drag().on("drag", function (d, i) {
    d.x += d3.event.dx;
    d.y += d3.event.dy;
    d3.select(this).attr({
        x: d.x,
        y: d.y,
        transform:"translate("+ d.x+","+ d.y+")"
    });
});

var API_URL_PHOTO = "http://api.eyeem.com/photos/:id";
var API_URL_COMMENT = "http://api.eyeem.com/photos/:id/comments";

var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var CLIENT_ID = "egaTWyXw1czK9XU49gIIMQdZrSySZ4US";
var svg = d3.select("svg");

var download = function () {
    console.log($("#svg").html());
    ctx2.drawSvg("<svg>"+ $("#svg").html() +"</svg>");
    ctx.drawImage(canvas2, 0, 0);
    $("#svg").remove();
    canvas.toBlob(function(blob) {
        saveAs(blob, "123.png");
    }, "image/png");
}
$("#download").click(download);

var height,width;

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
            width:width,
            height:height
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


    //["Hello!", "This is wondeful picture!"].forEach(function(v){
    //    var g = svg.append("g").attr({
    //        transform:"translate(60,80)",
    //        x: 60,
    //        y: 80
    //    }).datum({x: 60, y: 80}).call(drag);
    //    g.append("text").text(v).attr({
    //        class: "text",
    //        "font-family": "Times New Roman",
    //        "font-size": "20px"
    //    }).call(addBorder, {});
    //});


//        ctx2.scale(13/6, 13/6);
}
var photoId;
var loadPhoto = function(){
    //    var photoId = 76664428;
    //var photoId = 58331258;

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
            loadImage(photoId); // この時点で、サーバに画像が、/img/[photoId].jpg として保存されているはず！
        });
    });
    //　retrive comments
    $.get(API_URL_COMMENT.replace(":id", photoId), {client_id: CLIENT_ID}, function (data) {
        console.log(data.comments);
        data.comments.items.forEach(function (item) {
            //console.log(item.message);
//                console.log(item.user);
//            $("#comments").append($("<li/>").text(item.message));
        });
    });
}

$(function () {
    $("#btn-photo-load").click(loadPhoto);
    $("#chk-baloon").change(function(v){
        console.log(this.checked);
        if(this.checked){
            addBaloon();
        }
    });
    $("#btn-secret").click(function(){
        var uuid = "a54c1f6e-3481-4163-86f5-772099eecfd5";
        // https://vision.eyeem.com/photohackday/photos/UUID-from-POST-request -H "Authorization: PHOTOHACKDAY123"
        $.ajax({
            url: "https://vision.eyeem.com/photohackday/photos/" + uuid,
            type: 'GET',
            headers: {
                "Authorization":"PHOTOHACKDAY123"
            },
            dataType: 'json'
        }).done(function(data) {
            console.log(data);
            var part = [];
            for(var i= 0;i<10;i++){
                part.push(data.concepts[i]);
            }
            addComments(part.map(function(v){
                return "Great " + v + "!!";
            }));
        });
    });
});

