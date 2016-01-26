$(function () {
    var datas = $('*').filter(function () {
        return Object.keys($(this).data()).length > 0;
    });
    datas.each(function (i, v) {
        if (v.dataset) {
            for (var k in v.dataset) {
                var funcName = v.dataset[k];
                var func = window[funcName];
                if (func && _.isFunction(func)) {
                    v["on" + k] = func;
                } else {
                    console.log(funcName + " is not a function, or not declared!");
                }
            }
        }
    });
});