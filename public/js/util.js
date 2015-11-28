var addBorder = function (text, opt) {
    var text_width = text.node().getBBox().width;
    var text_height = text.node().getBBox().height;

    text.attr("dominant-baseline", "middle");

    var padding_left = opt["padding-left"] || 10;
    var padding_right = opt["padding-right"] || 10;
    var padding_top = opt["padding-top"] || 3;
    var padding_bottom = opt["padding-bottom"] || 3;

    var parent = d3.select(text.node().parentNode);

    var base_bottom = text_height / 2 + padding_bottom;

    parent.append("polygon").attr({
        points: "0," + (base_bottom - 3) + " 10," + (base_bottom + 7) + " 20," + (base_bottom - 3),
        fill: "white",
        //stroke: "black",
        //"stroke-width": 2,
        idx: 1
    });
    parent.append("path").attr({
        d: "M 0 " + base_bottom + "  L 10 " + (base_bottom + 8) + " L 20 " + base_bottom,
        stroke: "black",
        "stroke-width": 3,
    });

    parent.append("rect").attr({
        width: text_width + padding_left + padding_right,
        height: text_height + padding_top + padding_bottom,
        y: -text_height / 2 - padding_top,
        x: -padding_left,
        idx: 2,
        rx: 10,
        ry: 10,
        fill: "white",
        stroke: "black",
        "stroke-width": 3
    });

    d3.selectAll(parent.node().childNodes).sort(function (a, b) {
        console.log(a);
        console.log(b);
        return 1;
    });
};