var addBorder = function (text, opt) {
    console.log(this);
    console.log("aadd border!");
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

var graph = {
    nodes: [
        {id: 1, letter: "H"},
        {id: 2, letter: "E"},
        {id: 3, letter: "L"},
        {id: 4, letter: "L"},
        {id: 5, letter: "O"}
    ],
    links: [
        {source: 0, target: 1},
        {source: 0, target: 2},
        {source: 0, target: 3},
        {source: 0, target: 4},
        {source: 1, target: 2},
        {source: 1, target: 3},
        {source: 1, target: 4},
        {source: 2, target: 3},
        {source: 2, target: 4},
        {source: 3, target: 4}
    ]
};

var force;

var update = function () {

    var link = svg.selectAll(".link")
        .data(force.links(), function (d) {
            return d.source.id + "-" + d.target.id;
        });
    link.enter().append("line").classed("link", true)
        .attr({
            "stroke-width": 2,
            stroke: "gray"
        });
    link.exit().remove();

    var node = svg.selectAll(".node")
        .data(force.nodes(), function (d) {
            return d.id;
        });
    var node_g = node.enter().append("g").classed("node", true);

    node_g.append("circle")
        .attr({
            r: 10,
            stroke: "blue",
            "stroke-width": 2,
            fill: "yellow"
        });
    node_g.append("text").text(function (d) {
        return d.letter;
    }).attr({
        stroke: "red",
        "dominant-baseline": "middle" // verticla centering
    }).attr("x", function () {
        return -this.getBBox().width / 2; // horizontal centering
    });
    node.exit().remove();

    // node forward, link backward
    svg.selectAll(".node, .link").sort(function (a, b) {
        var aIsNode = (a.source === undefined);
        var bIsNode = (b.source === undefined);
        if (aIsNode && !bIsNode) {
            return 1;
        }
        if (!aIsNode && bIsNode) {
            return -1;
        }
        return 0;
    });

    force.on('tick', function () {
        link.attr({
            'x1': function (d) {
                return d.source.x;
            },
            'y1': function (d) {
                return d.source.y;
            },
            'x2': function (d) {
                return d.target.x;
            },
            'y2': function (d) {
                return d.target.y;
            }
        });
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
};

var nodes = d3.range(10).map(function (d, i) {
    return {
        x: Math.random() * 600,
        y: Math.random() * 600,
        r: Math.random() * 50 + 30
    };
});

// collision detection
function collide(node) {
    var r = node.r + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.r + quad.point.r;
            if (l < r) {
                l = (l - r) / l * 0.5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}
var width = 600, height = 600;
var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([height, 0]);

var transform = function (d) {
    return 'translate(' + x(d.x) + ',' + y(d.y) + ')';
};

var addBaloon = function () {
    //svg.selectAll("text").call(addBorder, {});
    svg.selectAll("text").each(function (d, i) {
        d3.select(this).call(addBorder, {});
    });
}
var addComments = function (comments) {
    console.log(width);
    console.log(height);

    comments.forEach(function (v) {
        var x = Math.random() * (width );
        var y = Math.random() * (height - 20);
        var g = svg.append("g").attr({
            transform: "translate(" + x + "," + y + ")",
            x: x,
            y: y
        }).datum({x: x, y: y}).call(drag);
        g.append("text").text(v).attr({
            class: "text",
            "font-family": "Times New Roman",
            "font-size": (Math.random() * 40 + 15) + "px"
        });
    });
}
var API_URL_COMMENT = "http://api.eyeem.com/photos/:id/comments";
var loadComments = function () {

    $.get(API_URL_COMMENT.replace(":id", photoId), {client_id: CLIENT_ID}, function (data) {
        var com = [];
        data.comments.items.forEach(function(v,i){
            if(i < 15){
                com.push(v.message);
            }
        });
        addComments(com);
    });
};
