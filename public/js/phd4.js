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

//    var photoId = 76664428;
var photoId = 58331258;
var CLIENT_ID = "egaTWyXw1czK9XU49gIIMQdZrSySZ4US";

var publish = function () {
    ctx2.drawSvg(document.getElementsByTagName('svg')[0].innerHTML);
    ctx.drawImage(canvas2, 0, 0);
    $("#svg").remove();
}
$("#publish").click(publish);

var loadImage = function (photoId) {

    if (!canvas || !canvas.getContext) {
        return false;
    }

    ctx.strokeStyle = "#000";
    var img = new Image();
    img.onload = function () {
        console.log("on load!");
        ctx.drawImage(img, 0, 0);
    };
    img.src = "img/" + photoId + ".jpg";
    var svg = d3.select("svg");
    svg.attr("width", 600);
    svg.attr("height", 600);


    ["Hello!", "This is wondeful picture!"].forEach(function(v){
        var g = svg.append("g").attr({
            transform:"translate(60,80)",
            x: 60,
            y: 80
        }).datum({x: 60, y: 80}).call(drag);
        g.append("text").text(v).attr({
            class: "text",
            "font-family": "Times New Roman",
            "font-size": "20px"
        }).call(addBorder, {});
    });


//        ctx2.scale(13/6, 13/6);
}
$(function () {
    $.get(API_URL_PHOTO.replace(":id", photoId), {client_id: CLIENT_ID}, function (data) {
        console.log(data);
        console.log(data.photo.photoUrl);
        $.get("loadImage", {
            photoUrl: data.photo.photoUrl,
            photoId: photoId
        }, function (data) {
            loadImage(photoId); // この時点で、サーバに画像が、/img/[photoId].jpg として保存されているはず！
        });
    });
    //　retrive comments
    $.get(API_URL_COMMENT.replace(":id", photoId), {client_id: CLIENT_ID}, function (data) {
        console.log(data.comments);
        data.comments.items.forEach(function (item) {
            //console.log(item.message);
//                console.log(item.user);
            $("#comments").append($("<li/>").text(item.message));
        });
    });
});

